import uuid


async def send_email(to: str, subject: str, body: str, business_id: str) -> dict:
    print(f"[EMAIL] To {to}: {subject}")
    return {"status": "sent", "message_id": str(uuid.uuid4())}
