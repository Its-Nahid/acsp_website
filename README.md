# ACSP Website - Project Status

Currently implemented features and project structure for the Animal Care and Support Project (ACSP).

## Project Structure
- **/Backend**: Node.js and Express server handling API requests and database interactions.
  - `server.js`: Main entry point for the backend.
  - `models/`: Mongoose schemas for User and RescueReport.
  - `uploads/`: Directory for storing uploaded photos.
- **/Frontend**: Client-side files.
  - `index.html`: Main landing page with navigation and emergency contacts.
  - `login.html` & `signup.html`: User authentication pages.
  - `report.html`: Rescue reporting form with photo upload support.
  - `rescuse.html`: Information related to rescue operations.
  - `forgot-password.html`: Placeholder for password recovery.
  - `script.js`: Unified JavaScript for frontend logic and API integration.
  - `css/`: Stylesheets.

## Implemented Features

### 1. User Authentication
- **Signup**: Users can register with their name, email, password, and role. Passwords are encrypted using `bcryptjs`.
- **Login**: Secure login with JWT (JSON Web Token) generation for session management. Auth status is handled in `localStorage`.
- **Frontend Integration**: Forms are connected to the backend via `fetch` in `script.js`.

### 2. Rescue Reporting System
- **Report Submission**: A comprehensive form in `report.html` allows users to submit details about animals in need (type, category, urgency, location, etc.).
- **Photo Uploads**: Support for up to 5 photos per report using `multer`. Photos are saved in the `Backend/uploads/` directory.
- **Database Storage**: Reports are saved in MongoDB (`acspAuth` database).
- **Confirmation**: Success Modal displays submitted info after a successful report.

### 3. Frontend Logic
- **Unified Script**: `script.js` handles all form submissions, photo upload status, and dynamic UI updates.
- **Dynamic Feedback**: Success/Error Toast notifications for better user experience.
- **Tailwind CSS**: Modern UI design using Tailwind CSS and Google Material Symbols.

## Pending / In Progress
- Navigation links for NGO Directory, Treatment, Donation, and Adoption are in the UI but the corresponding HTML files are yet to be fully implemented/linked (currently pointing to placeholders like `drectory.html`, `dnation.html`).
- Backend password recovery logic for `forgot-password.html`.

## Tech Stack
- **Backend**: Express.js, Mongoose (MongoDB), Multer, JWT, BcryptJS, CORS.
- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript (Vanilla ES6+).

## How to Run
1. **Backend**:
   - Navigate to `Backend/` directory.
   - Run `npm install`.
   - Start the server: `node server.js` (Server runs on port 5000).
2. **Frontend**:
   - Open `Frontend/index.html` in a web browser.
   - Ensure the backend is running for auth and reporting features to work
