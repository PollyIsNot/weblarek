import './scss/styles.scss';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/api/WebLarekApi';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Order } from './components/models/Order';
// View компоненты
import { Gallery } from './components/view/Gallery';
import { Card } from './components/view/Card';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { Modal } from './components/common/Modal';
import { Header } from './components/view/Header';
import { BasketView } from './components/view/BasketView';
import { FormOrder } from './components/view/FormOrder';
import { FormContacts } from './components/view/FormContacts';
import { Success } from './components/view/Success';
import { cloneTemplate, ensureElement } from './utils/utils';
import { FormErrors, IProduct } from './types';
import { Form } from './components/view/Form';

const events = new EventEmitter();

// Модели данных
const productsModel = new Products(events);
const basketModel = new Basket(events);
const orderModel = new Order(events);

// API
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// DOM элементы
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

// View компоненты
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer, events);
const header = new Header(
    ensureElement<HTMLElement>('.header'),
    events
);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Переменная для отслеживания текущего экземпляра активной формы
let currentFormInstance: Form | null = null;

// Каталог товаров изменился
events.on('items:changed', () => {
    const items = productsModel.getItems();
    const cards = items.map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), (id: string) => {
            events.emit('card:select', { id });
        });
        return card.render(item);
    });
    gallery.render({ items: cards });
});

// Товар выбран для просмотра
events.on('preview:changed', (data: { preview: IProduct | undefined }) => {
    if (data.preview) {
        const cardPreview = new CardPreview(
            cloneTemplate(cardPreviewTemplate),
            events,
            (id: string) => {
                events.emit('card:add', { id });
            }
        );
        modal.setContent(cardPreview.render(data.preview));
        modal.open();
    }
});

// Содержимое корзины изменилось
events.on('basket:changed', () => {
    header.setCounter(basketModel.getItems().length);
});

// При открытии формы заказа
events.on('order:open', () => {
    const formOrder = new FormOrder(cloneTemplate(orderTemplate), events);
    currentFormInstance = formOrder;
    modal.setContent(formOrder.render());
    modal.open();
});

// При открытии формы контактов
events.on('order:submit', () => {
    const formContacts = new FormContacts(cloneTemplate(contactsTemplate), events);
    currentFormInstance = formContacts;
    modal.setContent(formContacts.render());
    modal.open();
});

// Заказ валидирован
events.on('order:validated', (data: { isValid: boolean; errors: FormErrors }) => {
    if (currentFormInstance) {
        currentFormInstance.setSubmitButtonState(data.isValid);
        currentFormInstance.setErrors(data.errors);
    }
});

// Клик на карточку товара
events.on('card:select', (data: { id: string }) => {
    productsModel.setPreview(data.id);
});

// Добавление товара в корзину
events.on('card:add', (data: { id: string }) => {
    const product = productsModel.getProduct(data.id);
    if (product && product.price !== null) {
        basketModel.addItem(product);
        modal.close();
    }
});

// Удаление товара из корзины
events.on('card:remove', (data: { id: string }) => {
    basketModel.removeItem(data.id);
    events.emit('basket:open');
});

// Открытие корзины
events.on('basket:open', () => {
    const items = basketModel.getItems();
    const total = basketModel.getTotal();
    const basketView = new BasketView(cloneTemplate(basketTemplate), events);

    if (items.length === 0) {
        // Передаем пустой массив в render, чтобы BasketView сам заблокировал кнопку (items.length === 0)
        basketView.render({ items: [], total });

        // Добавляем сообщение "Корзина пуста" в список после render
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'Корзина пуста';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        
        const list = basketView.container.querySelector('.basket__list');
        if (list) {
            list.appendChild(emptyMessage);
        }
    } else {
        const cardElements = items.map((item, index) => {
            const cardBasket = new CardBasket(
                cloneTemplate(cardBasketTemplate),
                (id: string) => {
                    events.emit('card:remove', { id });
                }
            );
            cardBasket.setIndex(index + 1);
            return cardBasket.render(item);
        });
        basketView.render({ items: cardElements, total });
    }

    modal.setContent(basketView.container);
    modal.open();
});

// Изменение поля формы
events.on('form:change', (data: { field: string; value: string }) => {
    const { field, value } = data;
    if (field === 'payment') {
        orderModel.setPayment(value as 'card' | 'cash');
    } else if (field === 'address') {
        orderModel.setAddress(value);
    } else if (field === 'email') {
        orderModel.setEmail(value);
    } else if (field === 'phone') {
        orderModel.setPhone(value);
    }
});

// Отправка формы
events.on('form:submit', () => {
    const currentForm = modal.container.querySelector('form') as HTMLFormElement;
    const formName = currentForm?.getAttribute('name');
    if (formName === 'order') {
        const formContacts = new FormContacts(cloneTemplate(contactsTemplate), events);
        currentFormInstance = formContacts;
        modal.setContent(formContacts.render());
        modal.open();
    } else if (formName === 'contacts') {
        // Отправка заказа на сервер
        const items = basketModel.getItems();
        const total = basketModel.getTotal();
        orderModel.setTotal(total);
        orderModel.setItems(items.map(item => item.id));
        const order = orderModel.getOrder();
        webLarekApi
            .postOrder(order)
            .then((response) => {
                const successView = new Success(cloneTemplate(successTemplate), events);
                modal.setContent(successView.render({ total: response.total }));
                modal.open();
                basketModel.clear();
                orderModel.clear();
            })
            .catch((error) => {
                console.error('Ошибка при отправке заказа:', error);
            });
    }
});

// Закрытие модального окна
events.on('modal:close', () => {
    // Логика закрытия уже реализована в Modal
});

// Закрытие окна успеха
events.on('success:close', () => {
    modal.close();
    basketModel.clear();
    orderModel.clear();
    header.setCounter(0);
});

// Загрузка товаров с сервера
webLarekApi
    .getProducts()
    .then((response) => {
        productsModel.setItems(response.items);
    })
    .catch((error) => {
        console.error('Ошибка при загрузке товаров:', error);
    });

console.log('Приложение инициализировано');