class GameNotFoundException(Exception):
    pass

class GameFullException(Exception):
    pass

class TournamentNotInProgressException(Exception):
    pass

class PlayerNotInGameException(Exception):
    pass
