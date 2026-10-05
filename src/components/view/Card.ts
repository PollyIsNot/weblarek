import { CardBase } from './CardBase';
import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class Card extends CardBase<IProduct> {
    protected image: HTMLImageElement;
    protected category: HTMLElement;

    constructor(
        container: HTMLElement,
        protected onClick?: () => void
    ) {
        super(container);

        this.image = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.category = ensureElement<HTMLElement>('.card__category', this.container);

        this.container.addEventListener('click', () => {
            if (this.onClick) {
                this.onClick();
            }
        });
    }

    render(data: IProduct): HTMLElement {
        this.setTitle(data.title);
        this.setImage(this.image, `${CDN_URL}${data.image}`, data.title);

        // Очищаем старые модификаторы категории
        this.category.className = 'card__category';
        // Добавляем новый модификатор
        const categoryModifier = categoryMap[data.category as keyof typeof categoryMap];
        if (categoryModifier) {
            this.category.classList.add(categoryModifier);
        }
        this.category.textContent = data.category;

        this.setPrice(data.price);

        return super.render();
    }
}
