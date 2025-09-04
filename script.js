document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const screens = document.querySelectorAll('.screen');
    const currentTimeEl = document.getElementById('current-time');
    const menuItemsContainer = document.getElementById('menu-items');
    const orderItemsContainer = document.getElementById('order-items');
    const orderTotalEl = document.getElementById('order-total');

    let currentOrder = [];

    // --- Mock Data ---
    const menuData = [
        { name: '8 Corner Pizza®', price: 17.99 },
        { name: 'Jet 10®', price: 21.99 },
        { name: 'Deep Dish', price: 15.99 },
        { name: 'NY Style', price: 14.99 },
        { name: 'Jet Bread®', price: 7.99 },
        { name: 'Wings (8 pc)', price: 10.99 },
        { name: 'Side Salad', price: 5.49 },
        { name: 'Cinnamon Stix', price: 6.99 },
        { name: '2L Soda', price: 3.29 },
    ];

    // --- Clock Functionality ---
    function updateTime() {
        const now = new Date();
        const date = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        currentTimeEl.textContent = `${date} ${time}`;
    }
    updateTime();
    setInterval(updateTime, 1000);

    // --- Screen Navigation ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetScreenId = button.dataset.screen + '-screen';
            
            // Update button active state
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show target screen
            screens.forEach(screen => {
                if (screen.id === targetScreenId) {
                    screen.classList.remove('hidden');
                    screen.classList.add('active');
                } else {
                    screen.classList.add('hidden');
                    screen.classList.remove('active');
                }
            });
        });
    });
    
    // --- Menu & Order Logic ---
    function renderMenu() {
        menuItemsContainer.innerHTML = '';
        menuData.forEach(item => {
            const itemEl = document.createElement('button');
            itemEl.className = 'bg-white rounded-lg shadow p-4 text-center hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
            itemEl.innerHTML = `
                <p class="font-semibold text-gray-800">${item.name}</p>
                <p class="text-sm text-gray-600">$${item.price.toFixed(2)}</p>
            `;
            itemEl.addEventListener('click', () => addToOrder(item));
            menuItemsContainer.appendChild(itemEl);
        });
    }

    function addToOrder(item) {
        currentOrder.push(item);
        renderOrder();
    }

    function renderOrder() {
        if (currentOrder.length === 0) {
            orderItemsContainer.innerHTML = '<p class="text-gray-500 text-center mt-8">Add items from the menu.</p>';
            orderTotalEl.textContent = '$0.00';
            return;
        }

        orderItemsContainer.innerHTML = '';
        let total = 0;
        currentOrder.forEach((item, index) => {
            total += item.price;
            const orderItemEl = document.createElement('div');
            orderItemEl.className = 'flex justify-between items-center py-2 border-b';
            orderItemEl.innerHTML = `
                <div>
                    <p class="font-medium">${item.name}</p>
                </div>
                <div class="flex items-center">
                   <span class="font-semibold mr-4">$${item.price.toFixed(2)}</span>
                   <button data-index="${index}" class="remove-item text-red-500 hover:text-red-700">&times;</button>
                </div>
            `;
            orderItemsContainer.appendChild(orderItemEl);
        });

        orderTotalEl.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to new remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                currentOrder.splice(index, 1);
                renderOrder();
            });
        });
    }

    // --- Initial Setup ---
    renderMenu();
});
