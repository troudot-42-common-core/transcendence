import { loggedFetch, reload } from '../../engine/utils.js';
import { error } from '../../engine/error.js';
import { getLanguageDict } from '../../engine/language.js';
import { websocketsHandler } from '../../engine/router.js';

export const fillTableWithGames = (table, games, data) => {
  for (let i = 0; i < games.length; i++) {
    const tr = document.createElement('tr');
    const tdPlayer1 = document.createElement('td');
    const tdPlayer2 = document.createElement('td');
    const tdButton = document.createElement('td');
    const players = Object.keys(games[i]['players']);
    tdPlayer1.innerHTML = games[i]['display_names'][players[0]] || null;
    tdPlayer2.innerHTML = games[i]['display_names'][players[1]] || null;
    if (players.length < 2)
      tdButton.innerHTML = `<a href="/games/${games[i]['name']}" class="btn button" connect-to-game>${data.joinGame}</a>`;
    else tdButton.innerHTML = data.inGame;
    tr.appendChild(tdPlayer1);
    tr.appendChild(tdPlayer2);
    tr.appendChild(tdButton);
    table.appendChild(tr);
  }
};

// New function to validate game fetch before navigation
const validateGameFetch = async () => {
  try {
    const response = await loggedFetch(fetch)('/api/games/', {
      method: 'HEAD',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      error('Please wait the end of the other game', 'warning');
      return false;
    }
    return true;
  } catch {
    error('Network error', 'warning');
    return false;
  }
};

export const gameHandler = (render, div) => {
  const language = localStorage.getItem('language') || 'en';
  const data = getLanguageDict(language, 'game');

  render(
    div,
    `
        <style>
            .container {
                margin-left: auto;
                margin-top: auto;
                width: 70%;
            }
        </style>
        <div class="container">
            <div class="table-responsive">
                <table class="table table-bordered mb-0 bg-table">
                    <thead>
                        <tr>
                            <th scope="col">${data.player1}</th>
                            <th scope="col">${data.player2}</th>
                            <th scope="col">${data.status}</th>
                        </tr>
                    </thead>
                    <tbody id="games_table"></tbody>
                </table>
            </div>
            <div class="row">
                <button type="button" class="btn button" id="createGameButton">${data.createGame}</button>
            </div>
        </div>
    `,
  );

  const createGameButton = document.getElementById('createGameButton');
  const websocket = websocketsHandler.getWs('games');
  if (!websocket) {
    return reload();
  }
  websocketsHandler.handleWebSocketOpen(websocket, (websocket) => {
    websocket.onmessage = (event) => {
      const jsonData = JSON.parse(event.data);
      const gameTable = document.getElementById('games_table');
      if (!gameTable) {
        return;
      }
      gameTable.innerHTML = '';
      fillTableWithGames(gameTable, jsonData.games, data);
    };
  });
  const gamesTable = document.getElementById('games_table');
  gamesTable.addEventListener('click', async (event) => {
    const gameLink = event.target.matches('[connect-to-game]')
      ? event.target
      : event.target.closest('[connect-to-game]');
    if (gameLink) {
      event.preventDefault();
      const isValid = await validateGameFetch();
      if (isValid) {
        websocket;
        window.history.pushState({}, '', gameLink.getAttribute('href'));
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  });
  createGameButton.addEventListener('click', async () => {
    const response = await loggedFetch(fetch)('/api/games/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (response.status !== 201 && response.status !== 200) {
      switch (response.status) {
        case 400:
          error('Invalid request', 'warning');
          break;
        case 409:
          error('Game already exists', 'warning');
          break;
        case 423:
          error('Too many games created', 'warning');
          break;
        default:
          error('Unknown error', 'warning');
          break;
      }
    }
  });
};
