from .blockchain_scores import BlockchainScores
import logging
import threading

logger = logging.getLogger(__name__)

_blockchain_handler = None
_lock = threading.Lock()

def get_blockchain_handler() -> BlockchainScores:
    global _blockchain_handler
    
    if _blockchain_handler is None:
        with _lock:
            if _blockchain_handler is None:
                try:
                    _blockchain_handler = BlockchainScores()
                    logger.info("[BLOCKCHAIN] Queue processor initialized")
                except Exception as e:
                    logger.error(f"[BLOCKCHAIN] Failed to initialize blockchain handler: {e}")
                    raise
    
    return _blockchain_handler
