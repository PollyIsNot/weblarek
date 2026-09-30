import { Component } from '../base/Component';

export class Success extends Component<{ total: number }> {
    protected description: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: any
    ) {
        super(container);

        this.description = this.container.querySelector('.order-success__description') as HTMLElement;
        this.closeButton = this.container.querySelector('.order-success__close') as HTMLButtonElement;

        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    render(data: { total: number }): HTMLElement {
        this.description.textContent = `Списано ${data.total} синапсов`;
        return this.container;
    }
}
