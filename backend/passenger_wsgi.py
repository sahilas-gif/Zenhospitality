import os
import sys
import traceback

sys.path.insert(0, os.path.dirname(__file__))

_application = None
_import_error = None


def _log(msg):
    print(msg, file=sys.stderr, flush=True)


def _load():
    global _application, _import_error
    if _application is not None or _import_error is not None:
        return
    try:
        _log("zen: importing app")
        from a2wsgi import ASGIMiddleware
        from app.main import app

        _log("zen: app imported")
        _application = ASGIMiddleware(app)
        _log("zen: ready")
    except Exception:
        _import_error = traceback.format_exc()
        _log(_import_error)


def application(environ, start_response):
    path = (environ.get("PATH_INFO") or "").rstrip("/") or "/"
    if path in ("/health", "/api/health", "/v1/health", "/api/v1/health"):
        body = b'{"status":"ok"}'
        start_response(
            "200 OK",
            [("Content-Type", "application/json"), ("Content-Length", str(len(body)))],
        )
        return [body]

    _load()
    if _import_error is not None:
        body = b'{"detail":"Service temporarily unavailable"}'
        start_response(
            "503 Service Unavailable",
            [("Content-Type", "application/json"), ("Content-Length", str(len(body))), ("Retry-After", "30")],
        )
        return [body]
    return _application(environ, start_response)
