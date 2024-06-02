import { home } from "../../components/body/home.mjs"
import { about } from "../../components/body/about.mjs"
import { contact } from "../../components/body/contact.mjs"
import { render } from "./render.mjs"

export const routes = [
        { path: "/", view: (app) => home(render, app)},
        { path: "/about", view: (app) => about(render, app) },
        { path: "/contact", view: (app) => contact(render, app) }
    ];