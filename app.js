//variables//
const cartBtn = document.querySelector('.carrito-logo');
const mousesDOM = document.querySelector('.mouse-products');
const keyboardsDOM = document.querySelector('.keyboard-products');
const buyCartBtn = document.querySelector('.buyCart');
const closeCartBtn = document.querySelector('.cerrar-carrito');
const cartTotal = document.querySelector('.priceResult');
const cartRemove = document.querySelector('.remove-item');
const cartContent = document.querySelector('.carrito__productos');
const cartProduct = document.querySelector('.producto-carrito');
const cartOverlay = document.querySelector('.cart-overlay');
const cartDOM = document.querySelector('.carrito');
//cart
let cart = [];
//buttons
let buttonsDOM = [];
let productsDOM = [];

//variables modal
const modalDOM = document.querySelector('.modal');
const closeModal = document.querySelector('.cerrar-modal');
let modalesDOM = [];


//getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map(item => {
        const {type,brand,title,price,image} = item.fields;
        const {id} = item.sys;
        return {type,brand,title,price,id,image};
      })
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}
//display products
class UI {
  displayProducts(products) {
    let resultm = '';
    let resultk = '';
    products.forEach(product => {
      if (product.type == "mouse"){
        resultm += `
        <div class="caja--productos caja-${product.id}" data-id=${product.id}>
          <div class="caja__imagen"><img class="product-img" src=${product.image} /></div>
          <div class="caja--productos__contenido">
            <h3>${product.title}</h3>
          </div>
        </div>
        `;
        mousesDOM.innerHTML = resultm;
      } else {
        resultk += `
        <div class="caja--productos caja-${product.id}" data-id=${product.id}>
          <div class="caja__imagen"><img src=${product.image} /></div>
          <div class="caja--productos__contenido">
            <h3>${product.title}</h3>
          </div>
        </div>
        `;
        keyboardsDOM.innerHTML = resultk;
      }
    });
  }
  //cart
  getCartButtons() {
    const buttons = [...document.querySelectorAll(".addCart")];
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if(inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener('click', (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        //get product from products
        let cartItem = {...Storage.getProduct(id), amount:1};
        //add product to the cart
        cart = [...cart, cartItem];
        //save cart in local storage
        Storage.saveCart(cart);
        //set cart values
        this.setCartValues(cart);
        //display cart item
        this.addCartItem(cartItem);
      })
    })
  }
  setCartValues(cart) {
    let tempTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
    });
    cartTotal.innerText = `$ ${tempTotal} MXN`;
  }
  addCartItem(item) {
    const div = document.createElement('div');
    div.classList.add('producto-carrito');
    div.innerHTML = `
      <div class="producto-imagen"><img src=${item.image}/></div>
        <div class="producto-contenido">
          <h2>${item.brand}</h2>
          <h2 class="titulo">${item.title}</h2>
          <p class="producto-precio">$ ${item.price} MXN</p>
          <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
      <div class="producto-cantidad">
        <h3>Quantity</h3>
        <div>
          <i class="fas fa-chevron-up" data-id=${item.id}></i>
          <p class="item-amount">${item.amount}</p>
          <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>
      </div>
    `;
    cartContent.appendChild(div);
  }
  showCart() {
    cartOverlay.classList.add('fondoTransparente');
    cartDOM.classList.add('showCart');
  }
  hideCart() {
    cartOverlay.classList.remove('fondoTransparente');
    cartDOM.classList.remove('showCart');
  }
  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener('click', this.showCart);
    closeCartBtn.addEventListener('click', this.hideCart);
  }
  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }
  cartLogic() {
    // buy
    buyCartBtn.addEventListener('click', () => {
      this.buyCart();
    });
    // functionality of the cart
    cartContent.addEventListener('click', event => {
      if(event.target.classList.contains('remove-item')) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      }
      else if(event.target.classList.contains('fa-chevron-up')) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount += 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      }
      else if(event.target.classList.contains('fa-chevron-down')) {
        let lessAmount = event.target;
        let id = lessAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount -= 1;
        if(tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lessAmount.previousElementSibling.innerText = tempItem.amount;
          console.log(lessAmount.parentElement.parentElement.parentElement);
        } else {
          cartContent.removeChild(lessAmount.parentElement.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    })
  }
  buyCart() {
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));
    while(cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
  removeItem(id) {
    cart = cart.filter(item => item.id !==id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerText = "Add to Cart";
  }
  getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
  }
  //modales
  displayModales(products) {
    let result = '';
    products.forEach(product => {
      result += `
      <div class="modal__producto modal-${product.id}" data-id="${product.id}">
        <span class="cerrar-modal">
          <i class="fas fa-window-close"></i>
        </span>
        <div class="modal__producto-imagen"><img src=${product.image}/></div>
          <div class="modal__producto-contenido">
            <div class="modal__producto-contenido-titulo">
              <h2>${product.brand}</h2>
              <h2 class="titulo">${product.title}</h2>
            </div>
            <div class="modal__producto-contenido-precio">
              <h3>Price:</h3>
              <p>$ ${product.price} MXN</p>
            </div>
            <div class="modal__producto-contenido-button">
              <button class="addCart" data-id=${product.id}>Add to Cart</button>
            </div>
          </div>
      </div>
      `;
    });
    modalDOM.innerHTML = result;
  }

  getProductButtons() {
    const productButtons = [...document.querySelectorAll(".caja--productos")];
    const modales = [...document.querySelectorAll(".modal__producto")];
    productButtons.forEach(product => {
      product.addEventListener('click', () => {
        modalDOM.classList.add('fondoTransparente');
        let tempModal;
        tempModal = modales.find(modal => modal.dataset.id === product.dataset.id);
        tempModal.classList.add('showModal');
      })
    })
    const closeModalBtns = [...document.querySelectorAll('.cerrar-modal')];
    closeModalBtns.forEach(button => {
      button.addEventListener('click', () => {
        modalDOM.classList.remove('fondoTransparente');
        modales.forEach(modal => {
          modal.classList.remove('showModal');
        })
      })
    })
  }
}
//local storage
class Storage {
  static saveProducts(products){
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem('cart',JSON.stringify(cart));
  }
  static getCart(){
    return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  //setup app
  ui.setupAPP();
  //get all products
  products.getProducts().then(products => {
    ui.displayProducts(products);
    ui.displayModales(products);
    Storage.saveProducts(products);
  }).then(() => {
    ui.getCartButtons();
    ui.getProductButtons();
    ui.cartLogic();
  });
});
