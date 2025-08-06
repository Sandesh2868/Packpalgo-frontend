// Email service utility for GoSplit notifications (Direct hardcoded keys for testing)

// ======== CONFIGURATION (replace with your actual values) =========
const EMAILJS_SERVICE_ID = 'service_pcv2e9b';
const EMAILJS_TEMPLATE_ID = 'template_xvo13i2';
const EMAILJS_USER_ID = 'r111Q3ncr8hS9oqra';

const RESEND_API_KEY = 're_123456789'; // Replace with actual key
const SIMPLE_EMAIL_API_KEY = 'your_simple_email_key'; // Optional
// ===================================================================

// Option 1: Using EmailJS
export const sendEmailViaEmailJS = async (emailData) => {
  try {
    const requestBody = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_USER_ID,
      template_params: emailData
    };

    console.log('EmailJS Request:', requestBody);

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log('EmailJS Response:', response.status, responseText);

    if (!response.ok) {
      alert('EmailJS API error: ' + response.status + ' ' + responseText);
      return false;
    }

    return true;
  } catch (error) {
    alert('EmailJS error: ' + error.message);
    return false;
  }
};

// Option 2: Using another service
export const sendEmailViaSimpleService = async (emailData) => {
  try {
    const response = await fetch('https://your-email-service.com/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SIMPLE_EMAIL_API_KEY}`
      },
      body: JSON.stringify({
        to: emailData.to_email,
        subject: emailData.subject,
        html: emailData.html_content
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Simple Email Service error:', error);
    return false;
  }
};

// Option 3: Mailto fallback
export const sendEmailViaMailto = (emailData) => {
  const subject = encodeURIComponent(emailData.subject);
  const body = encodeURIComponent(emailData.message);
  const mailtoLink = `mailto:${emailData.to_email}?subject=${subject}&body=${body}`;
  
  window.open(mailtoLink);
  return true;
};

// Option 4: Using Resend API
export const sendEmailViaPublicAPI = async (emailData) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'noreply@gosplit.com',
        to: emailData.to_email,
        subject: emailData.subject,
        html: emailData.html_content
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Resend API error:', error);
    return false;
  }
};

// Option 5: Simple alert (test mode)
export const sendSimpleNotification = (emailData) => {
  const notification = `
📧 Email Notification (Test Mode)

To: ${emailData.to_email}
Subject: ${emailData.subject}

${emailData.message}
  `;
  
  alert(notification);
  return true;
};


// Main email trigger function
export const sendGroupInvitationEmail = async (recipientEmail, groupName, inviterName, inviteCode, isNewGroup = false) => {
  const emailData = {
    to_email: recipientEmail,
    subject: `You've been invited to join "${groupName}" on GoSplit!`,
    group_name: groupName,
    inviter_name: inviterName,
    invite_code: inviteCode,
    isNewGroup: isNewGroup,
    message: `
Hello!

${inviterName} has ${isNewGroup ? 'created a travel group' : 'invited you to join the travel group'} "${groupName}" on GoSplit.

You can join the group using the invite code: ${inviteCode}

To join:
1. Go to GoSplit in your app
2. Click "Join Group"
3. Enter the invite code: ${inviteCode}

This will allow you to see all the expenses and splits in the group.

Happy traveling!
The GoSplit Team
    `,
    html_content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">GoSplit Group Invitation</h2>
        <p>Hello!</p>
        <p><strong>${inviterName}</strong> has ${isNewGroup ? 'created a travel group' : 'invited you to join the travel group'} <strong>"${groupName}"</strong> on GoSplit.</p>
        <p>You can join the group using the invite code: <strong style="font-size: 18px; color: #4f46e5;">${inviteCode}</strong></p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">To join:</h3>
          <ol>
            <li>Go to GoSplit in your app</li>
            <li>Click "Join Group"</li>
            <li>Enter the invite code: <strong>${inviteCode}</strong></li>
          </ol>
        </div>
        <p>This will allow you to see all the expenses and splits in the group.</p>
        <p>Happy traveling!<br>The GoSplit Team</p>
      </div>
    `
  };

  console.log('Email triggered:', { recipientEmail, groupName, inviterName, inviteCode });

  // Check if email services are configured
  const emailServicesConfigured = isEmailServiceConfigured();
  console.log('Email services configured:', emailServicesConfigured);
  
  // Try EmailJS first (if configured)
  let emailSent = false;
  if (emailServicesConfigured) {
    console.log('Attempting to send via EmailJS...');
    emailSent = await sendEmailViaEmailJS(emailData);
    console.log('EmailJS result:', emailSent);
  }
  
  if (!emailSent && emailServicesConfigured) {
    console.log('Attempting to send via Resend API...');
    emailSent = await sendEmailViaPublicAPI(emailData);
    console.log('Resend API result:', emailSent);
  }
  
  if (!emailSent && emailServicesConfigured) {
    console.log('Attempting to send via Simple Email Service...');
    emailSent = await sendEmailViaSimpleService(emailData);
    console.log('Simple Email Service result:', emailSent);
  }
  
  if (!emailSent) {
    // If no email services configured or all failed, show test notification
    console.log('All email services failed, showing test notification');
    sendSimpleNotification(emailData);
    return false; // Return false to indicate test notification was used
  }
  
  console.log('Email sent successfully!');
  return emailSent;
};

// Email service config checker (optional)
export const isEmailServiceConfigured = () => {
  return !!(EMAILJS_SERVICE_ID || SIMPLE_EMAIL_API_KEY || RESEND_API_KEY);
};

// Test function to verify email configuration
export const testEmailConfiguration = () => {
  console.log('=== Email Configuration Test ===');
  console.log('EmailJS Service ID:', EMAILJS_SERVICE_ID);
  console.log('EmailJS Template ID:', EMAILJS_TEMPLATE_ID);
  console.log('EmailJS User ID:', EMAILJS_USER_ID);
  console.log('Resend API Key:', RESEND_API_KEY ? 'Set' : 'Not Set');
  console.log('Simple Email API Key:', SIMPLE_EMAIL_API_KEY ? 'Set' : 'Not Set');
  console.log('Email Services Configured:', isEmailServiceConfigured());
  console.log('================================');
  
  return {
    emailjsConfigured: !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_USER_ID),
    resendConfigured: !!RESEND_API_KEY,
    simpleEmailConfigured: !!SIMPLE_EMAIL_API_KEY,
    anyServiceConfigured: isEmailServiceConfigured()
  };
};
