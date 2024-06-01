import { home } from "./views/home.mjs"
import { about } from "./views/about.mjs"
import { contact } from "./views/contact.mjs"

export const routes = [
        { path: "/", view: (app) => app.innerHTML = home()},
        { path: "/about", view: (app) => app.innerHTML = about() },
        { path: "/contact", view: (app) => app.innerHTML = contact() }
    ];