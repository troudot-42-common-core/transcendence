import { getCookie } from '../../../engine/utils.js';
import { getLanguageDict } from '../../../engine/language.js';
import { loginOTP} from '../otp/loginOTP.js';

export const redirectToIntraApi = () => {
    if (getCookie('api_42'))
        window.location.href = getCookie('api_42');
};

const oauthRequest = async (code) => await fetch('/api/oauth/callback/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({'code': code}),
    });

export const oauth = async (render, div, args) => {
    const language = localStorage.getItem('language') || 'en';
    const data = getLanguageDict(language, 'auth');
    render(div, `
        <style>
            .container-fluid {
                width: 70vw;
                height: 40vh;
                margin-top: 30vh;
            }
            .otpContainer {
                width: 30vw;
                height: 40vh;
                margin-top: 10vh;
                flex-direction: column;
                margin-left: 35vw;
                align-items: center;
                justify-content: center;
                display: none;
            }
            .row ,  .col-md-6{
                padding-top: 1vh;
            }
            h1 {
                text-align: center;
            }
            .loader {
              margin: auto;
              margin-bottom: 30px;
              width: 60px;
              aspect-ratio: .90;
              --_g: no-repeat radial-gradient(circle closest-side,var(--font-color) 90%,#0000);
              background: 
                var(--_g) 0%   50%,
                var(--_g) 50%  50%,
                var(--_g) 100% 50%;
              background-size: calc(100%/3) 50%;
              animation: l3 1s infinite linear;
            }
            @keyframes l3 {
                20%{background-position:0%   0%, 50%  50%,100%  50%}
                40%{background-position:0% 100%, 50%   0%,100%  50%}
                60%{background-position:0%  50%, 50% 100%,100%   0%}
                80%{background-position:0%  50%, 50%  50%,100% 100%}
            }
            
        </style>
        <div class="container-fluid oauthContainer">
            <div class="loader"></div>
            <h1>${data.youWillBeRedirected}</h1>
        </div>
        <div class="otpContainer"></div>
        
    `);

    const code = args[0];
    const response = await oauthRequest(code);
    if (response.status === 423){
        const oauthContainer = document.getElementsByClassName('oauthContainer')[0];
        const otpContainer = document.getElementsByClassName('otpContainer')[0];
        const resData = await response.json();
        oauthContainer.style.display = 'none';
        otpContainer.style.display = 'flex';
        if (!resData.username && !resData.password)
            window.location.href = '/';
        return await loginOTP(render, otpContainer, resData.username, resData.password, true);
    }
    window.location.href = '/';
};