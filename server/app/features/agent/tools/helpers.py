import json


def log_tool_event(filename: str, payload: dict):
    with open(filename, "a") as f:
        f.write(json.dumps(payload) + "\n")


def success_response(data):
    return {
        "success": True,
        "data": data,
        "error": None,
    }


def error_response(error: Exception):
    return {
        "success": False,
        "data": None,
        "error": str(error),
    }
