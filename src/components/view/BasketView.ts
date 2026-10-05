import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IBasketViewData {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends Component<IBasketViewData> {
    protected list: HTMLElement;
    protected total: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents
    ) {
        super(container);
        this.list = ensureElement<HTMLElement>('.basket__list', this.container);
        this.total = ensureElement<HTMLElement>('.basket__price', this.container);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.button.addEventListener('click', () => {
            this.events.emit('order:open');
        });
    }

    setDisabled(disabled: boolean): void {
        this.button.disabled = disabled;
    }

    render(data?: IBasketViewData): HTMLElement {
        if (data) {
            this.list.innerHTML = '';
            data.items.forEach((item: HTMLElement) => {
                this.list.appendChild(item);
            });
            this.total.textContent = `${data.total} синапсов`;
        }
        return super.render();
    }
}
