const router = async () => {
    const routes = [
        { path: "/", view: () => console.log("viewing dashboard") },
        { path: "/about", view: () => console.log("viewing about") },
        { path: "/contact", view: () => console.log("viewing contact") }
    ];

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

    if (!match) {
        match = {
            route: routes[0],
            isMatch: true,
        }
    }

    console.log(match.route.view())

};

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", e => {
       if (e.target.matches("[data-link]")) {
           e.preventDefault();
           history.pushState({urlPath:e.target.href}, "", e.target.href);
           router();
       }
    });
    router();
});