import { Component } from '../base/Component';
import { IProduct } from '../../types';

export abstract class CardBase extends Component<IProduct> {
    protected title: HTMLElement;
    protected price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.title = this.container.querySelector('.card__title') as HTMLElement;
        this.price = this.container.querySelector('.card__price') as HTMLElement;
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

