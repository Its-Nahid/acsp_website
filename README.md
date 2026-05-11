# 🐾 ACSP Website — Animal Care and Support Platform

[![Website](https://img.shields.io/badge/Platform-Web-blue)](https://github.com/Its-Nahid/ACSP-Website)
[![Backend](https://img.shields.io/badge/Backend-Node.js-green)](https://github.com/Its-Nahid/ACSP-Website)
[![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen)](https://www.mongodb.com/)
[![Language](https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-orange)](https://developer.mozilla.org/)
[![Status](https://img.shields.io/badge/Status-Active-success)]()

A modern web application designed to streamline animal rescue and support operations.  
ACSP enables users to report animals in need, upload photos, and interact with a responsive frontend while maintaining secure user authentication and backend database management.

---

## 🏗 Project Structure

- **/Backend**: Node.js and Express server handling all API requests and database interactions.
  - `server.js`: Main entry point for the backend.
  - `models/`: Mongoose schemas — `user.js`, `RescueReport.js`, `report.js`, `Adoption.js`, `Donation.js`, `NGO.js`, `Vet.js`, `Volunteer.js`, `VolunteerOpportunity.js`, `RescuedAnimal.js`
  - `uploads/`: Directory for locally stored uploaded photos (migrated to Cloudinary).
- **/Frontend**: All client-side HTML, JS, and CSS files.
  - `index.html`: Main landing page with statistics, hero section, and emergency contacts.
  - `login.html` & `signup.html`: User authentication pages.
  - `forgot-password.html`, `reset-password.html`, `check_mail.html`: Password recovery flow.
  - `ai_chat.html`: Interactive AI Assistant powered by Groq (Llama 3 70B).
  - `admin_dashboard.html`: Data-driven dashboard for platform-wide management.
  - `report.html` & `rescue.html` & `rescue-dashboard.html`: Rescue reporting, info, and management.
  - `adoptionpage.html` & `adoption_form.html`: Pet adoption gallery and listing submission.
  - `ngo_directory.html` & `ngo-profile.html`: NGO partner directory and profile pages.
  - `ngo animal_listing.html` & `ngo case-details.html`: NGO-specific rescue listings and case views.
  - `ngo donation-tracking.html`: NGO financial donation tracking dashboard.
  - `become_partner.html`: Application form for NGOs to join the platform.
  - `donation.html`, `success.html`, `fail.html`, `cancel.html`: SSLCommerz payment flow pages.
  - `vet_directory.html` & `vet_join_form.html`: Verified vet directory and vet application form.
  - `volunteer.html`: Volunteer registration and opportunity browsing.
  - `article.html` & `updated_article.html`: Educational articles for pet owners.
  - `contact_doctors.html`: Medical specialist contact directory.
  - `components.js`: Shared component library for unified UI (headers, footers, navigation).
  - `script.js`: Unified JavaScript for frontend logic and API integration.
  - `css/`: Stylesheets.

## ✨ Implemented Features

### 1. User Authentication

- **Signup & Login:** Secure registration and login with encrypted passwords (`bcryptjs`) and JWT-based session management.
- **Password Recovery:** Full forgot/reset password flow via Nodemailer OTP email verification (`forgot-password.html`, `check_mail.html`, `reset-password.html`).
- **State Management:** Authentication status stored in `localStorage` for session persistence.

### 2. Rescue Reporting System

- **Report Submission:** Capture animal type, category, urgency level, and location details via `report.html`.
- **Rescue Dashboard:** Dedicated rescue management dashboard (`rescue-dashboard.html`) for tracking active cases.
- **Photo Uploads:** Multi-image upload support via Cloudinary (migrated from local Multer storage).
- **Database Storage:** Reports saved in MongoDB Atlas using the `RescueReport` and `RescuedAnimal` Mongoose models.

### 3. NGO Partner Ecosystem

- **NGO Directory:** Fully searchable public directory of NGO partners (`ngo_directory.html`).
- **NGO Profiles:** Dynamic NGO profile pages with editable information (`ngo-profile.html`).
- **NGO Animal Listings:** NGOs can list their rescued animals for public visibility (`ngo animal_listing.html`).
- **Donation Tracking:** NGOs can track real-time incoming donations (`ngo donation-tracking.html`).
- **Partner Registration:** Application form for new NGOs to join the platform (`become_partner.html`).

### 4. Secure Donation Gateway

- **SSLCommerz Integration:** Integrated `sslcommerz-lts` for secure payment processing with cause selection.
- **Dynamic Cause Selection:** Donors select specific animal causes or NGO partners via interactive UI cards.
- **Database Tracking:** Every transaction stores donor info (Name, Phone, Location, Transaction ID, Status) in MongoDB.
- **Payment Redirects:** Dedicated success, fail, and cancel pages for complete payment flow handling.

### 5. Pet Adoption Marketplace

- **Dynamic Gallery:** Real-time pet listings from MongoDB with status badges (Vaccinated, Neutered).
- **Listing Submission:** Multi-photo adoption listing form with health and personality profiling (`adoption_form.html`).
- **UI Consistency:** Shared `components.js` system for a unified experience across the portal.

### 6. Volunteer Management

- **Volunteer Registration:** Users can sign up as volunteers through `volunteer.html`.
- **Volunteer Opportunities:** Backend API and Mongoose model (`VolunteerOpportunity.js`) to manage postings.

### 7. Vet & Medical Directory

- **Vet Directory:** Searchable directory of verified veterinarians (`vet_directory.html`) with application tracking.
- **Vet Join Form:** Vets can apply to be listed on the platform (`vet_join_form.html`).
- **Contact Doctors:** Specialist medical contact directory (`contact_doctors.html`).

### 8. AI Chat Assistant

- **Groq Llama 3 Integration:** AI-powered pet care assistant using the Groq API (Llama 3 70B) for expert advice on nutrition, symptoms, and emergencies.

### 9. Educational Articles

- **Article System:** Published educational articles for pet owners and the general public (`article.html`, `updated_article.html`).

### 10. Admin Dashboard

- **Real-time Analytics:** Overview of total rescues, adoptions, donations, and NGOs.
- **Platform Management:** Admin controls for user, NGO, and rescue case management.

### 11. Cloud Storage & Deployment

- **Cloudinary Integration:** Scalable cloud image hosting for all user-uploaded photos.
- **Vercel Deployment:** Platform deployed on Vercel with serverless function routing via `vercel.json`.
- **Email Notifications:** Nodemailer for OTP-based password recovery and email verification.

---

## 🔧 Pending / Future Work

- **Analytics Dashboard**: Creating visual charts for rescue and donation metrics.
- **Treatment Module**: Tracking animal medical history.

---

## ⚙️ Tech Stack

| Layer        | Technology                                |
| ------------ | ----------------------------------------- |
| Backend      | Node.js, Express.js                       |
| Database     | MongoDB Atlas, Mongoose                   |
| File Uploads | Multer, Cloudinary                        |
| Auth         | JWT, BcryptJS, Nodemailer                 |
| Frontend     | HTML5, CSS3 (Tailwind), JavaScript (ES6+) |
| Deployment   | Vercel (Serverless)                       |
| Misc         | SSL Commerz, Groq (Llama 3 AI)            |

---

## How to Run

1. **Backend**:
   - Navigate to `Backend/` directory.
   - Run `npm install`.
   - Start the server: `node server.js` (Server runs on port 5000).
2. **Frontend**:
   - Open `Frontend/index.html` in a web browser.
   - Ensure the backend is running for auth and reporting features to work

---

## 👥 Meet the Team

<table>
  <tr>
    <td align="center" width="25%" valign="top" style="border: 1px solid #e1e4e8; border-radius: 8px; padding: 12px;">
      <a href="https://github.com/Its-Nahid">
        <img src="Frontend/assets/4025-punchy-animal-crossing.png" width="100px;" alt="Nahid"/>
        <br />
        <b>Naimur Rahman Nahid</b>
      </a>
      <br />
      <i>Project Lead & Full-Stack Architect</i>
      <br />
      <hr style="border: 0; border-top: 1px solid #e1e4e8; margin: 8px 0;" />
      <div style="font-size: 13px; color: gray; text-align: left;">
        <b>Core Systems:</b> Adoption Page Backend, Rescue Page Backend, Admin Dashboard, SSLCommerz Donations, User Login & Logout System, JWT Authentication Backend, Nodemailer Engine, Groq AI, Cloudinary Image Compression, Vercel Serverless Deployment, Dynamic Component System, MongoDB Atlas Architecture
      </div>
    </td>
    <td align="center" width="25%" valign="top" style="border: 1px solid #e1e4e8; border-radius: 8px; padding: 12px;">
      <a href="https://github.com/hawarihCSE">
        <img src="Frontend/assets/1921-isabelle-animal-crossing.png" width="100px;" alt="Hawarih Hawa"/>
        <br />
        <b>Hawarih Hawa</b>
      </a>
      <br />
      <i>Backend Developer & NGO Systems Lead</i>
      <br />
      <hr style="border: 0; border-top: 1px solid #e1e4e8; margin: 8px 0;" />
      <div style="font-size: 13px; color: gray; text-align: left;">
        <b>Core Contributions:</b> Login Page UI, Rescue Reporting Form, NGO Database Schema & APIs, NGO Profile Management, NGO Partner Registration, Volunteer Backend API & Logic, Volunteer Coordination System, Donation Tracking Backend, NGO Animal Rescue Listings, NGO Rescue Case Assignment, Educational Articles System
      </div>
    </td>
    <td align="center" width="25%" valign="top" style="border: 1px solid #e1e4e8; border-radius: 8px; padding: 12px;">
      <a href="https://github.com/Rafia-cloud-star">
        <img src="Frontend/assets/6369-isabelle-animal-crossing.png" width="100px;" alt="Rafia Raha"/>
        <br />
        <b>Rafia Raha</b>
      </a>
      <br />
      <i>Auth Flows & UI Improvements</i>
      <br />
      <hr style="border: 0; border-top: 1px solid #e1e4e8; margin: 8px 0;" />
      <div style="font-size: 13px; color: gray; text-align: left;">
        <b>Core Contributions:</b> Forgot Password & Recover Password UI, Secure Email Verification UI, Pet Adoption Marketplace UI, 'Become a Partner' Onboarding Portal, Public NGO Directory, General UI Enhancements, Responsive Layout & Cross-device Testing
      </div>
    </td>
    <td align="center" width="25%" valign="top" style="border: 1px solid #e1e4e8; border-radius: 8px; padding: 12px;">
      <a href="https://github.com/its-fokrul">
        <img src="Frontend/assets/7247-animal-crossing-cat.png" width="100px;" alt="Fokrul Islam"/>
        <br />
        <b>Fokrul Islam</b>
      </a>
      <br />
      <i>Frontend & UI Components</i>
      <br />
      <hr style="border: 0; border-top: 1px solid #e1e4e8; margin: 8px 0;" />
      <div style="font-size: 13px; color: gray; text-align: left;">
        <b>Core Contributions:</b> Signup Page UI, Pet Adoption Listing Form, Real-time Home Page Statistics, AI Chat Interface Design, Vet Directory Architecture & Filters, Medical Contacts UI, Volunteer Form UI, Component Styling & Animations
      </div>
    </td>
  </tr>
</table>

---

## 🐛 Known Issues

- Cloudinary free tier has a monthly bandwidth/storage limit; heavy usage may require a plan upgrade.
- AI Chat (Groq API free tier) may hit rate limits during peak usage — responses may slow down or temporarily fail.
- NGO profile image updates currently require a page refresh to reflect changes.
- SSLCommerz is configured for sandbox/test mode; switching to production requires a merchant account upgrade.
- Some older browser versions may not fully support the CSS animations used in hero and modal sections.

---

## 🧠 What We Learned

- **Full-stack integration:** Connecting a Node.js/Express backend with MongoDB Atlas and a dynamic multi-page frontend.
- **Payment Verification:** Synchronizing SSLCommerz webhooks, backend REST state management, and redirect handling for secure transactions.
- **Authentication & Security:** Implementing JWT-based sessions, bcrypt password hashing, and OTP email recovery via Nodemailer.
- **Cloud Storage:** Migrating from local Multer file storage to Cloudinary for scalable, CDN-backed image hosting.
- **AI Integration:** Connecting the Groq API (Llama 3 70B) to a real-time chat interface with context-aware system prompting.
- **Serverless Deployment:** Configuring Vercel's `vercel.json` routing to bridge a multi-page frontend with a Node.js serverless backend.
- **Team Collaboration:** Managing a multi-member project with Git branching, code reviews, and feature-based task delegation.

---

## 👤 Author

**Naimur Rahman Nahid**

- 🔗 GitHub: [@Its-Nahid](https://github.com/Its-Nahid)
- 🏫 University Project — Animal Care & Support Platform (ACSP)
- 📌 Role: Project Lead, Full-Stack Architect, Backend Engineer, Deployment Lead

---

## 📄 License

This project was developed as a university academic project. All rights reserved by the development team.

---

⭐ If you find this project useful, consider **starring the repository** to support development.
