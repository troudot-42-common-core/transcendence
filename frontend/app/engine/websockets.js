import { address, wsRoutes } from './routes.js';
import { getAllFolders, isAMatch, replaceWildcard } from './utils.js';
import { loggedIn } from './tokens.js';

export class WebSocketHandler {
    constructor() {
        this.ws = new Map();
    }

    closeWs(wsName) {
        if (!this.ws.has(wsName)) return;
        const websocket = this.ws.get(wsName);
        websocket.close();
        this.ws.delete(wsName);
    }

    async openWs(wsRoute, wsPath, reset = false) {
        if (this.ws.has(wsRoute.name))
            if (reset) this.closeWs(wsRoute.name);
            else return;
        await loggedIn();
        const websocket = new WebSocket(wsPath);
        this.ws.set(wsRoute.name, websocket);
    }

    getWs(wsName) {
        if (!this.ws.has(wsName))
            return;
        if (this.ws.get(wsName).readyState === WebSocket.CLOSED) {
            this.ws.delete(wsName);
            return;
        }
        return this.ws.get(wsName);
    }

    wsCloser(name, wsRoute) {
        const targetRoute = wsRoutes.find(route => route.name === name);
        if (!targetRoute || targetRoute.pageOnly !== true)
            return;
        if (!wsRoute || wsRoute.name !== name)
            this.closeWs(name);
    }

    async check(match) {
        const matchingRoutes = wsRoutes.filter(wsRoute => isAMatch(match.route.path, wsRoute.path));

        this.ws.forEach((websocket, name) => {
            const wsRoute = matchingRoutes.find(route => route.name === name);
            this.wsCloser(name, wsRoute);
        });
        if (matchingRoutes.length === 0)
            return;
        for (const wsRoute of matchingRoutes) {
            let wsPath;
            const wsPathFolders = getAllFolders(wsRoute.wsPath);

            if (wsPathFolders.length === wsPathFolders.filter(folder => folder !== '*').length)
                wsPath = wsRoute.wsPath;
            else
                wsPath = address + '/' + replaceWildcard(wsRoute.path, match.args);
            try { await this.openWs(wsRoute, wsPath); }
            catch { return ; }
        }
    }

    handleWebSocketOpen(websocket, onOpenCallback) {
        if (websocket.readyState === WebSocket.OPEN) {
            onOpenCallback(websocket);
        } else if (websocket.readyState === WebSocket.CONNECTING) {
            websocket.onopen = () => onOpenCallback(websocket);
        }
    }
}
