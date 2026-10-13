import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

def application(environ, start_response):
    try:
        from app.main import app
        from a2wsgi import ASGIMiddleware
        return ASGIMiddleware(app)(environ, start_response)
    except Exception as e:
        import traceback
        err = traceback.format_exc()
        start_response('200 OK', [('Content-Type', 'text/plain')])
        return [f"App Startup Traceback:\n\n{err}".encode('utf-8')]