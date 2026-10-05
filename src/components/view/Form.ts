import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { FormErrors } from '../../types';

export interface IFormData {
    errors: FormErrors;
    isSubmitDisabled: boolean;
}

export class Form<T extends IFormData> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(
        container: HTMLFormElement,
        protected events: IEvents,
        submitEvent: string
    ) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit(submitEvent);
        });
    }

    set errors(errors: FormErrors) {
        const errorMessages = Object.values(errors).filter(msg => msg);
        this.errorsElement.textContent = errorMessages.join('; ');
    }

    set isSubmitDisabled(disabled: boolean) {
        this.submitButton.disabled = disabled;
    }
}
