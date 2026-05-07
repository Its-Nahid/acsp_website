# 🚑 Rescue Case Management System

This document outlines the implementation plan for the **Rescue Case Management** system, allowing NGOs and Admins to manage rescue reports from submission to completion.

## 📋 Core Features
- **Accept Case**: NGOs can take responsibility for a reported animal.
- **Reject Case**: NGOs can mark a case as unreachable or out of their scope (with a reason).
- **Update Status**: Track the animal's journey: `Pending` → `Accepted` → `In Progress` → `Under Treatment` → `Recovered` → `Adopted/Released`.
- **Admin Dashboard**: A centralized view for NGOs to manage their active and pending rescues.

---

## 🛠 Backend Files & Changes

### 1. [MODIFY] `Backend/models/RescueReport.js`
Update the schema to track status and assignment:
```javascript
{
  // ... existing fields ...
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected', 'In Progress', 'Recovered', 'Adopted'], 
    default: 'Pending' 
  },
  assignedNGO: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
  statusUpdates: [{
    status: String,
    note: String,
    updatedAt: { type: Date, default: Date.now }
  }]
}
```

### 2. [MODIFY] `Backend/server.js`
New API endpoints for management:
- `PUT /api/reports/:id/status`: Update the status of a specific report.
- `GET /api/reports/ngo/:ngoId`: Fetch reports assigned to a specific NGO.
- `PUT /api/reports/:id/assign`: Assign a report to an NGO.

---

## 🎨 Frontend Files & UI

### 1. [NEW] `Frontend/rescue-dashboard.html`
- A management console for NGOs.
- **Filters**: View by status (e.g., "Show only Pending cases").
- **Action Buttons**: Quick "Accept" or "View Details" buttons.

### 2. [NEW] `Frontend/case-details.html`
- Detailed view of a single rescue case (photos, location, description).
- **Management Panel**:
  - Dropdown to change status.
  - Text area for adding progress notes.
  - "Reject Case" modal with reason input.

### 3. [UPDATE] `Frontend/components.js`
- Add "Rescue Dashboard" link to the navbar for NGO users.

---

## 🔄 Workflow Logic
1. **Reporting**: A user submits a report via `report.html`. Status is `Pending`.
2. **Discovery**: NGO logs into `rescue-dashboard.html` and sees the new report.
3. **Acceptance**: NGO clicks "Accept". Status changes to `Accepted`, and their NGO ID is linked to the report.
4. **Progress**: As the NGO treats the animal, they update the status to `In Progress` or `Recovered`.
5. **Closure**: Once the animal is safe, the status is marked as `Adopted` or `Released`.

---
*Created by Antigravity AI - 2026-04-27*
