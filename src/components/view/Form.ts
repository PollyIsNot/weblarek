import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { FormErrors } from '../../types';

export interface IFormData {
    errors: FormErrors;
    isSubmitDisabled: boolean;
}

export class Form extends Component<IFormData> {
    protected form: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        // Проверяем, является ли сам контейнер формой
        if (this.container instanceof HTMLFormElement) {
            this.form = this.container as HTMLFormElement;
        } else {
            // Если контейнер не форма, ищем форму внутри
            this.form = ensureElement<HTMLFormElement>('form', this.container);
        }
        
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.form);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.form);

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('form:submit');
        });

        this.form.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement | HTMLButtonElement;
            if (target.name) {
                this.events.emit('form:change', {
                    field: target.name,
                    value: target.value || target.getAttribute('name')
                });
            }
        });
    }

    render(data: IFormData): HTMLElement {
        this.setErrors(data.errors);
        this.setSubmitButtonState(!data.isSubmitDisabled);
        return this.container;
    }

    setErrors(errors: FormErrors): void {
        const errorMessages = Object.values(errors).filter(msg => msg);
        this.errorsElement.textContent = errorMessages.join('; ');
    }

    setSubmitButtonState(isEnabled: boolean): void {
        this.submitButton.disabled = !isEnabled;
    }

    protected clearForm(): void {
        this.form.reset();
    }
}



