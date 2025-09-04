document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS ---
    const currentTimeEl = document.getElementById('current-time');
    const pickupTimeEl = document.getElementById('pickup-time');
    const deliveryTimeEl = document.getElementById('delivery-time');
    const categoryNav = document.getElementById('category-nav');
    const menuItemsContainer = document.getElementById('menu-items');
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalEl = document.getElementById('order-subtotal');
    const taxEl = document.getElementById('order-tax');
    const totalEl = document.getElementById('order-total');
    const pizzaModal = document.getElementById('pizza-modal');
    const toppingsGrid = document.getElementById('toppings-grid');
    const modalPizzaName = document.getElementById('modal-pizza-name');

    // --- STATE ---
    let currentOrder = [];
    let activeCategory = 'Pizza';
    let pizzaToCustomize = null;
    const TAX_RATE = 0.07; // 7% tax

    // --- DATA ---
    const menuData = {
        'Pizza': [
            { name: '8 Corner Pizza®', price: 17.99, type: 'pizza' },
            { name: 'Jet 10®', price: 21.99, type: 'pizza' },
            { name: 'Deep Dish', price: 15.99, type: 'pizza' },
            { name: 'NY Style', price: 14.99, type: 'pizza' },
        ],
        'Sides': [
            { name: 'Jet Bread®', price: 7.99, type: 'side' },
            { name: 'Wings (8 pc)', price: 10.99, type: 'side' },
            { name: 'Side Salad', price: 5.49, type: 'side' },
        ],
        'Desserts & Drinks': [
            { name: 'Cinnamon Stix', price: 6.99, type: 'dessert' },
            { name: '2L Soda', price: 3.29, type: 'drink' },
            { name: 'Water Bottle', price: 1.99, type: 'drink' },
        ]
    };
    const toppingsData = ['Pepperoni', 'Mushrooms', 'Onions', 'Sausage', 'Bacon', 'Green Peppers', 'Black Olives', 'Pineapple', 'Jalapeños', 'Ham', 'Chicken', 'Extra Cheese'];

    // --- TIME & QUOTES ---
    function updateTime() {
        const now = new Date();
        const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        currentTimeEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        
        const pickup = new Date(now.getTime() + 20 * 60000); // 20 mins
        const delivery = new Date(now.getTime() + 45 * 60000); // 45 mins
        pickupTimeEl.textContent = formatTime(pickup);
        deliveryTimeEl.textContent = formatTime(delivery);
    }

    // --- RENDER FUNCTIONS ---
    function renderCategories() {
        categoryNav.innerHTML = '';
        Object.keys(menuData).forEach(category => {
            const btn = document.createElement('button');
            btn.className = `category-btn ${category === activeCategory ? 'active' : ''}`;
            btn.textContent = category;
            btn.onclick = () => {
                activeCategory = category;
                renderCategories();
                renderMenuItems();
            };
            categoryNav.appendChild(btn);
        });
    }

    function renderMenuItems() {
        menuItemsContainer.innerHTML = '';
        menuData[activeCategory].forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'menu-item-btn';
            btn.innerHTML = `
                <p class="font-semibold text-white">${item.name}</p>
                <p class="text-sm text-slate-400">$${item.price.toFixed(2)}</p>
            `;
            btn.onclick = () => handleItemClick(item);
            menuItemsContainer.appendChild(btn);
        });
    }

    function renderOrder() {
        if (currentOrder.length === 0) {
            orderItemsContainer.innerHTML = '<p class="text-slate-500 text-center py-8">Select items to start an order</p>';
        } else {
            orderItemsContainer.innerHTML = '';
            currentOrder.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'py-2 px-1 text-sm';
                let details = '';
                if (item.type === 'pizza' && item.toppings) {
                    details += '<ul class="pl-3 text-xs text-slate-400">';
                    Object.entries(item.toppings).forEach(([topping, placement]) => {
                         const placementText = placement.replace('_', ' ');
                         details += `<li>${placementText.charAt(0).toUpperCase() + placementText.slice(1)} ${topping}</li>`;
                    });
                    details += '</ul>';
                }
                itemEl.innerHTML = `
                    <div class="flex justify-between items-center">
                        <span class="font-semibold">${item.name}</span>
                        <div class="flex items-center">
                            <span class="font-medium mr-3">$${item.price.toFixed(2)}</span>
                            <button class="text-red-500 hover:text-red-400 font-bold" onclick="removeItem(${index})">&times;</button>
                        </div>
                    </div>
                    ${details}
                `;
                orderItemsContainer.appendChild(itemEl);
            });
        }
        calculateTotals();
    }
    
    function calculateTotals() {
        const subtotal = currentOrder.reduce((acc, item) => acc + item.price, 0);
        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;
        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        taxEl.textContent = `$${tax.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }
    
    // --- EVENT HANDLERS & LOGIC ---
    function handleItemClick(item) {
        if (item.type === 'pizza') {
            pizzaToCustomize = { ...item, id: Date.now(), toppings: {} };
            openPizzaModal();
        } else {
            currentOrder.push({ ...item, id: Date.now() });
            renderOrder();
        }
    }

    window.removeItem = (index) => {
        currentOrder.splice(index, 1);
        renderOrder();
    }

    function openPizzaModal() {
        modalPizzaName.textContent = `Customize ${pizzaToCustomize.name}`;
        toppingsGrid.innerHTML = '';
        toppingsData.forEach(topping => {
            const toppingEl = document.createElement('div');
            toppingEl.className = 'bg-slate-700 rounded-md p-2 flex flex-col items-center';
            toppingEl.innerHTML = `
                <p class="font-semibold text-center mb-2">${topping}</p>
                <div class="grid grid-cols-3 gap-1 w-full text-xs">
                    <button class="topping-option-btn rounded-l-md py-1.5" data-topping="${topping}" data-placement="left">Left</button>
                    <button class="topping-option-btn py-1.5" data-topping="${topping}" data-placement="whole">Whole</button>
                    <button class="topping-option-btn rounded-r-md py-1.5" data-topping="${topping}" data-placement="right">Right</button>
                </div>
                <button class="w-full mt-1.5 py-1.5 text-xs bg-slate-600 rounded-md topping-option-btn extra" data-topping="${topping}" data-placement="extra">Extra</button>
            `;
            toppingsGrid.appendChild(toppingEl);
        });

        // Add event listeners to new buttons
        toppingsGrid.querySelectorAll('.topping-option-btn').forEach(btn => {
            btn.onclick = (e) => handleToppingSelection(e);
        });
        pizzaModal.classList.remove('hidden');
    }

    function handleToppingSelection(e) {
        const { topping, placement } = e.target.dataset;
        const currentToppingOptions = toppingsGrid.querySelectorAll(`[data-topping="${topping}"]`);
        
        // Deselect all options for this topping first
        currentToppingOptions.forEach(b => b.classList.remove('active'));

        // If the clicked button was already active, we are deselecting it
        const currentPlacement = pizzaToCustomize.toppings[topping];
        if (currentPlacement === placement) {
            delete pizzaToCustomize.toppings[topping];
        } else {
            // Otherwise, activate the new selection
            e.target.classList.add('active');
            pizzaToCustomize.toppings[topping] = placement;
        }
    }

    function closePizzaModal() {
        pizzaToCustomize = null;
        pizzaModal.classList.add('hidden');
    }

    document.getElementById('add-pizza-btn').onclick = () => {
        currentOrder.push(pizzaToCustomize);
        renderOrder();
        closePizzaModal();
    };

    document.getElementById('cancel-pizza-btn').onclick = closePizzaModal;


    // --- INITIALIZATION ---
    function init() {
        updateTime();
        setInterval(updateTime, 1000);
        renderCategories();
        renderMenuItems();
    }

    init();
});

