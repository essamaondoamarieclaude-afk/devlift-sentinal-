async def send_sms(phone: str, message: str, business_id: str) -> dict:
    print(f"[SMS] To {phone}: {message}")
    return {"status": "sent", "message_id": "stub_sms_456"}
