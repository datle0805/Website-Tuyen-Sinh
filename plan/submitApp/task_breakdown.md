# Application Submission System - Task Breakdown

## Backend Implementation

### Database Models
- [ ] Create Application model with schema
- [ ] Add education level field (Vietnamese values: Mẫu giáo, Lớp 1-12, Đại học, TOEIC)
- [ ] Add appointment fields (date, time, location, notes)
- [ ] Add application status tracking (pending, reviewing, accepted, rejected)

### API Endpoints
- [ ] Create application submission endpoint (POST /api/applications)
- [ ] Create get applications endpoint (GET /api/applications)
- [ ] Create get single application endpoint (GET /api/applications/:id)
- [ ] Create update application status endpoint (PATCH /api/applications/:id/status)
- [ ] Create set appointment endpoint (PATCH /api/applications/:id/appointment)
- [ ] Add validation middleware
- [ ] Add authentication middleware

### Email Service
- [ ] Install and configure Resend (`npm install resend`)
- [ ] Create email service utility
- [ ] Design email templates (HTML/React Email)
- [ ] Implement submission confirmation email
- [ ] Implement status update notification email
- [ ] Implement appointment notification email

## Frontend Implementation

### Application Submission Form
- [ ] Create application form page (`/submit/page.tsx`)
- [ ] Design single-page form UI with sections (TailwindCSS)
- [ ] Add education level dropdown (Mẫu giáo - TOEIC)
- [ ] Add form validation with react-hook-form + yup
- [ ] Create success modal/popup component
- [ ] Add success/error notifications
- [ ] Create API service for submissions
- [ ] Implement authentication check (must be logged in)
- [ ] Auto-fill email from logged-in user

### Application Management
- [ ] Create application list/dashboard page (`/applications/page.tsx`)
- [ ] Display application status with color coding
- [ ] Display appointment information (date, time, location)
- [ ] Add filter by status and education level
- [ ] Create application detail view (`/applications/[id]/page.tsx`)
- [ ] Implement status tracking UI
- [ ] Show appointment badge on application cards

### Components
- [ ] Create SuccessModal component
- [ ] Create ApplicationForm component
- [ ] Create ApplicationCard component

## Verification & Testing

- [ ] Test application submission flow end-to-end
- [ ] Test email sending functionality (confirmation, status update, appointment)
- [ ] Test appointment scheduling (admin functionality)
- [ ] Test API endpoints with different scenarios
- [ ] Test form validation (required fields, education level dropdown)
- [ ] Test success modal display
- [ ] Test authentication requirements
- [ ] Test that users can only view their own applications
- [ ] Create walkthrough document
