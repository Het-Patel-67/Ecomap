// src/services/authService.js

// Key used to store the authentication status in the browser's local storage
const IS_LOGGED_IN_KEY = 'ecomap_user_logged_in';

export const getAuthStatus = () => {
    return localStorage.getItem(IS_LOGGED_IN_KEY) === 'true';
};

export const loginMock = (email, password) => {
    // Mock login: always succeeds if fields are filled (replace with real API call later)
    if (email && password) {
        localStorage.setItem(IS_LOGGED_IN_KEY, 'true');
        return true;
    }
    return false;
};

export const registerMock = (email, username, password) => {
    // Mock registration: always succeeds if fields are filled
    if (email && username && password) {
        localStorage.setItem(IS_LOGGED_IN_KEY, 'true');
        return true;
    }
    return false;
};

export const logoutMock = () => {
    localStorage.removeItem(IS_LOGGED_IN_KEY);
};