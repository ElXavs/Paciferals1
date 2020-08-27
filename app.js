//variables//

const cartBtn = document.querySelector('.carrito-logo');
const addCartBtn = document.querySelector('.addCart');
const mousesDOM = document.querySelector('.mouse-products');
const keyboardsDOM = document.querySelector('.keyboard-products');
const modalesDOM = document.querySelector('.modal');
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
        return {type,brand,title,price,id,image}
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
        <!-- single product start -->
        <div class="caja--productos caja-${product.id}" data-id=${product.id}>
          <div class="caja__imagen"><img class="product-img" src=${product.image} /></div>
          <div class="caja--productos__contenido">
            <h3>${product.title}</h3>
          </div>
        </div>
        <!-- single product end -->
        `;
        mousesDOM.innerHTML = resultm;
      } else {
        resultk += `
        <!-- single product start -->
        <div class="caja--productos caja-${product.id}" data-id=${product.id}>
          <div class="caja__imagen"><img src=${product.image} /></div>
          <div class="caja--productos__contenido">
            <h3>${product.title}</h3>
          </div>
        </div>
        <!-- single product end -->
        `;
        keyboardsDOM.innerHTML = resultk;
      }
    });
  }
  displayModales(products) {
    let result = '';
    products.forEach(product => {
      result += `
      <div class="modal__producto modal-${product.id} modald-${product.id}" id="modal-${product.id}">
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
    modalesDOM.innerHTML = result;
  }
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
    })
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
          <div><i class="fas fa-chevron-up" data-id=${item.id}></i>
          <p class="item-amount">${item.amount}</p>
          <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>
      </div>
    `;
    cartContent.appendChild(div);
    console.log(cartContent);
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
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  //get all products
  products.getProducts().then(products => {
    ui.displayProducts(products);
    ui.displayModales(products);
    Storage.saveProducts(products);
  }).then(() => {
    ui.getCartButtons();
  });
});

// cajaZowie1.addEventListener('click', () => {
//   modalZowie1.classList.remove('modald-1');
// });

//variables de pagina principal
const cajaZowie1 = document.querySelector('caja-1');
const cajaZowie2 = document.querySelector('caja-2');
const cajaGlorious1 = document.querySelector('caja-3');
const cajaGlorious2 = document.querySelector('caja-4');
const cajaDucky1 = document.querySelector('caja-5');
const cajaDucky2 = document.querySelector('caja-6');
const cajaHk1 = document.querySelector('caja-7');
const cajaHk2 = document.querySelector('caja-8');

//variables modal
const modalZowie1 = document.querySelector('modal-1');
const modalZowie2 = document.querySelector('modal-2');
const modalGlorious1 = document.querySelector('modal-3');
const modalGlorious2 = document.querySelector('modal-4');
const modalDucky1 = document.querySelector('modal-5');
const modalDucky2 = document.querySelector('modal-6');
const modalHk1 = document.querySelector('modal-7');
const modalHk2 = document.querySelector('modal-8');