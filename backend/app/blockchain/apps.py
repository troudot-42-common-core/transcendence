from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)

class BlockchainAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'blockchain'
    _initialized = False

    def ready(self: 'BlockchainAppConfig') -> None:
        # Prevent multiple initializations
        if not BlockchainAppConfig._initialized:
            from .utils import get_blockchain_handler
            get_blockchain_handler()
            print("[BLOCKCHAIN] Blockchain handler initialized in apps.py")
            BlockchainAppConfig._initialized = True
