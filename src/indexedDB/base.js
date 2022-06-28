const id = (elem) => {
    elem = document.getElementById(elem);
    return elem;
};

const toggle = (element) => {
    return element.hidden = !element.hidden;
}

const msg = (element, message, status) => {
    (status === "success") ? element.style.color = "green" : element.style.color = "red";
    if (message === "remove") {
        element.innerHTML = "";
        element.hidden;
    }
    else {
        element.innerHTML = "Message: " + message;
        if (element.hidden) {
            toggle(element);
        }
        window.scrollTo(0,0);
    }
};

export {
    id,
    toggle,
    msg,
};
