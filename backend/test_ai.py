import asyncio
from app.services.ai_service import handle_chat_message

async def main():
    try:
        messages = [{"role": "user", "content": "hello"}]
        res = await handle_chat_message(messages)
        print("Response:", res)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    asyncio.run(main())
