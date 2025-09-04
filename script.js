document.addEventListener('DOMContentLoaded', () => {

    const menuButtons = document.querySelectorAll('.side-menu button');

    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' class from all buttons
            menuButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add 'active' class to the clicked button
            button.classList.add('active');

            // Log the action to the console for simulation purposes.
            // In a real app, this would trigger a view change.
            const action = button.dataset.action;
            console.log(`Action: Navigated to ${action.toUpperCase()} screen.`);
        });
    });

});
