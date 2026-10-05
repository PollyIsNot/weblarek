import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export abstract class CardBase<T extends IProduct> extends Component<T> {
    protected title: HTMLElement;
    protected price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.title = ensureElement<HTMLElement>('.card__title', this.container);
        this.price = ensureElement<HTMLElement>('.card__price', this.container);
    }

    protected setTitle(title: string): void {
        this.title.textContent = title;
    }

    protected setPrice(price: number | null): void {
        if (price) {
            this.price.textContent = `${price} синапсов`;
        } else {
            this.price.textContent = 'Бесценно';
        }
    }
}
