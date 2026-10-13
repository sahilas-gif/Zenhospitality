import os
import sys
import traceback

sys.path.insert(0, os.path.dirname(__file__))

try:
    from dotenv import load_dotenv

    env_file = os.path.join(os.path.dirname(__file__), ".env.production")
    if os.path.isfile(env_file):
        load_dotenv(env_file)
except ImportError:
    pass

try:
    from a2wsgi import ASGIMiddleware
    from app.main import app

    application = ASGIMiddleware(app)
except Exception:
    # Details go to stderr.log only; visitors get a generic 503.
    traceback.print_exc(file=sys.stderr)

    def application(environ, start_response):
        body = b'{"detail":"Service temporarily unavailable"}'
        start_response(
            "503 Service Unavailable",
            [("Content-Type", "application/json"), ("Content-Length", str(len(body))), ("Retry-After", "60")],
        )
        return [body]
