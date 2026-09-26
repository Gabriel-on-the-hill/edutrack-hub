// lib/email.js
// Email service using Resend for transactional emails

import { Resend } from 'resend';
import { SITE_URL } from './site';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || 'EduTrack Hub <noreply@edutrackhub.com>';

/**
 * Send an email using Resend
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 * @returns {Promise<Object>} - Result of the email send
 */
export async function sendEmail({ to, subject, html, text }) {
  if (!resend) {
    console.log('[Email] Resend not configured. Would send to:', to, 'Subject:', subject);
    return { success: true, message: 'Email skipped (Resend not configured)' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    });
    console.log('[Email] Sent successfully to:', to);
    return { success: true, data: result };
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

const baseStyles = `
  font-family: 'Helvetica Neue', Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #f8fafc;
`;

const buttonStyles = `
  display: inline-block;
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
  color: white;
  padding: 16px 32px;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 16px;
`;

const cardStyles = `
  background: white;
  border-radius: 16px;
  padding: 40px;
  margin: 20px 0;
`;

/**
 * Welcome email for new signups
 */
export function welcomeEmailTemplate(name) {
  return `
    <div style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 28px; font-weight: bold;">E</span>
          </div>
        </div>
        
        <h1 style="color: #0f172a; font-size: 28px; margin-bottom: 16px; text-align: center;">
          Welcome to EduTrack Hub! 🎉
        </h1>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Hi ${name},
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          You've just taken the first step toward transforming your learning journey. 
          We're thrilled to have you join our global community of students.
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
          Here's what you can do next:
        </p>
        
        <ul style="color: #475569; font-size: 16px; line-height: 1.8; margin-bottom: 32px; padding-left: 20px;">
          <li>Browse our upcoming classes</li>
          <li>Book your free consultation and assessment class</li>
          <li>Check out our free resources</li>
        </ul>
        
        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${SITE_URL}/classes" style="${buttonStyles}">
            Browse Classes
          </a>
        </div>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          Learn boldly. Grow endlessly.
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 8px;">
          — Gabriel & the EduTrack Hub Team
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 14px;">
        <p>© ${new Date().getFullYear()} EduTrack Hub. All rights reserved.</p>
        <p style="margin-top: 8px;">
          <a href="${SITE_URL}/privacy" style="color: #14b8a6; text-decoration: none;">Privacy Policy</a>
          &nbsp;|&nbsp;
          <a href="${SITE_URL}/terms" style="color: #14b8a6; text-decoration: none;">Terms of Service</a>
        </p>
      </div>
    </div>
  `;
}

/**
 * Enrollment confirmation email
 */
export function enrollmentConfirmationTemplate(name, className, classDate, classTime) {
  return `
    <div style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 28px; font-weight: bold;">E</span>
          </div>
        </div>
        
        <h1 style="color: #0f172a; font-size: 28px; margin-bottom: 16px; text-align: center;">
          You're Enrolled! ✅
        </h1>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Hi ${name},
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Great news! Your spot in the following class is confirmed:
        </p>
        
        <div style="background: #f0fdfa; border: 2px solid #14b8a6; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="color: #0f172a; font-size: 20px; margin: 0 0 16px 0;">${className}</h2>
          <p style="color: #475569; font-size: 16px; margin: 0;">
            📅 <strong>${classDate}</strong><br>
            🕐 <strong>${classTime}</strong>
          </p>
        </div>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          <strong>What's next?</strong>
        </p>
        
        <ul style="color: #475569; font-size: 16px; line-height: 1.8; margin-bottom: 32px; padding-left: 20px;">
          <li>You'll receive a Google Meet link 1 hour before class</li>
          <li>Class recording will be available within 24 hours after</li>
          <li>Come prepared with questions!</li>
        </ul>
        
        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${SITE_URL}/dashboard/student" style="${buttonStyles}">
            View My Classes
          </a>
        </div>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          See you in class!<br>
          — Gabriel & the EduTrack Hub Team
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 14px;">
        <p>© ${new Date().getFullYear()} EduTrack Hub. All rights reserved.</p>
      </div>
    </div>
  `;
}

/**
 * Class reminder email (24h before)
 */
export function classReminderTemplate(name, className, classDate, classTime) {
  return `
    <div style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 28px;">⏰</span>
          </div>
        </div>
        
        <h1 style="color: #0f172a; font-size: 28px; margin-bottom: 16px; text-align: center;">
          Your Class is Tomorrow!
        </h1>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Hi ${name},
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Just a friendly reminder that your class is coming up:
        </p>
        
        <div style="background: #fffbeb; border: 2px solid #f59e0b; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="color: #0f172a; font-size: 20px; margin: 0 0 16px 0;">${className}</h2>
          <p style="color: #475569; font-size: 16px; margin: 0;">
            📅 <strong>${classDate}</strong><br>
            🕐 <strong>${classTime}</strong>
          </p>
        </div>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          <strong>Before class:</strong>
        </p>
        
        <ul style="color: #475569; font-size: 16px; line-height: 1.8; margin-bottom: 32px; padding-left: 20px;">
          <li>Test your camera and microphone</li>
          <li>Find a quiet place with good internet</li>
          <li>Have paper and pen ready for notes</li>
          <li>Prepare any questions you have</li>
        </ul>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          You'll receive the Google Meet link 1 hour before class.
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 24px;">
          See you soon!<br>
          — Gabriel & the EduTrack Hub Team
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 14px;">
        <p>© ${new Date().getFullYear()} EduTrack Hub. All rights reserved.</p>
      </div>
    </div>
  `;
}

/**
 * Class link email (1h before)
 */
export function classLinkTemplate(name, className, meetUrl) {
  return `
    <div style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 28px;">🎬</span>
          </div>
        </div>
        
        <h1 style="color: #0f172a; font-size: 28px; margin-bottom: 16px; text-align: center;">
          Your Class Starts in 1 Hour!
        </h1>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Hi ${name},
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          <strong>${className}</strong> is starting soon. Here's your link to join:
        </p>
        
        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${meetUrl}" style="${buttonStyles}; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);">
            Join Class Now
          </a>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px; text-align: center; margin-bottom: 24px;">
          Or copy this link: ${meetUrl}
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          See you in class!<br>
          — Gabriel
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 14px;">
        <p>© ${new Date().getFullYear()} EduTrack Hub. All rights reserved.</p>
      </div>
    </div>
  `;
}

/**
 * Contact form notification to admin
 */
export function contactFormAdminTemplate(name, email, phone, subject, message) {
  return `
    <div style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 28px;">📬</span>
          </div>
        </div>
        
        <h1 style="color: #0f172a; font-size: 28px; margin-bottom: 16px; text-align: center;">
          New Contact Form Submission
        </h1>
        
        <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 100px;">Name:</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 16px; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email:</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 16px;">
                <a href="mailto:${email}" style="color: #14b8a6;">${email}</a>
              </td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Phone:</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 16px;">${phone}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Subject:</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 16px; font-weight: 500;">${subject}</td>
            </tr>
          </table>
        </div>
        
        <div style="margin-bottom: 24px;">
          <p style="color: #64748b; font-size: 14px; margin-bottom: 8px;">Message:</p>
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
        
        <div style="text-align: center;">
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="${buttonStyles}">
            Reply to ${name.split(' ')[0]}
          </a>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 14px;">
        <p>This message was sent via the EduTrack Hub contact form.</p>
      </div>
    </div>
  `;
}

/**
 * Contact form confirmation to sender
 */
export function contactFormConfirmationTemplate(name) {
  return `
    <div style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 28px;">✉️</span>
          </div>
        </div>
        
        <h1 style="color: #0f172a; font-size: 28px; margin-bottom: 16px; text-align: center;">
          We Got Your Message!
        </h1>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Hi ${name},
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Thank you for reaching out to EduTrack Hub! We've received your message and will get back to you within 24 hours.
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          In the meantime, you can:
        </p>
        
        <ul style="color: #475569; font-size: 16px; line-height: 1.8; margin-bottom: 32px; padding-left: 20px;">
          <li>Browse our <a href="${SITE_URL}/classes" style="color: #14b8a6;">upcoming classes</a></li>
          <li>Check out our <a href="${SITE_URL}/faq" style="color: #14b8a6;">FAQ</a> for quick answers</li>
          <li>Message us on WhatsApp for faster response</li>
        </ul>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          Talk soon!<br>
          — Gabriel & the EduTrack Hub Team
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 14px;">
        <p>© ${new Date().getFullYear()} EduTrack Hub. All rights reserved.</p>
      </div>
    </div>
  `;
}

/**
 * Password reset email
 */
export function passwordResetTemplate(name, resetUrl) {
  return `
    <div style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 28px;">🔐</span>
          </div>
        </div>
        
        <h1 style="color: #0f172a; font-size: 28px; margin-bottom: 16px; text-align: center;">
          Reset Your Password
        </h1>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Hi ${name},
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          We received a request to reset your password for your EduTrack Hub account. Click the button below to create a new password:
        </p>
        
        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${resetUrl}" style="${buttonStyles}; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
            Reset Password
          </a>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px; text-align: center; margin-bottom: 24px;">
          Or copy this link: ${resetUrl}
        </p>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <p style="color: #92400e; font-size: 14px; margin: 0;">
            ⚠️ This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
          </p>
        </div>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          — EduTrack Hub Team
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 14px;">
        <p>© ${new Date().getFullYear()} EduTrack Hub. All rights reserved.</p>
      </div>
    </div>
  `;
}

/**
 * Lead Magnet Delivery
 */
export function leadMagnetTemplate(name) {
  return `
    <div style="${baseStyles}">
      <div style="${cardStyles}">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 28px;">🎁</span>
          </div>
        </div>
        
        <h1 style="color: #0f172a; font-size: 28px; margin-bottom: 16px; text-align: center;">
          Here is your Free Guide!
        </h1>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Hi ${name},
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Thanks for requesting <strong>The Ultimate SAT Math Cheat Sheet</strong>. It's packed with the key formulas and Desmos strategies to help you work faster and avoid common mistakes on the Digital SAT.
        </p>
        
        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${SITE_URL}/resources/SAT-Math-Cheat-Sheet.pdf" style="${buttonStyles}; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);">
            Download PDF
          </a>
        </div>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
           <strong>Want to see these concepts in action?</strong><br>
           Gabriel teaches a live class every week. Come sit in on a session for free.
        </p>
        
        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${SITE_URL}/classes" style="color: #8b5cf6; font-weight: 600; text-decoration: none;">
            View Class Schedule &rarr;
          </a>
        </div>

        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          Happy Studying!<br>
          — The EduTrack Hub Team
        </p>
      </div>
      
       <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 14px;">
        <p>© ${new Date().getFullYear()} EduTrack Hub. All rights reserved.</p>
      </div>
    </div>
  `;
}

export default {
  sendEmail,
  welcomeEmailTemplate,
  enrollmentConfirmationTemplate,
  classReminderTemplate,
  classLinkTemplate,
  contactFormAdminTemplate,
  contactFormConfirmationTemplate,
  passwordResetTemplate,
  leadMagnetTemplate,
};
