import { CardBase } from './CardBase';
import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export interface ICardPreviewData extends IProduct {
    buttonText: string;
    buttonDisabled: boolean;
}

export class CardPreview extends CardBase<ICardPreviewData> {
    protected image: HTMLImageElement;
    protected category: HTMLElement;
    protected description: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected onButtonClick?: () => void
    ) {
        super(container);

        this.image = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.category = ensureElement<HTMLElement>('.card__category', this.container);
        this.description = ensureElement<HTMLElement>('.card__text', this.container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.button.addEventListener('click', () => {
            if (this.onButtonClick) {
                this.onButtonClick();
            }
        });
    }

    render(data: ICardPreviewData): HTMLElement {
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
        this.setButtonText(data.buttonText);
        this.setButtonDisabled(data.buttonDisabled);

        return super.render();
    }

    setButtonText(text: string): void {
        this.button.textContent = text;
    }

    setButtonDisabled(disabled: boolean): void {
        this.button.disabled = disabled;
    }
}
