import { Component } from '../base/Component';

export class Form extends Component<any> {
    protected form: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errorContainer: HTMLElement;

    constructor(
        container: HTMLElement,
        protected events: any
    ) {
        super(container);

        // Проверяем, является ли сам контейнер формой, иначе ищем её внутри
        this.form = container.tagName === 'FORM' 
            ? container as HTMLFormElement 
            : container.querySelector('form') as HTMLFormElement;

        if (!this.form) {
            throw new Error('Форма не найдена в контейнере');
        }

        this.submitButton = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.errorContainer = this.form.querySelector('.form__errors') as HTMLElement;

        if (!this.submitButton || !this.errorContainer) {
            throw new Error('Не найдены необходимые элементы формы');
        }

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('form:submit');
        });

        // Используем 'input' вместо 'change', чтобы отслеживать ввод каждого символа.
        // Обязательно генерируем событие 'form:change', чтобы main.ts его поймал.
        this.form.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement | HTMLSelectElement;
            if (target.name) {
                this.events.emit('form:change', {
                    field: target.name,
                    value: target.value
                });
            }
        });
    }

    setSubmitButtonState(isValid: boolean): void {
        this.submitButton.disabled = !isValid;
    }

    setErrors(errors: Record<string, string>): void {
        this.errorContainer.textContent = '';
        if (Object.keys(errors).length > 0) {
            this.errorContainer.textContent = Object.values(errors).join(', ');
        }
    }

    clearForm(): void {
        this.form.reset();
    }

    render(): HTMLElement {
        return this.container;
    }
}

