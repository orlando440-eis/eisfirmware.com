// Form validation and submission handling
class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.successMessage = document.getElementById('successMessage');
        this.errorMessage = document.getElementById('errorMessage');
        
        if (this.form) {
            this.initializeForm();
        }
    }

    initializeForm() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Basic form validation
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        if (!name || !email) {
            this.showError('Please fill in all required fields');
            return;
        }

        this.submitForm();
    }

    // Submit form to submit-form.com (formspark.io)
    async submitForm() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        try {
            submitButton.innerHTML = 'Sending...';
            submitButton.disabled = true;

            const formData = new FormData(this.form);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            const response = await fetch('https://submit-form.com/4EDnlaAwC', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formObject)
            });

            if (!response.ok) {
                const errorDetails = `Status: ${response.status}, StatusText: ${response.statusText}`;
                console.error('Form submission failed:', errorDetails);
                throw new Error(`Form submission failed! ${errorDetails}`);
            }

            const responseData = await response.json();
            console.log('Server response:', responseData);

            this.showSuccess('Thank you! Your project information has been submitted.');
            this.form.reset();

        } catch (error) {
            console.error('Submission error:', error);
            this.showError('There was a problem submitting your form. Please try again later.');
        } finally {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    }

    showSuccess(message) {
        const successMsg = this.successMessage.querySelector('p');
        if (successMsg) {
            successMsg.textContent = message;
        }
        this.successMessage.classList.remove('hidden');
        this.errorMessage.classList.add('hidden');
    }

    showError(message) {
        const errorMsg = this.errorMessage.querySelector('p');
        if (errorMsg) {
            errorMsg.textContent = message;
            // Add a "View Details" button
            const detailsBtn = document.createElement('button');
            detailsBtn.textContent = 'View Error Details';
            detailsBtn.className = 'text-sm text-red-600 underline mt-2';
            detailsBtn.onclick = () => {
                console.log('Error occurred at:', new Date().toISOString());
                console.log('Form data:', Object.fromEntries(new FormData(this.form)));
                alert('Check browser console for error details (Press F12)');
            };
            errorMsg.appendChild(detailsBtn);
        }
        this.errorMessage.classList.remove('hidden');
        this.successMessage.classList.add('hidden');
    }
} 