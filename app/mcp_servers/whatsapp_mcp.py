async def send_whatsapp(phone: str, message: str, business_id: str) -> dict:
    print(f"[WHATSAPP] To {phone}: {message}")
    return {"status": "sent", "message_id": "stub_123"}
