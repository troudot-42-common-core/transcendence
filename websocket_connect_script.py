import httpx
import ssl
from websocket import create_connection

BASE_URL = "https://10.11.4.13:5001"

LOGIN_ROUTE = "/api/auth/login/"
GAMES_ROUTE = "/api/games/"
CERT_PATH = "frontend/certs/certificate.crt"

credentials = {
    "username": "12345678",
    "password": "12345678a-",
}

with httpx.Client(verify=CERT_PATH) as client:
    response = client.post(f"{BASE_URL}{LOGIN_ROUTE}", json=credentials)

    if response.status_code == 200:
        print("Login done.")
    else:
        print(f"Erreur while trying to login: {response.status_code}")
        exit(1)

    game_response = client.post(f"{BASE_URL}{GAMES_ROUTE}", json=credentials)
    if game_response.status_code == 201:
        try:
            WEBSOCKET_ROUTE = "/ws/games/%s/" % game_response.json()['game_id']
        except: # noqa : E722
            print('Failed to get game_id')
            exit()
    else:
        print("Failed to create a game")
        exit(1)

    cookies = client.cookies.jar

ssl_context = ssl.create_default_context()
ssl_context.load_verify_locations(CERT_PATH)

cookies_header = "; ".join([f"{cookie.name}={cookie.value}" for cookie in cookies])

try:
    ws = create_connection(
        f"{BASE_URL.replace('https', 'wss')}{WEBSOCKET_ROUTE}",
        header={"Cookie": cookies_header},
        sslopt={"cert_reqs": ssl.CERT_REQUIRED, "ca_certs": CERT_PATH},
    )

    while True:
        try:
            message = ws.recv()
            print(f"Receive message : {message}")
        except:  # noqa : E722
            break
except Exception as e:
    print(f"Erreur WebSocket : {e}")
finally:
    if 'ws' in locals() and ws.connected:
        ws.close()
        print("Websocket connection closed.")
