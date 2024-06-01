export const themeHandler = (body, checked) => {
    if (checked) {
        body.setAttribute('theme', 'dark');
    } else {
        body.setAttribute('theme', 'light');
    }
};