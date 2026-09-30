import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';

export class CardPreview extends Component<IProduct> {
    protected title: HTMLElement;
    protected image: HTMLImageElement;
    protected category: HTMLElement;
    protected price: HTMLElement;
    protected description: HTMLElement;
    protected button: HTMLButtonElement;

     constructor(
        container: HTMLElement,
        protected events: any,
        protected onAddToBasket?: (id: string) => void,
        protected isInBasket: boolean = false // ✅ ДОБАВИТЬ
    ) {
        super(container);
        
        this.title = this.container.querySelector('.card__title') as HTMLElement;
        this.image = this.container.querySelector('.card__image') as HTMLImageElement;
        this.category = this.container.querySelector('.card__category') as HTMLElement;
        this.price = this.container.querySelector('.card__price') as HTMLElement;
        this.description = this.container.querySelector('.card__text') as HTMLElement;
        this.button = this.container.querySelector('.card__button') as HTMLButtonElement;

        this.button.addEventListener('click', () => {
            if (this.onAddToBasket) {
                this.onAddToBasket((this.container as any).dataset.id);
            }
        });
    }

    render(data: IProduct): HTMLElement {
        this.container.dataset.id = data.id;
        this.title.textContent = data.title;
        this.setImage(this.image, `${CDN_URL}${data.image}`, data.title);
        
        this.category.className = 'card__category';
        const categoryModifier = categoryMap[data.category as keyof typeof categoryMap];
        if (categoryModifier) {
            this.category.classList.add(categoryModifier);
        }
        this.category.textContent = data.category;

        if (data.price) {
            this.price.textContent = `${data.price} синапсов`;
            this.button.disabled = false;
            this.button.textContent = this.isInBasket ? 'Удалить из корзины' : 'В корзину';
        } else {
            this.price.textContent = 'Бесценно';
            this.button.disabled = true;
            this.button.textContent = 'Не продается';
        }

        this.description.textContent = data.description;
        return this.container;
    }
}
