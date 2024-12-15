export const notLoggedNavbar = (render, div) => {
    const theme = localStorage.getItem('theme') || 'light';

    const icon = theme === 'light' ? 'light_mode' : 'dark_mode';

    render(div, `
        <style>
            .navbar {
                background-color: var(--bg-color);
            }
            .checkbox input{
                display: none;
            }    
            .material-symbols-outlined {
                color: var(--font-color);
                font-variation-settings:
                'FILL' 0,
                'wght' 500,
                'GRAD' 0,
                'opsz' 40
            }   
            .button-primary {
                color: var(--font-color);
                background-color: var(--btn-bg-hover-color);
            }
            .button-primary:hover {
                background-color: var(--btn-bg-color);
                transition: background-color 0.2s;
            }
            .checkbox , .languageSwitcher {
                margin-left: 5px;
            }
            select[id="languageSwitcher"] {
                background-color: var(--bg-color);
                border: none;
                color: var(--bg-color);
                font-size: 1.5rem;
            }
            .logoAsText {
                font-size: 1.5rem;
            }
        </style>
        <nav class="navbar navbar-expand-lg px-0 py-3">
            <div class="container-xl">
                <a class="nav-link nav-item active logoAsText" href="/" data-link>
                    ft_transcendence
                </a
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="navbar" id="navbarCollapse">
                    <div class="checkbox">
                        <input type="checkbox" name="themeSwitcher" id="themeSwitcher"/>
                        <label for="themeSwitcher">
                            <span class="material-symbols-outlined" id="themeIcon">${icon}</span>
                        </label>
                    </div>
                    <div class="languageSwitcher">
                        <select data-width="fit" id="languageSwitcher">
                            <option id="en">🇬🇧</option>
                            <option id="fr">🇫🇷</option>
                            <option id="es">🇪🇸</option>
                        </select>
                    </div>
                </div>
            </div>
        </nav>
    `);
};