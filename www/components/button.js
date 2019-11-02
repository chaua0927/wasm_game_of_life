export class Button {
    constructor(el, handleOnClick) {
        this.el = el;
        this.handleOnClick = handleOnClick.bind(this);

        this.el.addEventListener('click', event => {
            this.handleOnClick();
        });
    }
}