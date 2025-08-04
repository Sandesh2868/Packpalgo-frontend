// Email service utility for GoSplit notifications
// This file provides multiple options for sending email notifications

// Option 1: Using EmailJS (requires setup)
export const sendEmailViaEmailJS = async (emailData) => {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.REACT_APP_EMAILJS_SERVICE_ID || 'your_service_id',
        template_id: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'your_template_id',
        user_id: process.env.REACT_APP_EMAILJS_USER_ID || 'your_user_id',
        template_params: emailData
      })
    });

    return response.ok;
  } catch (error) {
    console.error('EmailJS error:', error);
    return false;
  }
};

// Option 2: Using a simple email service (like EmailJS alternative)
export const sendEmailViaSimpleService = async (emailData) => {
  try {
    // You can replace this with any email service API
    const response = await fetch('https://your-email-service.com/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_EMAIL_API_KEY}`
      },
      body: JSON.stringify({
        to: emailData.to_email,
        subject: emailData.subject,
        html: emailData.html_content
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
};

// Option 3: Using mailto link (fallback option)
export const sendEmailViaMailto = (emailData) => {
  const subject = encodeURIComponent(emailData.subject);
  const body = encodeURIComponent(emailData.message);
  const mailtoLink = `mailto:${emailData.to_email}?subject=${subject}&body=${body}`;
  
  window.open(mailtoLink);
  return true;
};

// Option 4: Using a public email API (for testing)
export const sendEmailViaPublicAPI = async (emailData) => {
  try {
    // Using a public email API for testing (you can replace this with your preferred service)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_RESEND_API_KEY || 're_123456789'}` // Replace with actual API key
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
    console.error('Public API error:', error);
    return false;
  }
};

// Option 5: Simple notification (for immediate testing)
export const sendSimpleNotification = (emailData) => {
  // For immediate testing, show a notification with the email content
  const notification = `
📧 Email Notification (Test Mode)

To: ${emailData.to_email}
Subject: ${emailData.subject}

${emailData.message}

Note: This is a test notification. In production, this would be sent as an actual email.
  `;
  
  alert(notification);
  return true;
};

// Main email notification function
export const sendGroupInvitationEmail = async (recipientEmail, groupName, inviterName, inviteCode, isNewGroup = false) => {
  const emailData = {
    to_email: recipientEmail,
    subject: `You've been invited to join "${groupName}" on GoSplit!`,
    group_name: groupName,
    inviter_name: inviterName,
    invite_code: inviteCode,
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

  // For immediate testing, use simple notification
  console.log('Email notification triggered:', {
    recipient: recipientEmail,
    group: groupName,
    inviter: inviterName,
    code: inviteCode
  });

  // Try simple notification first (for testing)
  const simpleNotificationSent = sendSimpleNotification(emailData);
  
  if (simpleNotificationSent) {
    return true;
  }

  // Try EmailJS
  let emailSent = await sendEmailViaEmailJS(emailData);
  
  if (!emailSent) {
    // Try public API
    emailSent = await sendEmailViaPublicAPI(emailData);
  }
  
  if (!emailSent) {
    // Try simple email service
    emailSent = await sendEmailViaSimpleService(emailData);
  }
  
  if (!emailSent) {
    // Fallback to mailto
    console.log('Email services unavailable, using mailto fallback');
    sendEmailViaMailto(emailData);
    return false; // Return false to indicate fallback was used
  }
  
  return emailSent;
};

// Utility function to check if email services are configured
export const isEmailServiceConfigured = () => {
  return !!(process.env.REACT_APP_EMAILJS_SERVICE_ID || 
           process.env.REACT_APP_EMAIL_API_KEY ||
           process.env.REACT_APP_RESEND_API_KEY);
};