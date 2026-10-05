import './scss/styles.scss';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/api/WebLarekApi';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { CatalogModel } from './components/models/CatalogModel';
import { Basket } from './components/models/Basket';
import { BuyerModel } from './components/models/BuyerModel';
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
import { FormErrors, IOrder, TPayment } from './types';

const events = new EventEmitter();

// Модели данных
const catalogModel = new CatalogModel(events);
const basketModel = new Basket(events);
const buyerModel = new BuyerModel(events);

// API
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// DOM элементы
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

// View компоненты
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer);
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

// Создание компонентов один раз в начале скрипта
const cardPreview = new CardPreview(
    cloneTemplate(cardPreviewTemplate),
    () => {
        events.emit('card:toggle');
    }
);

const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const formOrder = new FormOrder(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const formContacts = new FormContacts(cloneTemplate<HTMLFormElement>(contactsTemplate), events);
const successView = new Success(cloneTemplate(successTemplate), events);

// Каталог товаров изменился
events.on('items:changed', () => {
    const items = catalogModel.getProducts();
    const cards = items.map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), () => {
            events.emit('card:select', { id: item.id });
        });
        return card.render(item);
    });
    gallery.render({ items: cards });
});

// Товар выбран для просмотра
events.on('preview:changed', () => {
    const preview = catalogModel.getPreview();
    if (preview) {
        let buttonText = 'В корзину';
        let buttonDisabled = false;

        if (preview.price === null) {
            buttonText = 'Недоступно';
            buttonDisabled = true;
        } else if (basketModel.hasItem(preview.id)) {
            buttonText = 'Удалить из корзины';
        }

        modal.setContent(cardPreview.render({
            ...preview,
            buttonText,
            buttonDisabled
        }));
        modal.open();
    }
});

// Содержимое корзины изменилось
events.on('basket:changed', () => {
    header.setCounter(basketModel.getCount());

    // Перерисовка корзины
    const items = basketModel.getItems();
    const total = basketModel.getTotal();
    const cardElements = items.map((item, index) => {
        const cardBasket = new CardBasket(
            cloneTemplate(cardBasketTemplate),
            () => {
                events.emit('card:remove', { id: item.id });
            }
        );
        return cardBasket.render({ ...item, index: index + 1 });
    });

    basketView.render({ items: cardElements, total });

    // Блокировка кнопки при пустой корзине
    basketView.setDisabled(items.length === 0);
});

events.on('buyer:changed', () => {
    const buyer = buyerModel.getData();
    const errors = buyerModel.validate();
    const orderErrors: FormErrors = {};
    const contactsErrors: FormErrors = {};

    if (errors.payment) {
        orderErrors.payment = errors.payment;
    }
    if (errors.address) {
        orderErrors.address = errors.address;
    }
    if (errors.email) {
        contactsErrors.email = errors.email;
    }
    if (errors.phone) {
        contactsErrors.phone = errors.phone;
    }

    formOrder.render({
        payment: buyer.payment,
        address: buyer.address,
        errors: orderErrors,
        isSubmitDisabled: Object.keys(orderErrors).length > 0
    });

    formContacts.render({
        email: buyer.email,
        phone: buyer.phone,
        errors: contactsErrors,
        isSubmitDisabled: Object.keys(contactsErrors).length > 0
    });
});

// Клик на карточку товара
events.on('card:select', (data: { id: string }) => {
    const product = catalogModel.getProductById(data.id);
    if (product) {
        catalogModel.setPreview(product);
    }
});

// Переключение товара в корзине (добавить/удалить)
events.on('card:toggle', () => {
    const product = catalogModel.getPreview();
    if (product) {
        if (basketModel.hasItem(product.id)) {
            basketModel.removeItem(product.id);
        } else {
            basketModel.addItem(product);
        }
        modal.close();
    }
});

// Удаление товара из корзины
events.on('card:remove', (data: { id: string }) => {
    basketModel.removeItem(data.id);
});

// Открытие корзины
events.on('basket:open', () => {
    modal.setContent(basketView.render());
    modal.open();
});

// При открытии формы заказа
events.on('order:open', () => {
    modal.setContent(formOrder.render());
    modal.open();
});

// Изменение поля формы
events.on('form:change', (data: {
    field: 'payment' | 'address' | 'email' | 'phone';
    value: string;
}) => {
    const { field, value } = data;

    if (field === 'payment') {
        if (value === 'card' || value === 'cash') {
            const payment: TPayment = value;
            buyerModel.setData({ payment });
        }
    } else if (field === 'address') {
        buyerModel.setData({ address: value });
    } else if (field === 'email') {
        buyerModel.setData({ email: value });
    } else if (field === 'phone') {
        buyerModel.setData({ phone: value });
    }
});

// Отправка формы заказа
events.on('order:submit', () => {
    modal.setContent(formContacts.render());
    modal.open();
});

// Отправка формы контактов
events.on('contacts:submit', () => {
    const buyer = buyerModel.getData();
    const order: IOrder = {
        ...buyer,
        items: basketModel.getItems().map(item => item.id),
        total: basketModel.getTotal()
    };

    webLarekApi
        .postOrder(order)
        .then((response) => {
            modal.setContent(successView.render({ total: response.total }));
            modal.open();
            basketModel.clear();
            buyerModel.clear();
        })
        .catch((error) => {
            console.error('Ошибка при отправке заказа:', error);
        });
});

// Закрытие окна успеха
events.on('success:close', () => {
    modal.close();
});

// Загрузка товаров с сервера
webLarekApi
    .getProducts()
    .then((response) => {
        catalogModel.setProducts(response.items);
        // Инициализация моделей в стартовое состояние
        buyerModel.clear();
        basketModel.clear();
    })
    .catch((error) => {
        console.error('Ошибка при загрузке товаров:', error);
    });

console.log('Приложение инициализировано');
