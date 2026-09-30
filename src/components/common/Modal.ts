import { Component } from '../base/Component';

export class Modal extends Component<void> {
    protected closeButton: HTMLButtonElement;
    protected content: HTMLElement;

    constructor(container: HTMLElement, protected events: any) {
        super(container);
        
        this.closeButton = this.container.querySelector('.modal__close') as HTMLButtonElement;
        this.content = this.container.querySelector('.modal__content') as HTMLElement;

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
        this.events.emit('modal:close');
    }

    render(): HTMLElement {
        return this.container;
    }
}
