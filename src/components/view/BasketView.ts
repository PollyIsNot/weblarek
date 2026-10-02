import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class BasketView extends Component<{ items: HTMLElement[]; total: number }> {
    protected list: HTMLElement;
    protected total: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents
    ) {
        super(container);
        this.list = this.container.querySelector('.basket__list') as HTMLElement;
        this.total = this.container.querySelector('.basket__price') as HTMLElement;
        this.button = this.container.querySelector('.basket__button') as HTMLButtonElement;
        this.button.addEventListener('click', () => {
            this.events.emit('order:open');
        });
    }

    setDisabled(disabled: boolean): void {
        this.button.disabled = disabled;
    }

    render(data: { items: HTMLElement[]; total: number }): HTMLElement {
        this.list.innerHTML = '';
        data.items.forEach((item: HTMLElement) => {
            this.list.appendChild(item);
        });
        this.total.textContent = `${data.total} синапсов`;
        return this.container;
    }
}
