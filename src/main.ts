import './scss/styles.scss';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/api/WebLarekApi';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Order } from './components/models/Order';
import { apiProducts } from './utils/data';

const events = new EventEmitter();

const productsModel = new Products(events);
const basketModel = new Basket(events);
const orderModel = new Order(events);

console.log('--- TEST PRODUCTS ---');

productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога: ', productsModel.getItems());

// получения первого товарв
const firstProduct = productsModel.getProduct(apiProducts.items[0].id);
console.log('Первый товар: ', firstProduct);

// устанавливаем товар для предпросмотра
productsModel.setPreview(apiProducts.items[0].id);
console.log('Товар для предпросмотра: ', productsModel.getPreview());

console.log('\n--- TEST BASKET ---');

// добавляем товары в корзину
const product1 = apiProducts.items[0];
const product2 = apiProducts.items[1];

basketModel.addItem(product1);
console.log('После добавления первого товара: ', basketModel.getItems());
console.log('Количество товаров: ', basketModel.getCount());

basketModel.addItem(product2);
console.log('После добавления второго товара: ', basketModel.getItems());
console.log('Количество товаров: ', basketModel.getCount());
console.log('Общая стоимость: ', basketModel.getTotal());

// проверяем наличие товара
console.log('Есть ли товар с ID ' + product1.id + ': ', basketModel.hasItem(product1.id));

// удаляем товар
basketModel.removeItem(product1.id);
console.log('После удаления первого товара: ', basketModel.getItems());
console.log('Количество товаров: ', basketModel.getCount());
console.log('Общая стоимость: ', basketModel.getTotal());

basketModel.clear();
console.log('После очистки корзины: ', basketModel.getItems());

console.log('\n--- TEST ORDER ---');

orderModel.setPayment('card');
console.log('Ошибки после установки способа оплаты: ', orderModel.getFormErrors());

orderModel.setAddress('ул. Примерная, 123');
console.log('Ошибки после установки адреса: ', orderModel.getFormErrors());

orderModel.setEmail('test@example.com');
console.log('Ошибки после установки email: ', orderModel.getFormErrors());

orderModel.setPhone('+7 (999) 123-45-67');
console.log('Ошибки после установки телефона: ', orderModel.getFormErrors());

orderModel.setTotal(3200);
orderModel.setItems([product1.id, product2.id]);

console.log('Данные заказа: ', orderModel.getOrder());
console.log('Ошибки валидации: ', orderModel.getFormErrors());

// проверяем валидацию с некорректным email
orderModel.setEmail('invalid-email');
console.log('Ошибки при некорректном email: ', orderModel.getFormErrors());

orderModel.clear();
console.log('После очистки заказа: ', orderModel.getOrder());

console.log('\n--- TEST API ---');

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// Пример проверки получения списка продуктов от сервера
webLarekApi
    .getProducts()
    .then((response) => {
        productsModel.setItems(response.items);
        console.log('Каталог товаров успешно загружен с сервера:', productsModel.getItems());
    })
    .catch((error) => {
        console.error('Ошибка при получении товаров:', error);
    });

console.log('Приложение инициализировано');

