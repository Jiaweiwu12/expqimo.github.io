
// 菜单数据
const menuData = {
    burgers: [
        { id: 1, name: '招牌经典汉堡', price: 12, image: 'imgs/re0.png', rating: 4.5, description: '新鲜牛肉饼搭配特制酱料，经典美味' },
        { id: 2, name: '芝士汉堡', price: 14, image: 'imgs/re1.png', rating: 4.2, description: '浓郁芝士融化在牛肉饼上，口感丰富' },
        { id: 3, name: '双层牛肉汉堡', price: 17, image: 'imgs/re2.png', rating: 4.8, description: '双层牛肉饼，满足大胃王' }
    ],
    snacks: [
        { id: 4, name: '薯条', price: 7, image: 'imgs/re3.png', rating: 4.0, description: '金黄酥脆的薯条，完美搭配' },
        { id: 5, name: '洋葱圈', price: 6, image: 'imgs/re4.png', rating: 3.8, description: '香脆洋葱圈，外酥里嫩' },
        { id: 6, name: '烤鸡翅', price: 9, image: 'imgs/re5.png', rating: 4.3, description: '香辣烤鸡翅，美味下酒菜' }
    ],
    drinks: [
        { id: 7, name: '可乐', price: 4, image: 'imgs/re6.png', rating: 4.1, description: '经典可乐，清爽解渴' },
        { id: 8, name: '橙汁', price: 6, image: 'imgs/re7.png', rating: 4.4, description: '新鲜橙汁，富含维生素C' },
        { id: 9, name: '奶茶', price: 7, image: 'imgs/re8.png', rating: 4.6, description: '香浓奶茶，温暖人心' }
    ]
};

// 购物车数据
let cart = [];
const deliveryFee = 2;

// DOM元素
const menuGrid = document.getElementById('menu-grid');
const tabButtons = document.querySelectorAll('.tab-button');
const cartDrawer = document.getElementById('cart-drawer');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutSection = document.getElementById('checkout-section');
const confirmCheckoutBtn = document.getElementById('confirm-checkout-btn');
const confirmationModal = document.getElementById('confirmation-modal');
const countdownEl = document.getElementById('countdown');
const confirmOrderBtn = document.getElementById('confirm-order');
const cancelOrderBtn = document.getElementById('cancel-order');
const overlay = document.getElementById('overlay');

// 轮播相关
const slides = document.querySelectorAll('.slide');
const prevSlideBtn = document.querySelector('.prev-slide');
const nextSlideBtn = document.querySelector('.next-slide');
let currentSlide = 0;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadMenu('all');
    updateCartDisplay();
    showSlide(currentSlide);
    startAutoSlide();
});

// 轮播功能
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

function startAutoSlide() {
    setInterval(nextSlide, 5000); // 每5秒自动切换
}

prevSlideBtn.addEventListener('click', prevSlide);
nextSlideBtn.addEventListener('click', nextSlide);

// 菜单切换
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const category = button.dataset.category;
        loadMenu(category);
    });
});

// 加载菜单
function loadMenu(category) {
    menuGrid.innerHTML = '';
    let itemsToShow = [];
    
    if (category === 'all') {
        itemsToShow = Object.values(menuData).flat();
    } else {
        itemsToShow = menuData[category] || [];
    }
    
    itemsToShow.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card card-hover bg-white rounded-xl shadow overflow-hidden';
        card.innerHTML = `
            <div class="relative">
                <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
                <span class="absolute top-2 right-2 bg-primary text-white text-sm px-2 py-1 rounded-full">
                    ¥${item.price.toFixed(2)}
                </span>
            </div>
            <div class="p-4">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="text-lg font-semibold">${item.name}</h3>
                </div>
                <p class="text-gray-600 text-sm mb-4">${item.description}</p>
                <button class="add-to-cart-btn btn-primary w-full" data-id="${item.id}">
                    <i class="fa fa-plus mr-1"></i> 加入购物车
                </button>
            </div>
        `;
        menuGrid.appendChild(card);
    });

    // 添加事件监听器，当用户点击“加入购物车”按钮时，触发addToCart函数，将对应的菜单项添加到购物车中。
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
}

// 添加到购物车
function addToCart(e) {
    const itemId = parseInt(e.target.dataset.id || e.target.parentElement.dataset.id);
    const allItems = Object.values(menuData).flat();
    const item = allItems.find(item => item.id === itemId);
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);  // 在购物车数组中查找是否已有该商品
    if (existingItem) {  // 如果购物车中已有该商品
        existingItem.quantity++;  // 增加该商品的数量
    } else {  // 如果购物车中没有该商品
        cart.push({ ...item, quantity: 1 });  // 将商品对象复制并添加 quantity 属性（初始为1），推入购物车数组
    }
    
    updateCartDisplay();  // 调用函数更新购物车显示（包括商品列表、总价等）
    
    // 显示添加成功动画
    showAddToCartAnimation(itemId);
}

// 显示添加到购物车动画
function showAddToCartAnimation(itemId) {
    const btn = document.querySelector(`.add-to-cart-btn[data-id="${itemId}"]`);
    
    if (btn) {// 如果按钮存在（防止错误）
        btn.innerHTML = '<i class="fa fa-check mr-1"></i> 已添加';
        btn.classList.add('bg-green-500');
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fa fa-plus mr-1"></i> 加入购物车';
            btn.classList.remove('bg-green-500');
        }, 1000);
    }
}

// 更新购物车显示
function updateCartDisplay() {
    cartItems.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>¥${item.price} x ${item.quantity}</p>
            </div>
            <div class="cart-item-controls">
                <button class="decrease" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase" data-id="${item.id}">+</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    const total = subtotal + deliveryFee;
    subtotalEl.textContent = subtotal.toFixed(2);
    totalEl.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // 添加数量控制事件监听器
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });
}

// 增加数量
function increaseQuantity(e) {
    const itemId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === itemId);
    item.quantity++;
    updateCartDisplay();
}

// 减少数量
function decreaseQuantity(e) {
    const itemId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === itemId);
    if (item.quantity > 1) {
        item.quantity--;
    } else {
        cart = cart.filter(item => item.id !== itemId);
    }
    updateCartDisplay();
}

// 购物车抽屉切换
cartToggle.addEventListener('click', () => {
    cartDrawer.classList.toggle('open');
    overlay.classList.toggle('show');
});

closeCart.addEventListener('click', () => {
    cartDrawer.classList.remove('open');
    overlay.classList.remove('show');
});

// 结账 ：绑定结账按钮的点击事件，用于跳转到订单确认页面
checkoutBtn.addEventListener('click', () => {  // 为 checkoutBtn 按钮添加点击事件监听器，当点击时执行箭头函数
    if (cart.length === 0) {  // 检查购物车数组是否为空
        alert('购物车为空，请先添加商品！');  // 如果为空，弹出警告提示用户
        return;  // 提前退出函数，阻止后续执行
    }
    
    cartDrawer.classList.remove('open');  // 移除 cartDrawer 的 'open' 类，关闭购物车抽屉
    overlay.classList.remove('show');  // 移除 overlay 的 'show' 类，隐藏背景遮罩
    checkoutSection.style.display = 'block';  // 将 checkoutSection 元素的 display 属性设置为 'block'，显示订单确认区域
    checkoutSection.scrollIntoView({ behavior: 'smooth' });  // 平滑滚动页面，使 checkoutSection 进入视口
});

// 确认结账
confirmCheckoutBtn.addEventListener('click', () => {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('delivery-address').value;
    
    if (!name.trim() || !phone.trim() || !address.trim()) {
        alert('请填写完整的收货信息！');
        return;
    }
    
    checkoutSection.style.display = 'none';
    showConfirmationModal();
});

// 显示确认模态框
function showConfirmationModal() {  // 定义函数 showConfirmationModal，用于显示订单确认模态框和倒计时逻辑
    confirmationModal.classList.add('show');  // 为 confirmationModal 元素添加 'show' 类，显示模态框
    overlay.classList.add('show');  // 为 overlay 元素添加 'show' 类，显示背景遮罩
    let countdown = 30;  // 初始化倒计时变量为30秒
    countdownEl.textContent = countdown;  // 将倒计时值设置为 countdownEl 元素的文本内容，显示初始倒计时
    
    const timer = setInterval(() => {  // 创建定时器，每1000毫秒（1秒）执行一次回调函数
        countdown--;  // 倒计时减1
        countdownEl.textContent = countdown;  // 更新 countdownEl 的文本内容，显示当前倒计时
        if (countdown <= 0) {  // 如果倒计时小于等于0
            clearInterval(timer);  // 清除定时器，停止倒计时
            confirmationModal.classList.remove('show');  // 移除 'show' 类，隐藏模态框
            overlay.classList.remove('show');  // 移除 'show' 类，隐藏背景遮罩
            alert('订单已自动取消');  // 弹出警告，通知用户订单已取消
        }
    }, 1000);  // 定时器间隔为1000毫秒
    
    confirmOrderBtn.onclick = () => {  // 为 confirmOrderBtn 按钮设置点击事件处理函数
        clearInterval(timer);  // 清除定时器，停止倒计时
        confirmationModal.classList.remove('show');  // 隐藏模态框
        overlay.classList.remove('show');  // 隐藏背景遮罩
        alert('订单已确认！');  // 弹出成功提示
        cart = [];  // 清空购物车数组
        updateCartDisplay();  // 调用函数更新购物车显示
    };
    
    cancelOrderBtn.onclick = () => {  // 为 cancelOrderBtn 按钮设置点击事件处理函数
        clearInterval(timer);  // 清除定时器，停止倒计时
        confirmationModal.classList.remove('show');  // 隐藏模态框
        overlay.classList.remove('show');  // 隐藏背景遮罩
    };
}