import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env.production'))

from a2wsgi import ASGIMiddleware
from app.main import app

# Adapt FastAPI (ASGI) to Passenger (WSGI)
application = ASGIMiddleware(app)