import asyncio
import threading
import logging
import time
from typing import Dict, Any, Optional, Type, TypeVar
from web3 import Web3
from web3.types import TxReceipt
from django.db import transaction
from asgiref.sync import sync_to_async

from app import settings
from game.models import Game

logger = logging.getLogger(__name__)

T = TypeVar('T', bound='BlockchainScores')

class BlockchainScores:
    _instance: Optional['BlockchainScores'] = None
    _lock: threading.Lock = threading.Lock()
    MAX_RETRIES: int = 5
    RETRY_DELAY: int = 5  # seconds

    def __new__(cls: Type[T]) -> T:
        if not cls._instance:
            with cls._lock:
                if not cls._instance:
                    cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self: 'BlockchainScores') -> None:
        """
        Initialize the blockchain, contract and ABI
        """
        # Prevent re-initialization
        if hasattr(self,'_initialized'):
            return
        self._initialized = True

        print('[BLOCKCHAIN] Initializing BlockchainScores')
        self.w3: Web3 = Web3(Web3.HTTPProvider(
            f'https://sepolia.infura.io/v3/{settings.BLOCKCHAIN_INFURA_API_KEY}'
        ))
        self.contract_address: str = settings.BLOCKCHAIN_CONTRACT_ADDRESS
        self.contract_abi: list[Dict[str, Any]] = [
            {
                'inputs': [
                    {'type': 'string', 'name': '_player1'},
                    {'type': 'string', 'name': '_player2'},
                    {'type': 'uint256', 'name': '_score1'},
                    {'type': 'uint256', 'name': '_score2'}
                ],
                'name': 'addMatch',
                'outputs': [],
                'stateMutability': 'nonpayable',
                'type': 'function'
            }
        ]
        self.contract = self.w3.eth.contract(address=self.contract_address, abi=self.contract_abi)
        self.queue: asyncio.Queue[str] = asyncio.Queue()

        # Start queue processing in a separate thread
        self._stop_event: threading.Event = threading.Event()
        self._queue_thread: threading.Thread = threading.Thread(target=self._run_queue_processor, daemon=True)
        self._queue_thread.start()
        print('[BLOCKCHAIN] Queue processor thread started')

    def _run_queue_processor(self: 'BlockchainScores') -> None:
        """
        Run the queue processor in a separate thread
        """
        try:
            print('[BLOCKCHAIN] Starting queue processor')
            loop: asyncio.AbstractEventLoop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            loop.run_until_complete(self._process_queue_wrapper())
        except Exception as e:
            print(f'[BLOCKCHAIN] Queue processor error: {e}')
        finally:
            loop.close()

    def add_all_saving_games_to_queue(self: 'BlockchainScores') -> None:
        """
        Add all games with status 'saving' to the queue
        """
        games = Game.objects.filter(status='saving')
        for game in games:
            self.queue.put_nowait(game.name)

    async def _process_queue_wrapper(self: 'BlockchainScores') -> None:
        """
        Wrapper to handle queue processing with proper async/sync boundaries
        """
        while not self._stop_event.is_set():
            try:
                match: str = await asyncio.wait_for(self.queue.get(), timeout=1.0)
                await self._process_match(match)
                self.queue.task_done()
            except asyncio.TimeoutError:
                continue
            except Exception as e:
                print(f'[BLOCKCHAIN] Match processing error: {e}')

    @sync_to_async
    def _get_game_details(self: 'BlockchainScores', game_name: str) -> tuple[str, str, int, int]:
        """
        Retrieve game details using sync_to_async to handle Django ORM
        """
        game: Game = Game.objects.get(name=game_name)
        player1: str = game.scores.first().player.username
        player2: str = game.scores.last().player.username
        score1: int = game.scores.first().score
        score2: int = game.scores.last().score
        return player1, player2, score1, score2

    async def _process_match(self: 'BlockchainScores', game_name: str) -> None:
        """
        Process a single match with proper async handling
        """
        print(f'[BLOCKCHAIN] Processing match: {game_name}')
        
        player1, player2, score1, score2 = await self._get_game_details(game_name)
        
        receipt: TxReceipt = self.save_match_result(player1, player2, score1, score2)
        
        await self._update_game_status(game_name, receipt)

    @sync_to_async
    def _update_game_status(self: 'BlockchainScores', game_name: str, receipt: TxReceipt) -> None:
        """
        Update game status in the database
        """
        with transaction.atomic():
            game: Game = Game.objects.get(name=game_name)
            try:
                if receipt and receipt.transactionHash:
                    tx_hash: str = receipt.transactionHash.hex()
                    game.blockchain_hash = '0x' + tx_hash
            except:
                pass
            game.status = 'finished'
            game.save()

    async def add_match_to_queue(self: 'BlockchainScores', game_name: str) -> None:
        await self.queue.put(game_name)
        print(f'[BLOCKCHAIN] Adding match to queue: {game_name}')

    def save_match_result(
        self: 'BlockchainScores', 
        player1: str, 
        player2: str, 
        score1: int, 
        score2: int
    ) -> TxReceipt:
        """
        Save the scores into the blockchain with retry logic and increasing gasPrice
        """
        print(f'[BLOCKCHAIN] Saving match result: {player1} vs {player2}')
        base_gas_price = int(self.w3.eth.gas_price * 0.8)
        
        for attempt in range(self.MAX_RETRIES):
            try:
                # Increase gasPrice by at least 15% on each retry
                current_gas_price = base_gas_price * (3 + (0.15 * attempt))
                
                transaction_dict: Dict[str, Any] = self.contract.functions.addMatch(
                    player1,
                    player2,
                    score1,
                    score2
                ).build_transaction({
                    'from': settings.BLOCKCHAIN_PUBLIC_KEY,
                    'nonce': self.w3.eth.get_transaction_count(settings.BLOCKCHAIN_PUBLIC_KEY),
                    'gas': 200000,
                    'gasPrice': int(current_gas_price)
                })

                signed_txn = self.w3.eth.account.sign_transaction(
                    transaction_dict, 
                    private_key=settings.BLOCKCHAIN_PRIVATE_KEY
                )
                tx_hash = self.w3.eth.send_raw_transaction(signed_txn.raw_transaction)

                receipt: TxReceipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
                print(f'[BLOCKCHAIN] Match saved successfully: {tx_hash.hex()}')
                return receipt
            except Exception as e:
                logger.warning(
                    f'[BLOCKCHAIN] Error saving match (attempt {attempt + 1}/{self.MAX_RETRIES}): {e}'
                )
                if attempt < self.MAX_RETRIES - 1:
                    time.sleep(self.RETRY_DELAY)
                else:
                    logger.error(
                        f'[BLOCKCHAIN] Failed to save match after {self.MAX_RETRIES} attempts'
                    )
                    return None

    def __del__(self: 'BlockchainScores') -> None:
        """
        Ensure the queue processor thread is stopped when the object is deleted
        """
        print('[BLOCKCHAIN] Stopping queue processor')
        self._stop_event.set()
        if hasattr(self, '_queue_thread') and self._queue_thread.is_alive():
            self._queue_thread.join()
