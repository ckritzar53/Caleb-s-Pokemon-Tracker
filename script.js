document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS ---
    const currentTimeEl = document.getElementById('current-time'), pickupTimeEl = document.getElementById('pickup-time'), deliveryTimeEl = document.getElementById('delivery-time');
    const categoryNav = document.getElementById('category-nav'), menuItemsContainer = document.getElementById('menu-items');
    const orderItemsContainer = document.getElementById('order-items'), subtotalEl = document.getElementById('order-subtotal'), taxEl = document.getElementById('order-tax'), totalEl = document.getElementById('order-total'), deliveryFeeEl = document.getElementById('order-delivery-fee'), sendOrderBtn = document.getElementById('send-order-btn');
    const carryoutBtn = document.getElementById('carryout-btn'), deliveryBtn = document.getElementById('delivery-btn');
    const deliveryZoneSection = document.getElementById('delivery-zone-section'), deliveryZoneButtonsContainer = document.getElementById('delivery-zone-buttons');
    const pizzaModal = document.getElementById('pizza-modal'), toppingsGrid = document.getElementById('toppings-grid'), modalPizzaName = document.getElementById('modal-pizza-name');
    const sauceModal = document.getElementById('sauce-modal'), modalSauceItemName = document.getElementById('modal-sauce-item-name'), sauceOptionsContainer = document.getElementById('sauce-options');

    // --- STATE ---
    let currentOrder = [], activeCategory = 'Specialty Pizzas', pizzaToCustomize = null, itemToSauce = null, deliveryFee = 0;
    const TAX_RATE = 0.07;

    // --- DATA ---
    const menuData = {
        'Specialty Pizzas': [ { name: 'All Meaty®', price: 21.99, type: 'pizza' }, { name: 'Jet 10®', price: 21.99, type: 'pizza' }, { name: 'Aloha BBQ Chicken', price: 19.99, type: 'pizza' }, { name: '8 Corner Pizza®', price: 17.99, type: 'pizza' } ],
        'Deep Dish Bread': [ { name: 'Jet Bread®', price: 7.99, type: 'side', requiresSauce: true }, { name: 'Deep Dish Bread', price: 6.99, type: 'side', requiresSauce: true }, { name: 'Triple Cheesy Bread', price: 9.99, type: 'side', requiresSauce: true } ],
        'Wings & Chicken': [ { name: 'Boneless Chicken (10)', price: 11.99, type: 'side' }, { name: 'Jet\'s Wings® (8)', price: 10.99, type: 'side' } ],
        'Sides & Desserts': [ { name: 'Side Salad', price: 5.49, type: 'side' }, { name: 'Cinnamon Stix', price: 6.99, type: 'dessert' } ],
        'Beverages': [ { name: '2L Soda', price: 3.29, type: 'drink' }, { name: 'Water Bottle', price: 1.99, type: 'drink' } ],
    };
    const toppingsData = ['Pepperoni', 'Mushrooms', 'Onions', 'Sausage', 'Bacon', 'Green Peppers', 'Black Olives', 'Pineapple', 'Jalapeños', 'Ham', 'Chicken', 'Extra Cheese'];
    const sauceData = ['Pizza Sauce', 'Ranch', 'Garlic Butter', 'Blue Cheese'];
    const deliveryZones = [ { name: 'Zone A', fee: 2.50 }, { name: 'Zone B', fee: 3.75 }, { name: 'Zone C', fee: 5.00 } ];

    // --- RENDER FUNCTIONS ---
    function renderAll() { renderCategories(); renderMenuItems(); renderOrder(); renderDeliveryZones(); }
    const render = (el, content) => { el.innerHTML = content; };
    const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
    
    function renderCategories() { categoryNav.innerHTML = Object.keys(menuData).map(cat => `<button class="category-btn ${cat === activeCategory ? 'active' : ''}">${cat}</button>`).join(''); }
    function renderMenuItems() { menuItemsContainer.innerHTML = menuData[activeCategory].map(item => `<button class="menu-item-btn" data-name="${item.name}"><p class="font-semibold text-white">${item.name}</p><p class="text-sm text-slate-400">${formatCurrency(item.price)}</p></button>`).join(''); }
    function renderDeliveryZones() { deliveryZoneButtonsContainer.innerHTML = deliveryZones.map(zone => `<button class="delivery-zone-btn" data-fee="${zone.fee}">${zone.name}</button>`).join(''); }

    function renderOrder() {
        if (currentOrder.length === 0) {
            render(orderItemsContainer, '<p class="text-slate-500 text-center py-8">Select items to start an order</p>');
        } else {
            orderItemsContainer.innerHTML = currentOrder.map((item, index) => {
                let details = '';
                if (item.sauce) details += `<li class="text-cyan-400">Sauce: ${item.sauce}</li>`;
                if (item.toppings) Object.entries(item.toppings).forEach(([topping, placement]) => { details += `<li>${placement.replace('_', ' ')} ${topping}</li>`; });
                return `<div class="py-2 px-1 text-sm"><div class="flex justify-between items-center"><span class="font-semibold">${item.name}</span><div class="flex items-center"><span class="font-medium mr-3">${formatCurrency(item.price)}</span><button class="text-red-500 hover:text-red-400 font-bold" onclick="window.pos.removeItem(${index})">&times;</button></div></div>${details ? `<ul class="pl-3 text-xs text-slate-400">${details}</ul>` : ''}</div>`;
            }).join('');
        }
        calculateTotals();
    }
    
    function calculateTotals() {
        const subtotal = currentOrder.reduce((acc, item) => acc + item.price, 0);
        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax + deliveryFee;
        render(subtotalEl, formatCurrency(subtotal));
        render(taxEl, formatCurrency(tax));
        render(deliveryFeeEl, formatCurrency(deliveryFee));
        render(totalEl, formatCurrency(total));
        render(sendOrderBtn, `PAY ${formatCurrency(total)}`);
    }

    // --- MODAL LOGIC ---
    function openPizzaModal() { render(modalPizzaName, `Customize ${pizzaToCustomize.name}`); toppingsGrid.innerHTML = toppingsData.map(t => `<div class="bg-slate-700 rounded-md p-2 flex flex-col items-center"><p class="font-semibold text-center mb-2">${t}</p><div class="grid grid-cols-3 gap-1 w-full text-xs"><button class="topping-option-btn rounded-l-md py-1.5" data-topping="${t}" data-placement="left">Left</button><button class="topping-option-btn py-1.5" data-topping="${t}" data-placement="whole">Whole</button><button class="topping-option-btn rounded-r-md py-1.5" data-topping="${t}" data-placement="right">Right</button></div><button class="w-full mt-1.5 py-1.5 text-xs bg-slate-600 rounded-md topping-option-btn extra" data-topping="${t}" data-placement="extra">Extra</button></div>`).join(''); pizzaModal.classList.remove('hidden'); }
    function closePizzaModal() { pizzaToCustomize = null; pizzaModal.classList.add('hidden'); }
    function openSauceModal() { render(modalSauceItemName, `Choose Sauce for ${itemToSauce.name}`); sauceOptionsContainer.innerHTML = sauceData.map(sauce => `<button class="sauce-option-btn w-full" data-sauce="${sauce}">${sauce}</button>`).join(''); sauceModal.classList.remove('hidden'); }
    function closeSauceModal() { itemToSauce = null; sauceModal.classList.add('hidden'); }

    // --- EVENT LISTENERS & HANDLERS ---
    function handleCategoryClick(e) { if(e.target.classList.contains('category-btn')) { activeCategory = e.target.textContent; renderCategories(); renderMenuItems(); } }
    function handleMenuClick(e) { const btn = e.target.closest('.menu-item-btn'); if(btn) { const itemName = btn.dataset.name; const item = menuData[activeCategory].find(i => i.name === itemName); if(item.type === 'pizza') { pizzaToCustomize = { ...item, id: Date.now(), toppings: {} }; openPizzaModal(); } else if (item.requiresSauce) { itemToSauce = { ...item, id: Date.now() }; openSauceModal(); } else { currentOrder.push({ ...item, id: Date.now() }); renderOrder(); } } }
    function handleToppingSelection(e) { const btn = e.target; if (btn.classList.contains('topping-option-btn')) { const { topping, placement } = btn.dataset; const currentToppingOptions = toppingsGrid.querySelectorAll(`[data-topping="${topping}"]`); const currentPlacement = pizzaToCustomize.toppings[topping]; currentToppingOptions.forEach(b => b.classList.remove('active')); if (currentPlacement === placement) delete pizzaToCustomize.toppings[topping]; else { btn.classList.add('active'); pizzaToCustomize.toppings[topping] = placement; } } }
    function handleSauceSelection(e) { const btn = e.target; if (btn.classList.contains('sauce-option-btn')) { itemToSauce.sauce = btn.dataset.sauce; currentOrder.push(itemToSauce); renderOrder(); closeSauceModal(); } }
    function handleDeliveryZoneClick(e) { const btn = e.target; if(btn.classList.contains('delivery-zone-btn')) { deliveryZoneButtonsContainer.querySelectorAll('.delivery-zone-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); deliveryFee = parseFloat(btn.dataset.fee); calculateTotals(); } }
    
    function setupEventListeners() {
        categoryNav.addEventListener('click', handleCategoryClick);
        menuItemsContainer.addEventListener('click', handleMenuClick);
        toppingsGrid.addEventListener('click', handleToppingSelection);
        sauceOptionsContainer.addEventListener('click', handleSauceSelection);
        deliveryZoneButtonsContainer.addEventListener('click', handleDeliveryZoneClick);
        
        document.getElementById('add-pizza-btn').onclick = () => { currentOrder.push(pizzaToCustomize); renderOrder(); closePizzaModal(); };
        document.getElementById('cancel-pizza-btn').onclick = closePizzaModal;
        
        deliveryBtn.onclick = () => { deliveryBtn.classList.add('active'); carryoutBtn.classList.remove('active'); deliveryZoneSection.classList.remove('hidden'); };
        carryoutBtn.onclick = () => { carryoutBtn.classList.add('active'); deliveryBtn.classList.remove('active'); deliveryZoneSection.classList.add('hidden'); deliveryZoneButtonsContainer.querySelectorAll('.delivery-zone-btn').forEach(b => b.classList.remove('active')); deliveryFee = 0; calculateTotals(); };
    }

    // --- GLOBAL API & INITIALIZATION ---
    window.pos = { removeItem: (index) => { currentOrder.splice(index, 1); renderOrder(); } };
    function init() {
        const updateClocks = () => {
            const now = new Date();
            const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            currentTimeEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            pickupTimeEl.textContent = formatTime(new Date(now.getTime() + 20 * 60000));
            deliveryTimeEl.textContent = formatTime(new Date(now.getTime() + 45 * 60000));
        };
        updateClocks();
        setInterval(updateClocks, 1000);
        renderAll();
        setupEventListeners();
    }
    init();
});

