import inspect
from google import genai
client = genai.Client(api_key="123")
print(inspect.signature(client.interactions.create))
