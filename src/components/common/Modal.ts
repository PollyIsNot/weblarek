import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<void> {
    protected closeButton: HTMLButtonElement;
    protected content: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.content = ensureElement<HTMLElement>('.modal__content', this.container);

        this.closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        });
    }

    setContent(content: HTMLElement): void {
        this.content.innerHTML = '';
        this.content.appendChild(content);
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
    }
}



