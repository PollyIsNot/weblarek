import { CardBase } from './CardBase';
import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class CardPreview extends CardBase {
    protected image: HTMLImageElement;
    protected category: HTMLElement;
    protected description: HTMLElement;
    protected button: HTMLButtonElement;
    private productId: string = '';

    constructor(
        container: HTMLElement,
        protected onAddToBasket?: (id: string) => void
    ) {
        super(container);
        
        this.image = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.category = ensureElement<HTMLElement>('.card__category', this.container);
        this.description = ensureElement<HTMLElement>('.card__text', this.container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.button.addEventListener('click', () => {
            if (this.onAddToBasket) {
                this.onAddToBasket(this.productId);
            }
        });
    }

    render(data: IProduct): HTMLElement {
        this.productId = data.id;
        this.setTitle(data.title);
        this.setImage(this.image, `${CDN_URL}${data.image}`, data.title);
        
        this.category.className = 'card__category';
        const categoryModifier = categoryMap[data.category as keyof typeof categoryMap];
        if (categoryModifier) {
            this.category.classList.add(categoryModifier);
        }
        this.category.textContent = data.category;

        this.description.textContent = data.description;
        this.setPrice(data.price);
        
        // Установка текста кнопки и её состояния в зависимости от цены
        if (data.price === null) {
            this.setButtonText('Недоступно');
            this.setButtonDisabled(true);
        } else {
            this.setButtonText('Купить');
            this.setButtonDisabled(false);
        }
        
        return this.container;
    }

    setButtonText(text: string): void {
        this.button.textContent = text;
    }

    setButtonDisabled(disabled: boolean): void {
        this.button.disabled = disabled;
    }
}





