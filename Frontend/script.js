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

    // RESCUE REPORT FORM
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
    let currentSignupEmail = '';

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const role = document.querySelector('input[name="role"]:checked')?.value || 'general';
            
            const btn = signupForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = 'Processing...';

            try {
                const response = await fetch('http://localhost:5000/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, role })
                });

                const data = await response.json();
                if (response.ok && data.requireVerification) {
                    showToast("Verification code sent! Check your email.");
                    currentSignupEmail = email;
                    document.getElementById('signupEmailDisplay').textContent = email;
                    
                    // Switch forms
                    signupForm.classList.add('hidden');
                    const footer = document.getElementById('signupFooter');
                    if (footer) footer.classList.add('hidden');
                    document.getElementById('verifySignupForm').classList.remove('hidden');
                } else if (response.ok) {
                    showToast("Signup successful! Redirecting to login...");
                    setTimeout(() => window.location.href = 'login.html', 2000);
                } else {
                    showToast(data.message || "Signup failed", "error");
                }
            } catch (error) {
                console.error("Signup Error:", error);
                showToast("Cannot connect to server", "error");
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        });
    }

    // VERIFY SIGNUP CODE FORM
    const verifySignupForm = document.getElementById('verifySignupForm');
    if (verifySignupForm) {
        verifySignupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const code = document.getElementById('signupCode').value;
            const verifyBtn = document.getElementById('verifySignupBtn');
            const originalText = verifyBtn.innerHTML;

            if (code.length !== 6) {
                showToast("Please enter a 6-digit code", "error");
                return;
            }

            verifyBtn.disabled = true;
            verifyBtn.innerHTML = 'Verifying...';

            try {
                const response = await fetch('http://localhost:5000/verify-signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: currentSignupEmail, code })
                });

                const data = await response.json();
                if (response.ok) {
                    showToast("Account verified successfully! Redirecting to login...");
                    setTimeout(() => window.location.href = 'login.html', 2000);
                } else {
                    showToast(data.message || "Invalid code", "error");
                }
            } catch (error) {
                console.error("Verify Signup Error:", error);
                showToast("Cannot connect to server", "error");
            } finally {
                verifyBtn.disabled = false;
                verifyBtn.innerHTML = originalText;
            }
        });
    }
    
    // VALIDATION FOR SIGNUP CODE (only numbers)
    const signupCodeInput = document.getElementById('signupCode');
    if (signupCodeInput) {
        signupCodeInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            if (e.target.value.length > 6) {
                e.target.value = e.target.value.slice(0, 6);
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
                    localStorage.setItem('role', data.role);
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

    // FORGOT PASSWORD FORM
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const sendCodeBtn = document.getElementById('sendCodeBtn');
            const originalText = sendCodeBtn.innerHTML;

            sendCodeBtn.disabled = true;
            sendCodeBtn.innerHTML = '<span>Sending...</span><span class="material-symbols-outlined text-xl">hourglass_empty</span>';

            try {
                const response = await fetch('http://localhost:5000/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();
                if (response.ok) {
                    showToast("Reset code sent! Check your email.");
                    // Switch to code verification form
                    document.getElementById('emailDisplay').textContent = email;
                    forgotPasswordForm.classList.add('hidden');
                    document.getElementById('verifyCodeForm').classList.remove('hidden');
                } else {
                    showToast(data.message || "Failed to send reset code", "error");
                }
            } catch (error) {
                console.error("Forgot Password Error:", error);
                showToast("Cannot connect to server", "error");
            } finally {
                sendCodeBtn.disabled = false;
                sendCodeBtn.innerHTML = originalText;
            }
        });
    }

    // VERIFY RESET CODE FORM
    const verifyCodeForm = document.getElementById('verifyCodeForm');
    if (verifyCodeForm) {
        verifyCodeForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const code = document.getElementById('resetCode').value;
            const verifyCodeBtn = document.getElementById('verifyCodeBtn');
            const originalText = verifyCodeBtn.innerHTML;

            if (code.length !== 6) {
                showToast("Please enter a 6-digit code", "error");
                return;
            }

            verifyCodeBtn.disabled = true;
            verifyCodeBtn.innerHTML = '<span>Verifying...</span><span class="material-symbols-outlined text-xl">hourglass_empty</span>';

            try {
                const response = await fetch('http://localhost:5000/verify-reset-code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, code })
                });

                const data = await response.json();
                if (response.ok) {
                    showToast("Code verified! Redirecting...");
                    // Redirect to reset password page with token
                    setTimeout(() => {
                        window.location.href = `reset-password.html?token=${encodeURIComponent(data.resetToken)}`;
                    }, 1500);
                } else {
                    showToast(data.message || "Invalid code", "error");
                }
            } catch (error) {
                console.error("Verify Code Error:", error);
                showToast("Cannot connect to server", "error");
            } finally {
                verifyCodeBtn.disabled = false;
                verifyCodeBtn.innerHTML = originalText;
            }
        });

        // RESEND CODE BUTTON
        const resendCodeBtn = document.getElementById('resendCodeBtn');
        if (resendCodeBtn) {
            resendCodeBtn.addEventListener('click', async () => {
                const email = document.getElementById('email').value;
                resendCodeBtn.disabled = true;
                resendCodeBtn.textContent = 'Sending...';

                try {
                    const response = await fetch('http://localhost:5000/forgot-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });

                    const data = await response.json();
                    if (response.ok) {
                        showToast("New reset code sent!");
                    } else {
                        showToast(data.message || "Failed to resend code", "error");
                    }
                } catch (error) {
                    console.error("Resend Code Error:", error);
                    showToast("Cannot connect to server", "error");
                } finally {
                    resendCodeBtn.disabled = false;
                    resendCodeBtn.textContent = "Didn't receive code? Resend";
                }
            });
        }
    }

    // RESET PASSWORD FORM
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const urlParams = new URLSearchParams(window.location.search);
            const resetToken = urlParams.get('token');
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const resetPasswordBtn = document.getElementById('resetPasswordBtn');
            const originalText = resetPasswordBtn.innerHTML;

            if (!resetToken) {
                showToast("Invalid reset link", "error");
                return;
            }

            if (newPassword.length < 8) {
                showToast("Password must be at least 8 characters long", "error");
                return;
            }

            if (newPassword !== confirmPassword) {
                showToast("Passwords do not match", "error");
                return;
            }

            resetPasswordBtn.disabled = true;
            resetPasswordBtn.innerHTML = '<span>Resetting...</span><span class="material-symbols-outlined text-xl">hourglass_empty</span>';

            try {
                const response = await fetch('http://localhost:5000/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ resetToken, newPassword })
                });

                const data = await response.json();
                if (response.ok) {
                    showToast("Password reset successful! Redirecting to login...");
                    setTimeout(() => window.location.href = 'login.html', 2000);
                } else {
                    showToast(data.message || "Failed to reset password", "error");
                }
            } catch (error) {
                console.error("Reset Password Error:", error);
                showToast("Cannot connect to server", "error");
            } finally {
                resetPasswordBtn.disabled = false;
                resetPasswordBtn.innerHTML = originalText;
            }
        });
    }

    // PASSWORD VISIBILITY TOGGLES
    const toggleNewPassword = document.getElementById('toggleNewPassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

    if (toggleNewPassword) {
        toggleNewPassword.addEventListener('click', () => {
            const input = document.getElementById('newPassword');
            const icon = toggleNewPassword.querySelector('.material-symbols-outlined');
            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = 'visibility_off';
            } else {
                input.type = 'password';
                icon.textContent = 'visibility';
            }
        });
    }

    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', () => {
            const input = document.getElementById('confirmPassword');
            const icon = toggleConfirmPassword.querySelector('.material-symbols-outlined');
            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = 'visibility_off';
            } else {
                input.type = 'password';
                icon.textContent = 'visibility';
            }
        });
    }

    // RESET CODE INPUT VALIDATION (only numbers, max 6 digits)
    const resetCodeInput = document.getElementById('resetCode');
    if (resetCodeInput) {
        resetCodeInput.addEventListener('input', (e) => {
            // Remove any non-numeric characters
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            // Limit to 6 digits
            if (e.target.value.length > 6) {
                e.target.value = e.target.value.slice(0, 6);
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

    // DONATION AMOUNT BUTTONS
    let selectedAmount = 2000; // default
    const amountButtons = document.querySelectorAll('.donation-amount-btn');
    const amountInput = document.getElementById('donationAmount');

    if (amountButtons) {
        amountButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                selectedAmount = parseInt(btn.getAttribute('data-amount'), 10);
                if (amountInput) amountInput.value = ''; // clear custom amount output
                
                // update UI classes
                amountButtons.forEach(b => {
                    b.classList.remove('border-primary', 'bg-primary', 'text-white', 'shadow-md');
                    b.classList.add('border-primary/20', 'text-gray-600', 'dark:text-gray-300');
                });
                btn.classList.add('border-primary', 'bg-primary', 'text-white', 'shadow-md');
                btn.classList.remove('border-primary/20', 'text-gray-600', 'dark:text-gray-300');
            });
        });
    }

    if (amountInput) {
        amountInput.addEventListener('input', () => {
            if (amountInput.value) {
                // If user types, visually deselect all preset buttons
                amountButtons.forEach(b => {
                    b.classList.remove('border-primary', 'bg-primary', 'text-white', 'shadow-md');
                    b.classList.add('border-primary/20', 'text-gray-600', 'dark:text-gray-300');
                });
            }
        });
    }

    // DONATION FORM
    const donateBtn = document.getElementById('donateBtn');
    if (donateBtn) {
        donateBtn.addEventListener('click', async () => {
            let finalAmount = selectedAmount;
            if (amountInput && amountInput.value) {
                finalAmount = parseFloat(amountInput.value);
            }
            
            if (finalAmount < 10) {
                showToast("Minimum donation is 10 BDT", "error");
                return;
            }

            // Collect Donor Details
            const donorName = document.getElementById('donorName')?.value.trim();
            const phone = document.getElementById('donorPhone')?.value.trim();
            const location = document.getElementById('donorLocation')?.value.trim();

            if (!donorName || !phone || !location) {
                showToast("Please fill in your Full Name, Phone, and Location", "error");
                return;
            }

            // Collect Cause
            const selectedCauseRadio = document.querySelector('input[name="selectedCause"]:checked');
            const cause = selectedCauseRadio ? selectedCauseRadio.value : 'General Fund';

            const originalText = donateBtn.innerText;
            donateBtn.innerText = "Processing...";
            donateBtn.disabled = true;

            try {
                const response = await fetch('http://localhost:5000/api/donate/init', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: finalAmount, donorName, phone, location, cause })
                });

                const data = await response.json();
                if (response.ok && data.url) {
                    window.location.href = data.url;
                } else {
                    showToast("Failed to initialize payment", "error");
                    donateBtn.innerText = originalText;
                    donateBtn.disabled = false;
                }
            } catch (error) {
                console.error("Donation Error:", error);
                showToast("Cannot connect to server", "error");
                donateBtn.innerText = originalText;
                donateBtn.disabled = false;
            }
        });
    }
});