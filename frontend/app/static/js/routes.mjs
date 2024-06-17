import { home } from "../../components/body/home.mjs"
import { history } from "../../components/body/history.mjs"
import { tournament } from "../../components/body/tournament.mjs";
import { render } from "./render.mjs"

export const routes = [
    { path: "/", view: (app) => home(render, app), name: "home"},
    { path: "/history", view: (app) => history(render, app), name: "history" },
    { path: "/tournament", view: (app) => tournament(render, app), name: "tournament" }
    ];