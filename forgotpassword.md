# Forgot Password Implementation Process

## Overview
This document outlines the step-by-step process for implementing a forgot password feature with OTP (One-Time Password) verification in the ACSP website project.

## Current State
- User authentication (signup/login) is already implemented
- Forgot password HTML page exists but lacks backend functionality
- Using Express.js backend with MongoDB, bcrypt for password hashing, and JWT for authentication

## Implementation Steps

### 1. Backend Changes

#### 1.1 Update User Model
Add temporary reset code storage to the user schema:

```javascript
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "general" },
    resetCode: { type: String }, // Temporary 6-digit code
    resetCodeExpiry: { type: Date } // Code expiration time
});
```

#### 1.2 Add Forgot Password Route
Create a POST `/forgot-password` endpoint that:
- Validates the email exists in database
- Generates a 6-digit OTP code
- Stores the code and expiry (15 minutes) in user document
- Returns success message (in production, would send email)

#### 1.3 Add Verify Reset Code Route
Create a POST `/verify-reset-code` endpoint that:
- Takes email and code as input
- Validates code matches and hasn't expired
- Returns a temporary reset token for password change

#### 1.4 Add Reset Password Route
Create a POST `/reset-password` endpoint that:
- Takes reset token and new password
- Validates token and updates password
- Clears reset code fields
- Returns success message

### 2. Frontend Changes

#### 2.1 Update Forgot Password Page
Modify `forgot-password.html` to:
- Show loading states during API calls
- Display success message after code is sent
- Include form to enter the 6-digit code
- Show error messages for invalid codes

#### 2.2 Create Reset Password Page
Create `reset-password.html` that:
- Takes the reset token (from URL params)
- Has form for new password and confirmation
- Validates password strength
- Shows success/error messages

#### 2.3 Update Script.js
Add event handlers for:
- Forgot password form submission
- Code verification form submission
- Reset password form submission
- Form validation and user feedback

### 3. User Flow

#### Step 1: Request Password Reset
1. User enters email on forgot-password.html
2. Frontend sends POST to `/forgot-password`
3. Backend generates 6-digit code and stores it
4. User sees success message (in production: email sent)

#### Step 2: Enter Reset Code
1. User enters the 6-digit code in the same page
2. Frontend sends POST to `/verify-reset-code`
3. Backend validates code and returns reset token
4. Frontend redirects to reset-password.html with token

#### Step 3: Set New Password
1. User enters new password on reset-password.html
2. Frontend sends POST to `/reset-password` with token
3. Backend validates token and updates password
4. User sees success message and is redirected to login

### 4. Security Considerations

#### 4.1 Code Generation
- Use cryptographically secure random number generation
- 6-digit numeric codes (easy to enter on mobile)
- Codes expire after 15 minutes

#### 4.2 Rate Limiting
- Limit reset attempts per email per hour
- Prevent brute force attacks on code verification

#### 4.3 Password Requirements
- Minimum 8 characters
- Require at least one uppercase, lowercase, number
- Hash new passwords with bcrypt

#### 4.4 Token Security
- Reset tokens are temporary and single-use
- Clear reset codes after successful password change
- Use secure random strings for tokens

### 5. Error Handling

#### Common Error Scenarios:
- Email not found in database
- Invalid or expired reset code
- Weak password requirements not met
- Network connectivity issues
- Server errors

#### User Feedback:
- Clear error messages for each scenario
- Loading indicators during API calls
- Success confirmations at each step

### 6. Testing Checklist

#### Backend Tests:
- [ ] Forgot password endpoint creates code
- [ ] Code verification validates correctly
- [ ] Password reset updates user record
- [ ] Expired codes are rejected
- [ ] Invalid codes are rejected

#### Frontend Tests:
- [ ] Forgot password form submits correctly
- [ ] Code entry form validates input
- [ ] Reset password form enforces requirements
- [ ] Error messages display properly
- [ ] Success flows redirect correctly

#### Integration Tests:
- [ ] Complete forgot password flow works end-to-end
- [ ] Existing login still works after password change
- [ ] Multiple reset attempts are handled properly

### 7. Production Considerations

#### Email Service Integration:
- Replace console.log with actual email sending (Nodemailer)
- Use email templates for better UX
- Add email delivery tracking

#### Additional Security:
- Implement rate limiting middleware
- Add CAPTCHA for reset requests
- Log security events for monitoring
- Use HTTPS for all password-related endpoints

#### Monitoring:
- Track reset success/failure rates
- Monitor for suspicious activity
- Set up alerts for high failure rates

## File Changes Summary

### Backend Files:
- `models/user.js` - Add reset code fields
- `server.js` - Add 3 new routes

### Frontend Files:
- `forgot-password.html` - Add code entry form
- `reset-password.html` - New page for password reset
- `script.js` - Add form handlers and validation

### Dependencies:
- No new dependencies required (using existing bcrypt, crypto)</content>
<parameter name="filePath">c:\Users\com\OneDrive\Desktop\JavaScript\acsp_website\forgotpassword.md