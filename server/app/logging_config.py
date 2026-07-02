import logging
import os
from logging.handlers import RotatingFileHandler

os.makedirs("logs", exist_ok=True)

logger = logging.getLogger("request_logger")
logger.setLevel(logging.INFO)

if not logger.handlers:
    handler = RotatingFileHandler(
        "logs/app.log",
        maxBytes=10 * 1024 * 1024,
        backupCount=5,
    )

    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
