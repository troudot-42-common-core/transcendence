import { routes } from "./routes.mjs"
import { themeHandler } from "./theme.mjs"
import { languageHandler } from "./language.mjs"

const app = document.getElementById("app");
const theme = document.querySelector("input[name=dark-mode]");
const language = document.getElementById("languageSwitcher");

const router = async () => {
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path,
        };
    });

    const isMatch = (potentialMatch) => {
        return potentialMatch.isMatch;
    };

    let match = potentialMatches.find(isMatch);

    // if unknown route
    if (!match) {
        match = {
            route: routes[0],
            isMatch: true,
        }
    }
    match.route.view(app)
};


document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            if (e.target.href === location.href)
                return;
            history.pushState({urlPath: e.target.href}, "", e.target.href);
            router();
        }
    });
    theme.addEventListener('change', function() { themeHandler(document.body, this) });
    language.addEventListener('change', function() {
        languageHandler(this);
        router();
    });
    router();
});

themeHandler(document.body, theme, true);
languageHandler(language, true);
