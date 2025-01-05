import { loggedFetch, reload } from '../../engine/utils.js';
import { error } from '../../engine/error.js';
import { error as errorHandler } from './error.js';
import { getHistory } from './history.js';
import { getLanguageDict } from '../../engine/language.js';

export const getUserInfo = async (args) => {
  if (args.length !== 1) throw new Error('Invalid number of arguments');
  const response = await loggedFetch(fetch)(`/api/users/${args[0]}/`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.status !== 200) return null;
  return await response.json();
};

const getStats = async (username) => {
  const response = await loggedFetch(fetch)(`/api/stats/${username}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.status !== 200) return null;
  return await response.json();
};

export const user = async (render, div, args) => {
  const language = localStorage.getItem('language') || 'en';
  const data = getLanguageDict(language, 'profile');
  const userInfo = await getUserInfo(args);
  if (userInfo === null) return errorHandler(render, div, 'User not found');
  const avatar_url = userInfo.avatar;
  const stats = (await getStats(userInfo.username)) || {};

  render(
    div,
    `
        <style>
            .table-responsive {
                text-align: center;
                margin-top: 20px;
                margin-left: 10vw;
                width: 80vw;
                margin-bottom: 10vh;
            }
            td, th {
              text-align: center;
            }
            .profileContainer {
                margin-top: 20px;
                width: 300px;
            }
            .avatar {
                margin-left: 100px;
            }
            .col {
                margin-top: 10px;
                margin-bottom: 10px;
            }
            .statsContainer {
                width: 80vw;
                margin-left: 10vw;
                margin-top: 20px;
                margin-bottom: 10vh;
                // text-align: center;

            }
            .stats-item {
                display: inline-block;
                margin: 15px;
                width: 13vw;
                height: 9vw;
                background-color: var(--bg-tournament);
                padding: 10px;
                text-align: center;
                font-size: 1.5vw;
                border-radius: 10px;
            }
            .chartsContainer {
                margin-top: 20px;
                margin-left: 20vw;
                width: 80vw;
                }
            .card {
                background-color: var(--bg-tournament);
                border-radius: 10px;
                height: 300px;
                width: 100%;
                margin-bottom: 5vh;
            }
        </style>
        <div class="container profileContainer">
            <img src="${avatar_url}" alt="Avatar" class="avatar rounded-circle" style="width: 100px; height: 100px;">
            <h2 id=displayName>${userInfo.display_name}</h2>
            <h4 id="username">@${userInfo.username}</h4>
            <div class="row">
                <div class="col">
                    <h4 id="status"></h4>
                    <input type="button" id="requestFriendButton" class="btn button w-100"></input>
                </div>
            </div>
        </div>
        <div class="chartsContainer">
            <div class="row my-2">
                <div class="col-md-6 py-1">
                    <div class="card">
                        <div class="card-body">
                            <canvas id="chLine"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 py-1">
                    <div class="card">
                        <div class="card-body">
                            <canvas id="chDonut"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        <dixv class="statsContainer">
            <div class="stats-item">
                <p>${data.totalGames}</p>
                <p>${stats.total_games || 0}</p>
            </div>
            <div class="stats-item">
                <p>${data.gamesWon}</p>
                <p>${stats.games_won || 0}</p>
            </div>
            <div class="stats-item">
                <p>${data.gamesLost}</p>
                <p>${stats.games_lost || 0}</p>
            </div>
            <div class="stats-item">
                <p>${data.winRate}</p>
                <p>${Math.round(stats.win_rate) || 0}%</p>
            </div>
            <div class="stats-item">
                <p>${data.totalPoints}</p>
                <p>${stats.total_points || 0}</p>
            </div>
        </div>
        <div class="table-responsive">
            <h2 id="titleLastGames">${data.lastGames}</h2>
            <table class="table table-bordered mb-0 bg-table">
                 <thead>
                      <tr>
                          <th scope="col">${data.firstPlayer}</th>
                          <th scope="col">${data.score}</th>
                          <th scope="col">${data.secondPlayer}</th>
                          <th scope="col">${data.score}</th>
                          <th scope="col">${data.blockchainHash}</th>
                      </tr>
                 </thead>
                 <tbody id="table"></tbody>
            </table>
        </div>
    `,
  );

  const status = document.getElementById('status');
  switch (userInfo.status) {
    case 'online':
      status.innerText = `🟢 ${data.online}`;
      break;
    case 'in_party':
      status.innerText = `🟡 ${data.in_party}`;
      break;
    case 'offline':
      status.innerText = `🔴 ${data.offline}`;
      break;
    default:
      status.style.display = 'none';
      break;
  }
  const table = document.getElementById('table');
  const scoresData = await getHistory(table, userInfo.username);

  const requestFriendButton = document.getElementById('requestFriendButton');
  switch (userInfo.friendship_status) {
    case null:
      requestFriendButton.value = data.requestFriend;
      requestFriendButton.classList.add('invite');
      break;
    case 'pending':
      requestFriendButton.value = data.cancelInvitation;
      requestFriendButton.classList.add('decline');
      break;
    case 'accepted':
      requestFriendButton.value = data.removeFriend;
      requestFriendButton.classList.add('decline');
      break;
    default:
      requestFriendButton.style.display = 'none';
  }
  requestFriendButton.addEventListener('click', async () => {
    if (requestFriendButton.classList.contains('invite')) {
      const response = await loggedFetch(fetch)('/api/friendships/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userInfo.username }),
      });
      if (response.status !== 200) {
        switch (response.status) {
          case 400:
            error('Invalid request', 'warning');
            break;
          case 409:
            error('You\'re already friends', 'warning');
            break;
          default:
            error('Unknown error', 'danger');
            break;
        }
      }
    } else if (requestFriendButton.classList.contains('decline')) {
      const response = await loggedFetch(fetch)('/api/friendships/', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userInfo.username,
          action: 'decline',
        }),
      });
      if (response.status !== 200) {
        switch (response.status) {
          case 400:
            error('Invalid request', 'warning');
            break;
          default:
            error('Unknown error', 'danger');
            break;
        }
      }
    }
    return await reload(true);
  });

  const chLine = document.getElementById('chLine');
  const chartData = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
      {
        data: scoresData ? scoresData.reverse() : [],
        label: data.lastGames + ' (' + data.score + ')',
        backgroundColor: 'transparent',
        borderColor: '#f96d00',
        borderWidth: 4,
        pointBackgroundColor: '#f96d00',
      },
    ],
  };
  if (chLine) {
    new Chart(chLine, { // eslint-disable-line
       
      type: 'line',
      data: chartData,
      options: {
        scales: {
          xAxes: [
            {
              reverse: true,
              gridLines: {
                color: 'rgba(0,0,0,0.05)',
              },
            },
          ],
          yAxes: [
            {
              borderDash: [5, 5],
              gridLines: {
                color: 'rgba(0,0,0,0)',
                fontColor: '#fff',
              },
            },
          ],
        },
      },
    });
  }

  const chDonutData = {
    labels: [data.gamesWon, data.gamesLost],
    datasets: [
      {
        backgroundColor: ['green', 'red'],
        borderWidth: 0,
        data: [stats.games_won || 0, stats.games_lost || 0],
      },
    ],
  };
  const chDonut = document.getElementById('chDonut');
  if (chDonut) {
    new Chart(chDonut, { // eslint-disable-line
       
      type: 'pie',
      data: chDonutData,
    });
  }
};
