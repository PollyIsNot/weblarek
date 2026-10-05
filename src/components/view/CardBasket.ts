import { CardBase } from './CardBase';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export interface ICardBasketData extends IProduct {
    index: number;
}

export class CardBasket extends CardBase<ICardBasketData> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected onDelete?: () => void
    ) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.deleteButton.addEventListener('click', () => {
            if (this.onDelete) {
                this.onDelete();
            }
        });
    }

    set index(index: number) {
        this.indexElement.textContent = String(index);
    }

    render(data: ICardBasketData): HTMLElement {
        this.setTitle(data.title);
        this.setPrice(data.price);
        this.index = data.index;
        return super.render();
    }
}
