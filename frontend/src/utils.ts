export const $ = (selector) => {
    var elements;
    if (typeof selector === 'string') {
        elements = document.querySelectorAll(selector);
    } else if (selector instanceof HTMLElement) {
        elements = [selector];
    } else if (selector instanceof NodeList || selector instanceof Array) {
        elements = selector;
    }
    return elements;
}