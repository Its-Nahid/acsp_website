document.addEventListener('DOMContentLoaded', () => {
    console.log('ACSP Unified System Loaded');

    function showToast(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 9999;
            padding: 1rem 2rem; border-radius: 1rem; color: white;
            font-weight: bold; transition: all 0.3s ease;
            background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        `;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    const rescueForm = document.getElementById('rescueForm');
    if (rescueForm) {
        rescueForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const btn = e.submitter || rescueForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            // 1. COLLECT DATA FOR MODAL
            const name = document.getElementById('fullName').value;
            const phone = document.getElementById('phone').value;
            const summary = document.getElementById('caseSummary').value;
            const loc = document.getElementById('location').value;

            // 2. PREPARE PREVIEW FOR MODAL
            document.getElementById('previewName').innerText = name;
            document.getElementById('previewPhone').innerText = phone;
            document.getElementById('previewSummary').innerText = summary;
            document.getElementById('previewLocation').innerText = loc;

            // 3. PREPARE FORMDATA FOR BACKEND
            btn.disabled = true;
            btn.innerHTML = "Processing...";

            const formData = new FormData();
            formData.append('fullName', name);
            formData.append('phone', phone);
            formData.append('caseSummary', summary);
            formData.append('location', loc);
            formData.append('description', document.getElementById('description').value);
            formData.append('animalType', document.querySelector('input[name="animal_type"]:checked')?.value);
            formData.append('category', document.querySelector('input[name="category"]:checked')?.value);
            formData.append('urgency', document.querySelector('input[name="urgency"]:checked')?.value);

            const photoInput = document.getElementById('photoInput');
            if (photoInput.files.length > 0) {
                for (let i = 0; i < photoInput.files.length; i++) {
                    formData.append('photos', photoInput.files[i]);
                }
            }

            try {
                const response = await fetch('http://localhost:5000/report', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    // SHOW MODAL ONLY ON SUCCESS
                    const modal = document.getElementById('successModal');
                    if (modal) {
                        modal.classList.remove('hidden');
                        modal.classList.add('flex');
                    }

                    showToast("Report saved to database!");
                    rescueForm.reset();
                    document.getElementById('photoStatus').innerText = "Click to upload or drag and drop";
                } else {
                    const errData = await response.json();
                    console.error("Backend Error:", errData);
                    showToast("Server rejected the request", "error");
                }
            } catch (error) {
                console.error("Network Error:", error);
                showToast("Cannot connect to server", "error");
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        });
    }

    // SIGNUP FORM
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const role = document.querySelector('input[name="role"]:checked')?.value || 'general';

            try {
                const response = await fetch('http://localhost:5000/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, role })
                });

                const data = await response.json();
                if (response.ok) {
                    showToast("Signup successful! Redirecting to login...");
                    setTimeout(() => window.location.href = 'login.html', 2000);
                } else {
                    showToast(data.message || "Signup failed", "error");
                }
            } catch (error) {
                console.error("Signup Error:", error);
                showToast("Cannot connect to server", "error");
            }
        });
    }

    // LOGIN FORM
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                if (response.ok) {
                    showToast("Login successful! Redirecting...");
                    localStorage.setItem('token', data.token);
                    setTimeout(() => window.location.href = 'index.html', 2000);
                } else {
                    showToast(data.message || "Login failed", "error");
                }
            } catch (error) {
                console.error("Login Error:", error);
                showToast("Cannot connect to server", "error");
            }
        });
    }

    window.updatePhotoText = function (input) {
        const status = document.getElementById('photoStatus');
        if (status) {
            status.innerText = input.files.length > 0 ? `${input.files.length} Photo(s) Selected` : "Click to upload or drag and drop";
        }
    };

    window.closeModal = function () {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };
});