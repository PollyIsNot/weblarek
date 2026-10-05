import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Success extends Component<{ total: number }> {
    protected description: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents
    ) {
        super(container);

        this.description = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    render(data: { total: number }): HTMLElement {
        this.description.textContent = `Списано ${data.total} синапсов`;
        return super.render();
    }
}
