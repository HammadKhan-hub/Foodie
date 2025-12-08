'use strict';

// ================= EXISTING CODE (navbar, header, search, delivery) =================
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const menuToggleBtn = document.querySelector("[data-menu-toggle-btn]");

menuToggleBtn.addEventListener("click", function () {
  navbar.classList.toggle("active");
  this.classList.toggle("active");
});

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    menuToggleBtn.classList.toggle("active");
  });
}

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

const searchBtn = document.querySelector("[data-search-btn]");
const searchContainer = document.querySelector("[data-search-container]");
const searchSubmitBtn = document.querySelector("[data-search-submit-btn]");
const searchCloseBtn = document.querySelector("[data-search-close-btn]");

const searchBoxElems = [searchBtn, searchSubmitBtn, searchCloseBtn];

for (let i = 0; i < searchBoxElems.length; i++) {
  searchBoxElems[i].addEventListener("click", function () {
    searchContainer.classList.toggle("active");
    document.body.classList.toggle("active");
  });
}

const deliveryBoy = document.querySelector("[data-delivery-boy]");
let deliveryBoyMove = -80;
let lastScrollPos = 0;

window.addEventListener("scroll", function () {
  let deliveryBoyTopPos = deliveryBoy.getBoundingClientRect().top;
  if (deliveryBoyTopPos < 500 && deliveryBoyTopPos > -250) {
    let activeScrollPos = window.scrollY;
    if (lastScrollPos < activeScrollPos) {
      deliveryBoyMove += 1;
    } else {
      deliveryBoyMove -= 1;
    }
    lastScrollPos = activeScrollPos;
    deliveryBoy.style.transform = `translateX(${deliveryBoyMove}px)`;
  }
});

// ================= NEW: CART & CHATBOT =================

// --- CART ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  cartCount.textContent = cart.length;
  cartItems.innerHTML = '';

  let total = 0;
  cart.forEach(item => {
    const price = parseFloat(item.price.replace('$', ''));
    total += price;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `<span>${item.name}</span><span>${item.price}</span>`;
    cartItems.appendChild(div);
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
  document.getElementById('miniCart').style.display = cart.length ? 'flex' : 'none';
}

// Connect "Order Now" buttons
document.querySelectorAll('.food-menu-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.food-menu-card');
    const name = card.querySelector('.card-title').textContent;
    const price = card.querySelector('.price').textContent;
    cart.push({ name, price });
    saveCart();
  });
});

// Cart UI toggles
document.getElementById('cartBtn').addEventListener('click', () => {
  const miniCart = document.getElementById('miniCart');
  const overlay = document.getElementById('cartOverlay');
  const isVisible = miniCart.style.display === 'flex';
  miniCart.style.display = isVisible ? 'none' : 'flex';
  overlay.style.display = isVisible ? 'none' : 'block';
  document.body.classList.toggle('active', !isVisible);
});

document.getElementById('closeCart').addEventListener('click', hideCart);
document.getElementById('cartOverlay').addEventListener('click', hideCart);

function hideCart() {
  document.getElementById('miniCart').style.display = 'none';
  document.getElementById('cartOverlay').style.display = 'none';
  document.body.classList.remove('active');
}

document.getElementById('checkoutBtn').addEventListener('click', () => {
  alert('✅ Thank you! Your order has been placed.\nWe’ll call you shortly to confirm.');
  cart = [];
  saveCart();
});

// --- CHATBOT ---
function getBotResponse(input) {
  const lower = input.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi')) return "Hello! Welcome to Burgizza! 🍔 How can I help?";
  if (lower.includes('menu') || lower.includes('food')) return "Check out our 'Shop' section! We have burgers, pizza, fries & more!";
  if (lower.includes('price') || lower.includes('cost')) return "Items start from just $29! See 'Shop' for full prices.";
  if (lower.includes('delivery') || lower.includes('time')) return "We deliver in 30-45 mins! 🚴‍♂️ Order now for fast delivery.";
  if (lower.includes('contact') || lower.includes('phone')) return "📞 Call us: +1 (062) 109-9222 or visit 'Contact Us'!";
  if (lower.includes('order') || lower.includes('cart')) return "Click the 🛒 cart button to view or checkout!";
  if (lower.includes('thank')) return "You're welcome! Enjoy your meal! 😋";
  return "I'm Burgizza Bot! 😊 Ask me about menu, delivery, or prices!";
}

function addMessage(text, sender) {
  const messages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = sender === 'user' ? 'user-message' : 'bot-message';
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

document.getElementById('chatbotBtn').addEventListener('click', () => {
  const chatbot = document.getElementById('chatbot');
  const overlay = document.getElementById('chatOverlay');
  const isVisible = chatbot.style.display === 'flex';
  chatbot.style.display = isVisible ? 'none' : 'flex';
  overlay.style.display = isVisible ? 'none' : 'block';
  document.body.classList.toggle('active', !isVisible);
});

document.getElementById('closeChat').addEventListener('click', hideChat);
document.getElementById('chatOverlay').addEventListener('click', hideChat);

function hideChat() {
  document.getElementById('chatbot').style.display = 'none';
  document.getElementById('chatOverlay').style.display = 'none';
  document.body.classList.remove('active');
}

document.getElementById('sendBtn').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (text) {
    addMessage(text, 'user');
    input.value = '';
    setTimeout(() => addMessage(getBotResponse(text), 'bot'), 500);
  }
}

// Initialize
updateCartUI();
