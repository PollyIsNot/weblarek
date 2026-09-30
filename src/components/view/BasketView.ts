import { Component } from '../base/Component';
import { IProduct } from '../../types';

export class BasketView extends Component<{ items: HTMLElement[]; total: number }> {
    protected list: HTMLElement;
    protected total: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: any
    ) {
        super(container);

        this.list = this.container.querySelector('.basket__list') as HTMLElement;
        this.total = this.container.querySelector('.basket__price') as HTMLElement;
        this.button = this.container.querySelector('.basket__button') as HTMLButtonElement;

        this.button.addEventListener('click', () => {
            this.events.emit('order:open');
        });
    }

    render(data: { items: HTMLElement[]; total: number }): HTMLElement {
        this.list.innerHTML = '';
        data.items.forEach(item => {
            this.list.appendChild(item);
        });
        this.total.textContent = `${data.total} синапсов`;
        this.button.disabled = data.items.length === 0;

        return this.container;
    }
}
