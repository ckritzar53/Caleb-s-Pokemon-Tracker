document.addEventListener('DOMContentLoaded', () => {

    // --- Side Menu Button Click Simulation ---
    const menuButtons = document.querySelectorAll('.side-menu button');

    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' class from all buttons
            menuButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add 'active' class to the clicked button
            button.classList.add('active');

            // Log the action to the console for simulation purposes
            const action = button.dataset.action;
            console.log(`Action: ${action} button clicked.`);
            alert(`Mapsd to: ${action.toUpperCase()}`);
        });
    });


    // --- Login Form Submission Simulation ---
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (event) => {
        // Prevent the form from actually submitting and reloading the page
        event.preventDefault();

        const userId = document.getElementById('user-id').value;
        const password = document.getElementById('password').value;

        // Simple validation check
        if (!userId || !password) {
            alert('Please enter both User ID and Password.');
            return;
        }

        // Simulate a successful login attempt
        console.log(`Login attempt with User ID: ${userId} and Password: ${password}`);
        alert(`Simulating login for User: ${userId}`);

        // Here you would typically send data to a server for authentication.
        // For this simulation, we'll just clear the form.
        loginForm.reset();
    });

});
