import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';

export class Card extends Component<IProduct> {
    protected title: HTMLElement;
    protected image: HTMLImageElement;
    protected category: HTMLElement;
    protected price: HTMLElement;

    constructor(
        container: HTMLElement,
        protected onClick?: (id: string) => void
    ) {
        super(container);

        this.title = this.container.querySelector('.card__title') as HTMLElement;
        this.image = this.container.querySelector('.card__image') as HTMLImageElement;
        this.category = this.container.querySelector('.card__category') as HTMLElement;
        this.price = this.container.querySelector('.card__price') as HTMLElement;

        this.container.addEventListener('click', () => {
            if (this.onClick) {
                this.onClick((this.container as any).dataset.id);
            }
        });
    }

    render(data: IProduct): HTMLElement {
        this.container.dataset.id = data.id;
        
        this.title.textContent = data.title;
        this.setImage(this.image, `${CDN_URL}${data.image}`, data.title);
        
        // Очищаем старые модификаторы категории
        this.category.className = 'card__category';
        // Добавляем новый модификатор
        const categoryModifier = categoryMap[data.category as keyof typeof categoryMap];
        if (categoryModifier) {
            this.category.classList.add(categoryModifier);
        }
        this.category.textContent = data.category;
        
        if (data.price) {
            this.price.textContent = `${data.price} синапсов`;
        } else {
            this.price.textContent = 'Бесценно';
        }

        return this.container;
    }
}
