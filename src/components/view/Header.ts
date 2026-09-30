import { Component } from '../base/Component';

export class Header extends Component<void> {
    protected basketButton: HTMLButtonElement;
    protected counter: HTMLElement;

    constructor(
        container: HTMLElement,
        protected events: any
    ) {
        super(container);

        this.basketButton = this.container.querySelector('.header__basket') as HTMLButtonElement;
        this.counter = this.container.querySelector('.header__basket-counter') as HTMLElement;

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    setCounter(count: number): void {
        this.counter.textContent = String(count);
    }

    render(): HTMLElement {
        return this.container;
    }
}
