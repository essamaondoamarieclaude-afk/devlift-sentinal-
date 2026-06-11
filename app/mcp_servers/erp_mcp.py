import uuid
from uuid import uuid4


async def create_purchase_order(supplier_id: str, items: list, business_id: str) -> dict:
    po_number = f"PO-{uuid4().hex[:8].upper()}"
    print(f"[ERP] PO {po_number} created for supplier {supplier_id} ({len(items)} items)")
    return {"po_number": po_number, "status": "created"}
