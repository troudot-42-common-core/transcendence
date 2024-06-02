import { home } from "../../components/body/home.mjs"
import { history } from "../../components/body/history.mjs"
import { render } from "./render.mjs"

export const routes = [
        { path: "/", view: (app) => home(render, app)},
        { path: "/history", view: (app) => history(render, app) }
    ];