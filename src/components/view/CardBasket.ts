import { Component } from '../base/Component';
import { IProduct } from '../../types';

export class CardBasket extends Component<IProduct> {
    protected title: HTMLElement;
    protected price: HTMLElement;
    protected index: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected onDelete?: (id: string) => void
    ) {
        super(container);

        this.title = this.container.querySelector('.card__title') as HTMLElement;
        this.price = this.container.querySelector('.card__price') as HTMLElement;
        this.index = this.container.querySelector('.basket__item-index') as HTMLElement;
        this.deleteButton = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;

        this.deleteButton.addEventListener('click', () => {
            if (this.onDelete) {
                this.onDelete((this.container as any).dataset.id);
            }
        });
    }

    render(data: IProduct, index?: number): HTMLElement {
    this.container.dataset.id = data.id;
    this.title.textContent = data.title;
    this.price.textContent = `${data.price} синапсов`;
    
    if (index !== undefined) {
        this.setIndex(index + 1);
    }
    
    return this.container;
}

setIndex(index: number): void {
    this.index.textContent = String(index);
}

}
