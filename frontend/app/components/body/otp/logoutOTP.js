import { error } from '../../../engine/error.js';
import { getLanguageDict } from '../../../engine/language.js';
import { registerOTP } from './registerOTP.js';

const logoutOTPRequest = async (otp) => {
    if (!otp)
        return false;
    const response = await fetch('/api/otp/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({otp: otp}),
    });
    return response.status === 200;
};

export const logoutOTP = (render, div, oauth_connected=false) => {
    const language = localStorage.getItem('language') || 'en';
    const data = getLanguageDict(language, 'otp');

    render(div, `
        <style>
            .button-red {
                color: var(--btn-font-color);
                background-color: #ff0000;
            }
    
            .button-red:hover {
                background-color: #a70000;
                transition: background-color 0.2s;
            }
        </style>
        <input id="otpField" class="form-control" placeholder="${data.enterOTP}" required>
        <button class="btn button-red w-100" id="logoutOTPButton">${data.removeOTP}</button>
        <div id="secret_code"></div>
    `);

    const logoutOTPButton = document.getElementById('logoutOTPButton');
    logoutOTPButton.addEventListener('click', async () => {
        const otp = document.getElementById('otpField').value;
        if (!otp) {
            error('Please enter your OTP', 'warning');
            return;
        }
        if (!await logoutOTPRequest(otp)) {
            error('Invalid OTP', 'danger');
            return await logoutOTP(render, div, oauth_connected);
        }
        error('OTP removed', 'success');
        return await registerOTP(render, div, oauth_connected);
    });
};