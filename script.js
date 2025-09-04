document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS ---
    const allElements = {
        currentTimeEl: document.getElementById('current-time'), pickupTimeEl: document.getElementById('pickup-time'), deliveryTimeEl: document.getElementById('delivery-time'),
        categoryNav: document.getElementById('category-nav'), menuItemsContainer: document.getElementById('menu-items'),
        orderItemsContainer: document.getElementById('order-items'), subtotalEl: document.getElementById('order-subtotal'), taxEl: document.getElementById('order-tax'), totalEl: document.getElementById('order-total'), deliveryFeeEl: document.getElementById('order-delivery-fee'), sendOrderBtn: document.getElementById('send-order-btn'),
        carryoutBtn: document.getElementById('carryout-btn'), deliveryBtn: document.getElementById('delivery-btn'),
        deliveryZoneSection: document.getElementById('delivery-zone-section'), deliveryZoneButtonsContainer: document.getElementById('delivery-zone-buttons'),
        pizzaModal: document.getElementById('pizza-modal'), toppingsGrid: document.getElementById('toppings-grid'), modalPizzaName: document.getElementById('modal-pizza-name'),
        sauceModal: document.getElementById('sauce-modal'), modalSauceItemName: document.getElementById('modal-sauce-item-name'), sauceOptionsContainer: document.getElementById('sauce-options'),
        customerLookupOverlay: document.getElementById('customer-lookup-overlay'), phoneLookupInput: document.getElementById('phone-lookup-input'), phoneLookupBtn: document.getElementById('phone-lookup-btn'),
        customerInfoModal: document.getElementById('customer-info-modal'), customerModalTitle: document.getElementById('customer-modal-title'), customerForm: document.getElementById('customer-form'),
        lastOrderSection: document.getElementById('last-order-section'), lastOrderItemsContainer: document.getElementById('last-order-items'),
        recallSelectedBtn: document.getElementById('recall-selected-btn'), startNewOrderBtn: document.getElementById('start-new-order-btn'),
        customerHeader: document.getElementById('customer-header'), customerHeaderName: document.getElementById('customer-header-name'), customerHeaderPhone: document.getElementById('customer-header-phone'),
        changeCustomerBtn: document.getElementById('change-customer-btn'),
        addPizzaBtn: document.getElementById('add-pizza-btn'), cancelPizzaBtn: document.getElementById('cancel-pizza-btn')
    };

    // --- STATE ---
    let currentOrder = [], activeCategory = 'Specialty Pizzas', pizzaToCustomize = null, itemToSauce = null, deliveryFee = 0, currentCustomer = null;
    const TAX_RATE = 0.07;

    // --- MOCK DATABASE ---
    const customers = {
        '4195551234': { phone: '4195551234', firstName: 'John', lastName: 'Doe', address: { street: '123 Main St', apt: '5', city: 'Bowling Green', zip: '43402' },
            orderHistory: [[ { name: '8 Corner Pizza®', price: 17.99, type: 'pizza', toppings: { Pepperoni: 'whole' } }, { name: 'Jet Bread®', price: 7.99, type: 'side', requiresSauce: true, sauce: 'Ranch' } ]]
        }
    };
    
    const menuData = {
        'Specialty Pizzas': {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M5.5 11.5L8.5 14.5L12.5 10.5L15.5 13.5L18.5 10.5"/></svg>`,
            items: [ { name: 'All Meaty®', price: 21.99, type: 'pizza' }, { name: 'Jet 10®', price: 21.99, type: 'pizza' }, { name: 'Aloha BBQ Chicken', price: 19.99, type: 'pizza' }, { name: '8 Corner Pizza®', price: 17.99, type: 'pizza' } ],
        },
        'Deep Dish Bread': {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
            items: [ { name: 'Jet Bread®', price: 7.99, type: 'side', requiresSauce: true }, { name: 'Deep Dish Bread', price: 6.99, type: 'side', requiresSauce: true }, { name: 'Triple Cheesy Bread', price: 9.99, type: 'side', requiresSauce: true } ],
        },
        'Wings & Chicken': {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,
            items: [ { name: 'Boneless Chicken (10)', price: 11.99, type: 'side' }, { name: 'Jet\'s Wings® (8)', price: 10.99, type: 'side' } ],
        },
        'Beverages': {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v10m-5-5h10"/><path d="m12 12-3.5 9h7L12 12z"/></svg>`,
            items: [ { name: '2L Soda', price: 3.29, type: 'drink' }, { name: 'Water Bottle', price: 1.99, type: 'drink' } ],
        }
    };
    const toppingsData = ['Pepperoni', 'Mushrooms', 'Onions', 'Sausage', 'Bacon', 'Green Peppers', 'Black Olives', 'Pineapple', 'Jalapeños', 'Ham', 'Chicken', 'Extra Cheese'];
    const sauceData = ['Pizza Sauce', 'Ranch', 'Garlic Butter', 'Blue Cheese'];
    const deliveryZones = [ { name: 'Zone A', fee: 2.50 }, { name: 'Zone B', fee: 3.75 }, { name: 'Zone C', fee: 5.00 } ];

    // --- RENDER FUNCTIONS ---
    const render = (el, content) => el.innerHTML = content;
    const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
    
    function renderCategories() { allElements.categoryNav.innerHTML = Object.keys(menuData).map(cat => `<button class="category-btn ${cat === activeCategory ? 'active' : ''}" data-category="${cat}">${menuData[cat].icon}<span>${cat}</span></button>`).join(''); }
    function renderMenuItems() { allElements.menuItemsContainer.innerHTML = menuData[activeCategory].items.map(item => `<button class="menu-item-btn" data-name="${item.name}"><p class="font-semibold text-white">${item.name}</p><p class="text-sm text-slate-400">${formatCurrency(item.price)}</p></button>`).join(''); allElements.menuItemsContainer.querySelectorAll('.menu-item-btn').forEach(btn => btn.disabled = !currentCustomer); }
    function renderDeliveryZones() { allElements.deliveryZoneButtonsContainer.innerHTML = deliveryZones.map(zone => `<button class="delivery-zone-btn" data-fee="${zone.fee}">${zone.name}</button>`).join(''); }

    function renderOrder() {
        if (currentOrder.length === 0) {
            render(allElements.orderItemsContainer, '<p class="text-slate-500 text-center py-8">Select items to start an order</p>');
        } else {
            allElements.orderItemsContainer.innerHTML = currentOrder.map((item, index) => {
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
        render(allElements.subtotalEl, formatCurrency(subtotal));
        render(allElements.taxEl, formatCurrency(tax));
        render(allElements.deliveryFeeEl, formatCurrency(deliveryFee));
        render(allElements.totalEl, formatCurrency(total));
        render(allElements.sendOrderBtn, `PAY ${formatCurrency(total)}`);
    }
    
    // --- CUSTOMER WORKFLOW ---
    function showCustomerLookup() { allElements.customerLookupOverlay.classList.remove('hidden'); allElements.phoneLookupInput.focus(); }
    function hideCustomerLookup() { allElements.customerLookupOverlay.classList.add('hidden'); }
    
    function handlePhoneLookup() {
        const phone = allElements.phoneLookupInput.value.replace(/\D/g, '');
        if (phone.length !== 10) { alert('Please enter a 10-digit phone number.'); return; }
        currentCustomer = customers[phone] ? { ...customers[phone], phone } : { phone, isNew: true };
        hideCustomerLookup();
        openCustomerInfoModal();
    }
    
    function openCustomerInfoModal() {
        if (currentCustomer.isNew) {
            render(allElements.customerModalTitle, 'Create New Customer');
            allElements.customerForm.reset();
            allElements.lastOrderSection.classList.add('hidden');
        } else {
            render(allElements.customerModalTitle, `Welcome Back, ${currentCustomer.firstName}!`);
            allElements.lastOrderSection.classList.remove('hidden');
            document.getElementById('cust-first-name').value = currentCustomer.firstName;
            document.getElementById('cust-last-name').value = currentCustomer.lastName;
            document.getElementById('cust-street').value = currentCustomer.address.street;
            document.getElementById('cust-apt').value = currentCustomer.address.apt || '';
            document.getElementById('cust-city').value = currentCustomer.address.city;
            document.getElementById('cust-zip').value = currentCustomer.address.zip;
            renderLastOrder();
        }
        allElements.customerInfoModal.classList.remove('hidden');
    }

    function renderLastOrder() {
        const lastOrder = currentCustomer.orderHistory?.[0];
        if (!lastOrder) {
            render(allElements.lastOrderItemsContainer, '<p class="text-slate-500 text-center py-8">No previous order found.</p>'); return;
        }
        allElements.lastOrderItemsContainer.innerHTML = lastOrder.map((item, index) => `<label class="recall-item"><input type="checkbox" class="recall-checkbox" data-index="${index}"><span>${item.name} <span class="text-slate-400 text-xs">(${formatCurrency(item.price)})</span></span></label>`).join('');
    }

    function handleSaveCustomer(e) { e.preventDefault(); const newCustomerData = { phone: currentCustomer.phone, firstName: document.getElementById('cust-first-name').value, lastName: document.getElementById('cust-last-name').value, address: { street: document.getElementById('cust-street').value, apt: document.getElementById('cust-apt').value, city: document.getElementById('cust-city').value, zip: document.getElementById('cust-zip').value, }, orderHistory: currentCustomer.orderHistory || [] }; customers[currentCustomer.phone] = newCustomerData; currentCustomer = newCustomerData; startOrderForCustomer(); }
    function handleRecallSelected() { const lastOrder = currentCustomer.orderHistory[0]; const selectedItems = Array.from(allElements.lastOrderItemsContainer.querySelectorAll('.recall-checkbox:checked')).map(checkbox => JSON.parse(JSON.stringify(lastOrder[checkbox.dataset.index]))); currentOrder = [...selectedItems]; startOrderForCustomer(); }

    function startOrderForCustomer() {
        allElements.customerInfoModal.classList.add('hidden');
        render(allElements.customerHeaderName, `${currentCustomer.firstName} ${currentCustomer.lastName}`);
        render(allElements.customerHeaderPhone, `(${currentCustomer.phone.slice(0,3)}) ${currentCustomer.phone.slice(3,6)}-${currentCustomer.phone.slice(6)}`);
        allElements.customerHeader.classList.remove('hidden');
        allElements.sendOrderBtn.disabled = false;
        renderMenuItems();
        renderOrder();
    }
    
    // --- MODALS (PIZZA/SAUCE) ---
    function openPizzaModal() { render(allElements.modalPizzaName, `Customize ${pizzaToCustomize.name}`); allElements.toppingsGrid.innerHTML = toppingsData.map(t => `<div class="bg-slate-700/50 rounded-md p-2 flex flex-col items-center"><p class="font-semibold text-center mb-2">${t}</p><div class="grid grid-cols-3 gap-1 w-full text-xs"><button class="topping-option-btn rounded-l-md py-1.5" data-topping="${t}" data-placement="left">Left</button><button class="topping-option-btn py-1.5" data-topping="${t}" data-placement="whole">Whole</button><button class="topping-option-btn rounded-r-md py-1.5" data-topping="${t}" data-placement="right">Right</button></div><button class="w-full mt-1.5 py-1.5 text-xs bg-slate-600 rounded-md topping-option-btn extra" data-topping="${t}" data-placement="extra">Extra</button></div>`).join(''); allElements.pizzaModal.classList.remove('hidden'); }
    function closePizzaModal() { pizzaToCustomize = null; allElements.pizzaModal.classList.add('hidden'); }
    function openSauceModal() { render(allElements.modalSauceItemName, `Choose Sauce for ${itemToSauce.name}`); allElements.sauceOptionsContainer.innerHTML = sauceData.map(sauce => `<button class="sauce-option-btn w-full" data-sauce="${sauce}">${sauce}</button>`).join(''); allElements.sauceModal.classList.remove('hidden'); }
    function closeSauceModal() { itemToSauce = null; allElements.sauceModal.classList.add('hidden'); }

    // --- EVENT LISTENERS & HANDLERS ---
    function setupEventListeners() {
        allElements.phoneLookupBtn.onclick = handlePhoneLookup;
        allElements.customerForm.onsubmit = handleSaveCustomer;
        allElements.recallSelectedBtn.onclick = handleRecallSelected;
        allElements.startNewOrderBtn.onclick = startOrderForCustomer;
        allElements.changeCustomerBtn.onclick = () => { currentOrder = []; currentCustomer = null; deliveryFee = 0; renderOrder(); allElements.customerHeader.classList.add('hidden'); allElements.sendOrderBtn.disabled = true; renderMenuItems(); showCustomerLookup(); };

        allElements.categoryNav.addEventListener('click', (e) => { const btn = e.target.closest('.category-btn'); if(btn) { activeCategory = btn.dataset.category; renderCategories(); renderMenuItems(); } });
        allElements.menuItemsContainer.addEventListener('click', (e) => { const btn = e.target.closest('.menu-item-btn'); if(btn) { const item = menuData[activeCategory].items.find(i => i.name === btn.dataset.name); if(item.type === 'pizza') { pizzaToCustomize = { ...item, id: Date.now(), toppings: {} }; openPizzaModal(); } else if (item.requiresSauce) { itemToSauce = { ...item, id: Date.now() }; openSauceModal(); } else { currentOrder.push({ ...item, id: Date.now() }); renderOrder(); } } });
        allElements.toppingsGrid.addEventListener('click', (e) => { const btn = e.target; if (btn.classList.contains('topping-option-btn')) { const { topping, placement } = btn.dataset; const toppingOptions = allElements.toppingsGrid.querySelectorAll(`[data-topping="${topping}"]`); const current = pizzaToCustomize.toppings[topping]; toppingOptions.forEach(b => b.classList.remove('active')); if (current !== placement) { btn.classList.add('active'); pizzaToCustomize.toppings[topping] = placement; } else { delete pizzaToCustomize.toppings[topping]; } } });
        allElements.sauceOptionsContainer.addEventListener('click', (e) => { const btn = e.target; if (btn.classList.contains('sauce-option-btn')) { itemToSauce.sauce = btn.dataset.sauce; currentOrder.push(itemToSauce); renderOrder(); closeSauceModal(); } });
        allElements.deliveryZoneButtonsContainer.addEventListener('click', (e) => { const btn = e.target; if(btn.classList.contains('delivery-zone-btn')) { allElements.deliveryZoneButtonsContainer.querySelectorAll('.delivery-zone-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); deliveryFee = parseFloat(btn.dataset.fee); calculateTotals(); } });
        
        allElements.addPizzaBtn.onclick = () => { currentOrder.push(pizzaToCustomize); renderOrder(); closePizzaModal(); };
        allElements.cancelPizzaBtn.onclick = closePizzaModal;
        
        allElements.deliveryBtn.onclick = () => { allElements.deliveryBtn.classList.add('active'); allElements.carryoutBtn.classList.remove('active'); allElements.deliveryZoneSection.classList.remove('hidden'); };
        allElements.carryoutBtn.onclick = () => { allElements.carryoutBtn.classList.add('active'); allElements.deliveryBtn.classList.remove('active'); allElements.deliveryZoneSection.classList.add('hidden'); allElements.deliveryZoneButtonsContainer.querySelectorAll('.delivery-zone-btn').forEach(b => b.classList.remove('active')); deliveryFee = 0; calculateTotals(); };
    }

    // --- GLOBAL API & INITIALIZATION ---
    window.pos = { removeItem: (index) => { currentOrder.splice(index, 1); renderOrder(); } };
    function init() {
        const updateClocks = () => {
            const now = new Date();
            const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            allElements.currentTimeEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            allElements.pickupTimeEl.textContent = formatTime(new Date(now.getTime() + 20 * 60000));
            allElements.deliveryTimeEl.textContent = formatTime(new Date(now.getTime() + 45 * 60000));
        };
        updateClocks(); setInterval(updateClocks, 1000);
        renderCategories(); renderMenuItems(); renderDeliveryZones(); renderOrder();
        setupEventListeners();
        showCustomerLookup();
    }
    init();
});

