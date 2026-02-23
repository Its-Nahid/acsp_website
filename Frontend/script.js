document.addEventListener('DOMContentLoaded', () => {
    console.log('ACSP Authentication System Loaded');
    
//login form handling
const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            // This prevents the page from reloading!
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch("http://localhost:5000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Store the JWT token your backend sends back
                    localStorage.setItem('token', data.token);
                    
                    alert("Login successful!");
                    // Redirect to home page
                    window.location.href = 'index.html'; 
                } else {
                    // Shows "User not found" or "Invalid password" from backend
                    alert(data.message);
                }
            } catch (error) {
                console.error("Login Error:", error);
                alert("Connection error. Ensure your backend server is running.");
            }
        });
    }
//signup form handling
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("signupName").value;
        const email = document.getElementById("signupEmail").value;
        const password = document.getElementById("signupPassword").value;
        const role = document.querySelector('input[name="role"]:checked')?.value || "general";

        try {
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                window.location.href = "login.html";
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Server error");
        }
    });
}


    const recoverForm = document.querySelector('form[action="recover"]');
    if (recoverForm) {
        recoverForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = recoverForm.querySelector('input[type="email"]').value;
            alert(`Recovery link sent to ${email}`);
        });
    }
});