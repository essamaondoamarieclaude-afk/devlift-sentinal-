#!/usr/bin/env bash
# =============================================================================
# Deploy Devlift Sentinel to Google Cloud Run
#
# Prerequisites:
#   1. gcloud CLI installed and authenticated (gcloud auth login)
#   2. GCP project created (e.g., devlift-sentinel)
#   3. Required APIs enabled:
#        gcloud services enable run.googleapis.com \
#                               containerregistry.googleapis.com \
#                               secretmanager.googleapis.com \
#                               cloudbuild.googleapis.com
#   4. Docker installed
#
# Usage:
#   chmod +x cloud_run_deploy.sh
#   ./cloud_run_deploy.sh
# =============================================================================

set -euo pipefail

# ─── Configuration ───────────────────────────────────────────────────────────
PROJECT_ID="devlift-sentinel"
REGION="us-central1"
SERVICE_NAME="sentinel-backend"
IMAGE_NAME="gcr.io/${PROJECT_ID}/backend:latest"

# ─── 1. Create secrets in Secret Manager ─────────────────────────────────────
echo "==> Ensuring secrets exist in Secret Manager..."

create_secret() {
    local name=$1
    local value=$2
    if ! gcloud secrets describe "$name" --project="$PROJECT_ID" &>/dev/null; then
        printf "%s" "$value" | gcloud secrets create "$name" \
            --replication-policy="automatic" \
            --data-file=- \
            --project="$PROJECT_ID"
        echo "  Created secret: $name"
    else
        printf "%s" "$value" | gcloud secrets versions add "$name" \
            --data-file=- \
            --project="$PROJECT_ID" 2>/dev/null || true
        echo "  Updated secret: $name"
    fi
}

# Source local .env to read values (fail silently if .env missing)
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

create_secret "SUPABASE_SERVICE_KEY" "${SUPABASE_SERVICE_KEY:-}"
create_secret "JWT_SECRET_KEY" "${JWT_SECRET_KEY:-}"
create_secret "GEMINI_API_KEY" "${GEMINI_API_KEY:-}"
create_secret "DATABASE_URL" "${DATABASE_URL:-}"
create_secret "REDIS_URL" "${REDIS_URL:-redis://localhost:6379/0}"

# ─── 2. Grant the default Compute Engine SA access to secrets ───────────────
echo "==> Granting Secret Manager access to Cloud Run service account..."

PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
COMPUTE_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

for secret in SUPABASE_SERVICE_KEY JWT_SECRET_KEY GEMINI_API_KEY DATABASE_URL REDIS_URL; do
    gcloud secrets add-iam-policy-binding "$secret" \
        --member="serviceAccount:${COMPUTE_SA}" \
        --role="roles/secretmanager.secretAccessor" \
        --project="$PROJECT_ID" 2>/dev/null || true
done

# ─── 3. Build and push via Cloud Build ──────────────────────────────────────
echo "==> Building image with Cloud Build..."
gcloud builds submit \
    --tag "$IMAGE_NAME" \
    --project="$PROJECT_ID" \
    --timeout="15m"

# ─── 4. Deploy to Cloud Run ─────────────────────────────────────────────────
echo "==> Deploying to Cloud Run..."

gcloud run deploy "$SERVICE_NAME" \
    --image="$IMAGE_NAME" \
    --platform="managed" \
    --region="$REGION" \
    --memory="2Gi" \
    --cpu="2" \
    --concurrency="80" \
    --min-instances="0" \
    --max-instances="10" \
    --timeout="300" \
    --allow-unauthenticated \
    --set-env-vars="^~^SUPABASE_URL=${SUPABASE_URL:-},SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY:-},JWT_ALGORITHM=${JWT_ALGORITHM:-HS256},ACCESS_TOKEN_EXPIRE_MINUTES=${ACCESS_TOKEN_EXPIRE_MINUTES:-15}" \
    --set-secrets="SUPABASE_SERVICE_KEY=SUPABASE_SERVICE_KEY:latest,JWT_SECRET_KEY=JWT_SECRET_KEY:latest,GEMINI_API_KEY=GEMINI_API_KEY:latest,DATABASE_URL=DATABASE_URL:latest,REDIS_URL=REDIS_URL:latest" \
    --project="$PROJECT_ID"

# ─── 5. Print the service URL ───────────────────────────────────────────────
echo ""
echo "=== Deployment complete ==="
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
    --platform="managed" \
    --region="$REGION" \
    --format="value(status.url)" \
    --project="$PROJECT_ID")
echo "Service URL: ${SERVICE_URL}"
echo ""
echo "Quick test:"
echo "  curl ${SERVICE_URL}/"
echo "  curl ${SERVICE_URL}/health"
echo ""
