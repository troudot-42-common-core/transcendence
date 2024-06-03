const fillTableWithHistory = (table, history) => {
    for (let i = 0; i < history.length; i++) {
	    let tr = document.createElement('tr');
	    for (let j = 0; j < 4; j++) {
	    	let td = document.createElement('td');
            td.textContent = Object.values(history[i])[j];
	    	tr.appendChild(td);
	    }
	    table.appendChild(tr);
    }
}

export const history =  async (render, div) => {
    const language = localStorage.getItem('language') || 'en';
    const url = `languages/${language}/history.json`;
    const response = await fetch(url);
    const data = await response.json();

    render (div, `
        <div class="container d-flex
         align-items-center  
         justify-content-center  
         min-vh-100"> 
         <div class="table-responsive">
              <table class="table table-bordered mb-0 bg-table">
                   <thead>
                        <tr>
                            <th scope="col">PLAYER</th>
                            <th scope="col">SCORE</th>
                            <th scope="col">PLAYER2</th>
                            <th scope="col">SCORE</th>
                        </tr>
                   </thead>
                   <tbody id="table"></tbody>
              </table>
            </div>
      </div>
    `);

    let table = document.getElementById("table");
    let history = localStorage.getItem('history');
    if (history) {
        history = JSON.parse(history);
        fillTableWithHistory(table, history);
    }
};