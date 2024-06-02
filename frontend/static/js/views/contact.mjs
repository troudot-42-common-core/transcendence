export const contact =  async (render, app) => {
    const language = localStorage.getItem('language') || 'en';
    const url = `languages/${language}/contact.json`;
    const response = await fetch(url);
    const data = await response.json();

    render (app, `
        <div class="container d-flex  
         align-items-center  
         justify-content-center  
         min-vh-100"> 
         <h1>${data.title}</h1>
      </div>
    `);
};