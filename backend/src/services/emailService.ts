import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
    console.warn('⚠️ RESEND_API_KEY is missing. Email functionality will be disabled.');
}
const resend = new Resend(resendApiKey || 'dummy_key');

export const sendApplicationConfirmation = async (email: string, applicationData: any) => {
    try {
        const { applicationNumber, fullName } = applicationData;

        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: `Application Received - ${applicationNumber}`,
            html: `
        <h1>Application Received</h1>
        <p>Dear ${fullName},</p>
        <p>Your application has been received successfully.</p>
        <p><strong>Application Number:</strong> ${applicationNumber}</p>
        <p>We will review your application and get back to you soon.</p>
        <p>Best regards,<br/>Admissions Team</p>
      `,
        });
        console.log(`Confirmation email sent to ${email}`);
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
};

export const sendStatusUpdateNotification = async (email: string, applicationData: any, newStatus: string) => {
    try {
        const { applicationNumber, fullName } = applicationData;

        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: `Application Status Updated - ${applicationNumber}`,
            html: `
        <h1>Application Status Updated</h1>
        <p>Dear ${fullName},</p>
        <p>Your application status has been updated to: <strong>${newStatus.toUpperCase()}</strong></p>
        ${applicationData.reviewNotes ? `<p><strong>Notes:</strong> ${applicationData.reviewNotes}</p>` : ''}
        <p>Best regards,<br/>Admissions Team</p>
      `,
        });
        console.log(`Status update email sent to ${email}`);
    } catch (error) {
        console.error('Error sending status update email:', error);
    }
};

export const sendAppointmentNotification = async (email: string, applicationData: any) => {
    try {
        const { applicationNumber, fullName, appointmentDate, appointmentTime, appointmentLocation } = applicationData;

        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: `Appointment Scheduled - ${applicationNumber}`,
            html: `
        <h1>Appointment Scheduled</h1>
        <p>Dear ${fullName},</p>
        <p>An appointment has been scheduled for your application ${applicationNumber}:</p>
        <ul>
          <li><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${appointmentTime}</li>
          <li><strong>Location:</strong> ${appointmentLocation || 'Main Office'}</li>
        </ul>
        ${applicationData.appointmentNotes ? `<p><strong>Instructions:</strong> ${applicationData.appointmentNotes}</p>` : ''}
        <p>Best regards,<br/>Admissions Team</p>
      `,
        });
        console.log(`Appointment email sent to ${email}`);
    } catch (error) {
        console.error('Error sending appointment email:', error);
    }
};
