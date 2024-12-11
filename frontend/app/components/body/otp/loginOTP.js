import { error} from '../../../engine/error.js';
import { getLanguageDict } from '../../../engine/language.js';

const loginOTPRequest = async (otp, username, password) => {
    if (!otp)
        return false;
    const response = await fetch('/api/auth/login/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({otp, username, password}),
    });
    return response.status === 200;
};

const loginOTPOauthRequest = async (otp, username, password) => {
    if (!otp)
        return false;
    const response = await fetch('/api/oauth/callback/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({otp, username, password, 'second_request': true}),
    });
    return response.status === 200;
};

export const loginOTP = (render, div, username, password, oauth = false) => {
    const language = localStorage.getItem('language') || 'en';
    const data = getLanguageDict(language, 'otp');

    render(div, `
        <style>
            .loginOTPForm {
                margin-top: 5vh;
            }
        </style>
        <div class="row loginOTPForm">
            <div class="mb-3">
                <label for="otp" class="form-label">${data.enterOTP}</label>
                <input type="text" class="form-control" id="otpValue">
            </div>
            <div class="col text-center">
                <button type="button" class="btn button w-100" id="toOAuthLoginButton">${data.login}</button>
            </div>
        </div>
    `);

    const toOAuthLoginButton = document.getElementById('toOAuthLoginButton');
    toOAuthLoginButton.addEventListener('click', async () => {
        const otp = document.getElementById('otpValue').value;
        if (!oauth && !await loginOTPRequest(otp, username, password, render, div)) {
            return await loginOTP(render, div, username, password);
        }
        if (oauth && !await loginOTPOauthRequest(otp, username, password, render, div)) {
            error('Invalid OTP', 'warning');
            return await loginOTP(render, div, username, password, true);
        }
        window.location.href = '/';
    });
};