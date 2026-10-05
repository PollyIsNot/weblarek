import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Header extends Component<void> {
    protected basketButton: HTMLButtonElement;
    protected counter: HTMLElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents
    ) {
        super(container);

        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        this.counter = ensureElement<HTMLElement>('.header__basket-counter', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    setCounter(count: number): void {
        this.counter.textContent = String(count);
    }
}
