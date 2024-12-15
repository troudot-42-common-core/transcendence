import { error } from '../../../engine/error.js';
import { getLanguageDict } from '../../../engine/language.js';
import { loggedFetch } from '../../../engine/utils.js';

const registerOTPRequest = async (password) => {
    const response = await loggedFetch(fetch)('/api/otp/register/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(password ? {password: password} : ''),
    });
    if (response.status !== 201)
        return false;

    return response.json();
};

export const registerOTP = (render, div, oauth_connected=false) => {
    const language = localStorage.getItem('language') || 'en';
    const data = getLanguageDict(language, 'otp');

    if (!oauth_connected) {
        render(div, `
            <style>
                .button-green {
                    color: var(--btn-font-color);
                    background-color: #4CBB17;
                }
        
                .button-green:hover {
                    background-color: #228B22;
                    transition: background-color 0.2s;
                }
                
            </style>
            <div class="registerOTPClass">
                <input type="password" id="passwordField" class="form-control" placeholder="${data.password}" required>
                <button class="btn button-green w-100" id="registerOTPButton">${data.setOTP}</button>
            </div>
            <div id="qrcodeDiv" style="display: none"></div>
        `);
    } else {
        render(div, `
            <style>
                .button-green {
                    color: var(--btn-font-color);
                    background-color: #4CBB17;
                }
        
                .button-green:hover {
                    background-color: #228B22;
                    transition: background-color 0.2s;
                }
                .passField {
                    display: none;
                }
                
            </style>
            <div class="registerOTPClass">
                <input id="passwordField" class="passField" value="">
                <button class="btn button-green w-100" id="registerOTPButton">${data.setOTP}</button>
            </div>
            <div id="qrcodeDiv" style="display: none"></div>
        `);
    }

    const registerOTPButton = document.getElementById('registerOTPButton');
    registerOTPButton.addEventListener('click', async () => {
        const password = document.getElementById('passwordField').value;
        if (!oauth_connected && !password){
            error('Invalid password', 'warning');
            return ;
        }

        const otp = await registerOTPRequest(password);
        if (!otp){
            error('Invalid password', 'warning');
            return registerOTP(render, div, oauth_connected);
        }
        const registerOTPClass = document.querySelector('.registerOTPClass');
        registerOTPClass.style.display = 'none';
        const qrcodeDiv = document.getElementById('qrcodeDiv');
        qrcodeDiv.style.display = 'block';
        qrcodeDiv.innerHTML = `<p>${data.optQrCode}</p>`;
        const encodedUri = encodeURIComponent(otp.qr_code_uri);
        const qrcode = document.createElement('img');
        qrcode.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=000000&bgcolor=FFFFFF&data=${encodedUri}`;
        qrcodeDiv.appendChild(qrcode);
    });
};