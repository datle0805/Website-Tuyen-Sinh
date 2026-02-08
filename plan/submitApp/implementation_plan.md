# Application Submission System Implementation Plan

Triển khai hệ thống nộp hồ sơ tuyển sinh với tính năng gửi email thông báo tự động khi nộp thành công.

## Configuration Decisions

> [!NOTE]
> **Email Service**: Using **Resend** (free tier: 3,000 emails/month, 100 emails/day)
> - No credit card required for free tier
> - Simple API integration
> - Professional email templates
> - Fallback: Brevo (300 emails/day free) or NodeMailer with Gmail

> [!NOTE]
> **Application Fields**: Simplified application form in **English**
> - User must be logged in (uses registration email)
> - Personal information (full name, date of birth, gender)
> - Contact details (address, phone number, email auto-filled from account, city, country)
> - Education level dropdown (Mẫu giáo, Lớp 1-12, Đại học, TOEIC)
> - No document uploads or ID verification required
> - Admin can set appointment schedule (lịch hẹn) after reviewing application

> [!NOTE]
> **User Flow**:
> 1. User registers/logs in with email
> 2. User fills and submits application form
> 3. **Success popup** shows application number and summary
> 4. User can view application status and appointments in dashboard (only their own applications)
> 5. Admin sets appointment → User receives email notification

## Proposed Changes

### Backend - Database Models

#### [NEW] Application.ts

Location: `backend/src/models/Application.ts`

Simplified Application model schema:

```typescript
{
  userId: ObjectId,              // Reference to User model
  applicationNumber: string,     // Auto-generated unique (e.g., "APP-2026-00001")
  status: enum,                  // 'pending' | 'reviewing' | 'accepted' | 'rejected'
  
  // Personal Information
  fullName: string,
  dateOfBirth: Date,
  gender: string,                // 'male' | 'female' | 'other'
  phoneNumber: string,
  email: string,                 // Application email
  address: string,
  city: string,
  country: string,
  
  // Education Information
  educationLevel: string,        // Dropdown values in Vietnamese: 'Mẫu giáo' | 'Lớp 1' - 'Lớp 12' | 'Đại học' | 'TOEIC'
  
  // Appointment Information
  appointmentDate: Date,         // Scheduled appointment date (admin sets this)
  appointmentTime: string,       // Appointment time slot (e.g., "09:00 - 10:00")
  appointmentLocation: string,   // Interview/test location
  appointmentNotes: string,      // Additional appointment instructions
  
  // Metadata
  submittedAt: Date,
  lastModifiedAt: Date,
  reviewNotes: string,           // Admin notes
  reviewedBy: ObjectId           // Admin user ID
}
```

---

### Backend - Application Module

#### [NEW] application.controller.ts

Location: `backend/src/modules/application/application.controller.ts`

Implement controller functions:

- **submitApplication**: Create new application, generate application number, send confirmation email
  - Use logged-in user's email from registration
  - Link application to userId
  - Return application data for success popup
- **getApplications**: Get all applications (user's own or all if admin)
  - Filter by userId to show only user's applications
- **getApplicationById**: Get single application details
  - Include appointment information if set
- **updateApplicationStatus**: Update status (admin only), send notification email
- **updateApplication**: Update application info (only when status = pending)
- **setAppointment**: Set appointment date/time/location (admin only), send appointment email

#### [NEW] application.routes.ts

Location: `backend/src/modules/application/application.routes.ts`

Define routes:
```
POST   /api/applications          - Submit new application (requires auth)
GET    /api/applications          - Get all user's applications (requires auth)
GET    /api/applications/:id      - Get single application (requires auth)
PATCH  /api/applications/:id      - Update application (pending only, requires auth)
PATCH  /api/applications/:id/status - Update status (admin, requires auth)
PATCH  /api/applications/:id/appointment - Set appointment (admin, requires auth)
```

#### [NEW] application.validation.ts

Location: `backend/src/modules/application/application.validation.ts`

Validation rules using express-validator:
- Required fields: fullName, dateOfBirth, gender, phoneNumber, email, address, city, country, educationLevel
- Date format validation (dateOfBirth must be valid date)
- Phone number format validation
- Email format validation
- Education level must be one of allowed values: 'Mẫu giáo', 'Lớp 1' through 'Lớp 12', 'Đại học', 'TOEIC'

---

### Backend - Email Service

#### [NEW] emailService.ts

Location: `backend/src/services/emailService.ts`

Implement email service with **Resend**:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

- sendApplicationConfirmation(email, applicationData)
  // Send confirmation email after successful submission
  // Include: application number, submitted details, next steps
  
- sendStatusUpdateNotification(email, applicationData, newStatus)
  // Send email when application status changes
  // Include: new status, admin notes, further instructions
  
- sendAppointmentNotification(email, applicationData, appointmentInfo)
  // Send email when appointment is scheduled
  
- Use React Email templates for professional HTML emails
```

#### [NEW] email-templates/

Location: `backend/src/services/email-templates/`

Email templates (React Email or HTML):

**ApplicationConfirmation.tsx** (or .html):
- Subject: "Application Received - [Application Number]"
- Content:
  - Welcome message
  - Application number with prominent display
  - Summary of submitted information
  - Timeline for review process
  - Contact information for inquiries

**StatusUpdate.tsx** (or .html):
- Subject: "Application Status Update - [Application Number]"
- Content:
  - Status change notification (Accepted/Rejected/Under Review)
  - Admin notes/feedback
  - Next steps based on status
  - Contact for appeals (if rejected)

**AppointmentNotification.tsx** (or .html):
- Subject: "Appointment Scheduled - [Application Number]"
- Content:
  - Appointment date and time
  - Location and instructions
  - What to bring
  - Contact for rescheduling

---

### Backend - Server Configuration

#### [MODIFY] server.ts

Location: `backend/src/server.ts`

Add application routes:
```typescript
import applicationRoutes from "./modules/application/application.routes";
app.use("/api/applications", applicationRoutes);
```

#### [MODIFY] package.json

Location: `backend/package.json`

Add dependency:
```json
"resend": "^3.0.0"
```

---

### Frontend - Application Submission

#### [NEW] submit/page.tsx

Location: `frontend/src/app/submit/page.tsx`

Simplified single-page application form (all fields in English):

**Authentication Required**: User must be logged in to submit
- Auto-fill email from logged-in user account
- Link application to userId

**Personal Information Section**
- Full Name (required)
- Date of Birth (required, date picker)
- Gender (required, radio buttons: Male/Female/Other)

**Contact Information Section**
- Phone Number (required)
- Email (auto-filled from user account, read-only)
- Address (required)
- City (required)
- Country (required, dropdown or text)

**Education Level Section**
- Education Level (required, dropdown with Vietnamese values):
  - Mẫu giáo
  - Lớp 1, Lớp 2, Lớp 3, ... Lớp 12
  - Đại học
  - TOEIC

**Submit Button**
- Submit application
- **Success Popup/Modal** showing:
  - Success message "Nộp hồ sơ thành công!"
  - Application number
  - Submission date
  - Summary of submitted information
  - Next steps instructions
  - Button to view application details

Form validation with react-hook-form + yup schema.

#### [NEW] applications/page.tsx

Location: `frontend/src/app/applications/page.tsx`

Application management dashboard:
- **User View** (when logged in with email used for submission):
  - List all applications submitted by this user
  - Display: application number, name, education level, status, submission date
  - **Highlight upcoming appointments** (date, time, location)
  - Status color coding (pending: yellow, reviewing: blue, accepted: green, rejected: red)
  - Filter by status and education level
  - View details button
- **Admin View**:
  - List all applications from all users
  - Same display + filtering
  - Ability to set appointments

#### [NEW] applications/[id]/page.tsx

Location: `frontend/src/app/applications/[id]/page.tsx`

Application detail view:
- Display all application information (personal, contact, education level)
- Status badge and timeline
- **Appointment Information** (if set by admin):
  - Date and time
  - Location
  - Notes/instructions
- Admin notes (if any)
- Edit button (if status = pending, user is owner)

---

### Frontend - Components

#### [NEW] SuccessModal.tsx

Location: `frontend/src/components/SuccessModal.tsx`

Success popup/modal component:
- Modal overlay with animated entrance
- Success icon (checkmark)
- Application number prominently displayed
- Summary of submitted information
- "View My Applications" button
- "Close" button

#### [NEW] ApplicationForm.tsx

Location: `frontend/src/components/ApplicationForm.tsx`

Reusable form component with:
- Single-page form layout with sections
- Form validation with real-time feedback
- Education level dropdown with all options
- Date picker for date of birth
- Success/error notifications

#### [NEW] ApplicationCard.tsx

Location: `frontend/src/components/ApplicationCard.tsx`

Display application summary card:
- Application number
- Applicant name
- Education level
- Status badge with color
- Submission date
- **Appointment badge** (if appointment is set): "Lịch hẹn: [date] [time]"

---

### Frontend - API Integration

#### [NEW] applicationApi.ts

Location: `frontend/src/lib/api/applicationApi.ts`

API service functions:
```typescript
- submitApplication(data)
- getApplications()
- getApplicationById(id)
- updateApplication(id, data)
```

---

### Environment Configuration

#### [MODIFY] .env

Location: `backend/.env`

Add Resend email configuration:
```bash
# Resend Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=admissions@yourdomain.com
```

## Verification Plan

### Backend API Testing
```bash
# Manual API testing with curl or Postman

# 1. Submit application
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{ application data }'

# 2. Get applications
curl -X GET http://localhost:5000/api/applications \
  -H "Authorization: Bearer <token>"

# 3. Get application by ID
curl -X GET http://localhost:5000/api/applications/:id \
  -H "Authorization: Bearer <token>"

# 4. Update application status
curl -X PATCH http://localhost:5000/api/applications/:id/status \
  -H "Authorization: Bearer <token>" \
  -d '{"status": "accepted"}'

# 5. Set appointment
curl -X PATCH http://localhost:5000/api/applications/:id/appointment \
  -H "Authorization: Bearer <token>" \
  -d '{"appointmentDate": "2026-03-15", "appointmentTime": "09:00 - 10:00"}'
```

### End-to-End Flow

1. **User Registration & Login**
   - Register new account → Login
   - Verify authentication working

2. **Submit Application**
   - Navigate to `/submit`
   - Fill out all form fields
   - Submit application
   - **Expected**: Success modal appears with application number

3. **Verify Email Sent**
   - Check email inbox for confirmation email
   - **Expected**: Email received with application number and details

4. **View Applications**
   - Navigate to `/applications`
   - **Expected**: See submitted application in list
   - Verify status shows "pending"

5. **View Application Details**
   - Click on application to view details
   - **Expected**: All information displayed correctly

6. **Set Appointment (Admin)**
   - Admin sets appointment date/time/location
   - **Expected**: Appointment saved, email sent to user

7. **View Appointment**
   - User logs in and checks dashboard
   - **Expected**: See appointment information displayed
