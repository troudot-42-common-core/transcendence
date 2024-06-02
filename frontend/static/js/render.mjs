export const render = (div, html) => {
    div.innerHTML = html;
};

export const renderHeader = async () => {
    const language = localStorage.getItem('language') || 'en';
    const url = `languages/${language}/navbar.json`;
    const response = await fetch(url);
    const data = await response.json();

    document.getElementById("home").innerHTML = data.home;
    document.getElementById("about").innerHTML = data.about;
    document.getElementById("contact").innerHTML = data.contact;
};

export const renderBody = async (div, match) => {
    if (!match) {
        const unknown = `
            <div class="container d-flex  
             align-items-center  
             justify-content-center  
             min-vh-100"> 
             <h1>404</h1>
          </div>
        `;
        render(div, unknown);
        return ;
    }
    await match.route.view(div)
};

