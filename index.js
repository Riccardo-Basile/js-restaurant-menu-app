import { menuArray } from './data.js';

function renderMenu(arr) {
  document.querySelector('.menu').innerHTML = menuArray
    .map((item) => {
      return `<li data-id="${item.id}">
        <div class="item">
            <div class="item-icon">${item.emoji}</div>
            <div class="item-infos">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-ingredients">${item.ingredients.join(', ')}</p>
                <p class="item-price">$${item.price}</p>
            </div>
            <button class="add-btn">+</button>
        </div>
    </li>
    `;
    })
    .join('');
}

const orderItems = [];

function addItemToOrder(e) {
  if (e.target.classList.contains('add-btn')) {
    const newItemToOrder = menuArray.filter(
      (item) => item.id == e.target.parentElement.parentElement.dataset.id
    );
    const reducedItemInfos = {
      name: newItemToOrder[0].name,
      price: newItemToOrder[0].price,
    };
    orderItems.push(reducedItemInfos);
  } else {
    return;
  }

  renderOrderList(orderItems);
}

function renderOrderList(arr) {
  if (arr.length === 0) {
    document.querySelector('.order').style.display = 'none';
  } else {
    document.querySelector('.order-list').innerHTML = arr
      .map(
        (item, index) =>
          `
        <li class="order-item" data-id="${index}">
                <span>${item.name}</span>
                <span class="remove">remove</span>
                <span>\$${item.price}</span>
            </li>
    `
      )
      .join('');
    document.querySelector('.order').style.display = 'flex';
    document
      .querySelector('.order-list')
      .addEventListener('click', removeItemFromOrder);
  }
  renderOrderTotal(arr);
}

function renderOrderTotal(arr) {
  if (arr.length === 0) {
    return;
  }
  const totalAmount = calculateOrderTotal(arr);
  document.querySelector('.total').innerHTML = `
        <span>Total price:</span>
        <span class="total-amount">\$${totalAmount}</span>
    `;
}

function calculateOrderTotal(arr) {
  const orderTotal = arr.reduce((total, currItem) => {
    return total + currItem.price;
  }, 0);
  return orderTotal;
}

function removeItemFromOrder(e) {
  if (e.target.classList.contains('remove')) {
    const itemRemoved = e.target.parentElement.dataset.id;
    orderItems.splice(itemRemoved, 1);
    renderOrderList(orderItems);
  } else {
    return;
  }
}

function completeOrder(e) {
  e.preventDefault();
  if (e.target.classList.contains('order-btn')) {
    document.querySelector('.payment-window').style.display = 'flex';
    document
      .querySelector('.payment-form ')
      .addEventListener('submit', payOrder);
  } else {
    return;
  }
}

function payOrder(e) {
  e.preventDefault();
  const creditCardPattern = /\D/;
  const data = document.forms['payment-form'];
  if (
    !creditCardPattern.test(data[1].value) &&
    !creditCardPattern.test(data[2].value)
  ) {
    renderThanksMessage(data);
    resetUI();
  } else {
    alert('Please, insert correct credit card data');
  }
}

function renderThanksMessage(data) {
  document.querySelector('.order-complete-message').innerHTML = `
    <div class="container">
      <p>Thanks, ${data[0].value}! Your order is on its way!</p>
    </div>
  `;
  document.querySelector('.order-complete-message').style.display = 'block';
}
function resetUI() {
  document.querySelector('.payment-window').style.display = 'none';
  resetOrderItems();
  resetPaymentInfos();
  renderOrderList(orderItems);
}
function resetOrderItems() {
  while (orderItems.length > 0) {
    orderItems.pop();
  }
}

function resetPaymentInfos() {
  document
    .querySelectorAll('.payment-form input')
    .forEach((input) => (input.value = ''));
}

function formatCreditCardInput(e) {
  const input = e.target;
  if (input.value.length > 0) {
    if (input.value.length % 4 == 0) {
      input.value += '    ';
    }
  }
}

function init() {
  renderMenu(menuArray);
  renderOrderList(orderItems);
  document.querySelector('.menu').addEventListener('click', addItemToOrder);
  document.querySelector('.order').addEventListener('click', completeOrder);
}

document.addEventListener('DOMContentLoaded', init());
