import { home } from "./views/home.mjs"
import { about } from "./views/about.mjs"
import { contact } from "./views/contact.mjs"

const render = (app, html) => {
    app.innerHTML = html;
};

export const routes = [
        { path: "/", view: (app) => home(render, app)},
        { path: "/about", view: (app) => about(render, app) },
        { path: "/contact", view: (app) => contact(render, app) }
    ];