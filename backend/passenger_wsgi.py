import os
import sys
import traceback

sys.path.insert(0, os.path.dirname(__file__))

# Load .env.production if python-dotenv is available; skip gracefully if not.
# On cPanel, environment variables are set via Setup Python App and are already
# in the process environment, so dotenv is optional.
try:
    from dotenv import load_dotenv
    env_file = os.path.join(os.path.dirname(__file__), '.env.production')
    if os.path.isfile(env_file):
        load_dotenv(env_file)
except ImportError:
    pass  # python-dotenv not installed; rely on cPanel env vars

try:
    from a2wsgi import ASGIMiddleware
    from app.main import app

    # Adapt FastAPI (ASGI) to Passenger (WSGI)
    application = ASGIMiddleware(app)
except Exception as e:
    # If the app fails to import, serve a diagnostic error page so
    # the 500 isn't completely opaque.  Write to stderr so it shows
    # in the cPanel error log.
    traceback.print_exc()

    def application(environ, start_response):
        status = '500 Internal Server Error'
        output = f'App startup error: {e}\n\nCheck cPanel Error Log for full traceback.'
        start_response(status, [('Content-Type', 'text/plain')])
        return [output.encode('utf-8')]