# Email Notification Setup for GoSplit

This guide explains how to set up email notifications for GoSplit group invitations.

## Overview

When users create a group or invite members to an existing group, the system will automatically send email notifications to the invited members with the group's invite code.

## Setup Options

### Option 1: EmailJS (Recommended for beginners)

1. **Sign up for EmailJS**
   - Go to [EmailJS.com](https://www.emailjs.com/)
   - Create a free account

2. **Create an Email Service**
   - In EmailJS dashboard, go to "Email Services"
   - Add a new service (Gmail, Outlook, etc.)
   - Follow the setup instructions

3. **Create an Email Template**
   - Go to "Email Templates"
   - Create a new template with the following variables:
     - `{{to_email}}` - Recipient email
     - `{{group_name}}` - Group name
     - `{{inviter_name}}` - Name of person who invited them
     - `{{invite_code}}` - Group invite code

4. **Get Your Credentials**
   - Note down your Service ID, Template ID, and User ID

5. **Set Environment Variables**
   Create a `.env` file in your project root:
   ```
   REACT_APP_EMAILJS_SERVICE_ID=your_service_id
   REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
   REACT_APP_EMAILJS_USER_ID=your_user_id
   ```

### Option 2: Custom Email Service

1. **Choose an Email Service**
   - SendGrid, Mailgun, AWS SES, etc.

2. **Set up API Key**
   - Get your API key from the service
   - Add to environment variables:
   ```
   REACT_APP_EMAIL_API_KEY=your_api_key
   ```

3. **Update the Email Service URL**
   - In `src/utils/emailService.js`, update the URL in `sendEmailViaSimpleService`

### Option 3: Firebase Functions (Advanced)

1. **Set up Firebase Functions**
   ```bash
   npm install -g firebase-tools
   firebase init functions
   ```

2. **Create Email Function**
   ```javascript
   // functions/index.js
   const functions = require('firebase-functions');
   const nodemailer = require('nodemailer');

   exports.sendGroupInvitation = functions.firestore
     .document('groups/{groupId}')
     .onCreate(async (snap, context) => {
       // Email sending logic here
     });
   ```

3. **Deploy Functions**
   ```bash
   firebase deploy --only functions
   ```

## Email Template Example

Here's a sample email template for EmailJS:

**Subject:** You've been invited to join "{{group_name}}" on GoSplit!

**Body:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #4f46e5;">GoSplit Group Invitation</h2>
  <p>Hello!</p>
  <p><strong>{{inviter_name}}</strong> has invited you to join the travel group <strong>"{{group_name}}"</strong> on GoSplit.</p>
  <p>You can join the group using the invite code: <strong style="font-size: 18px; color: #4f46e5;">{{invite_code}}</strong></p>
  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0;">To join:</h3>
    <ol>
      <li>Go to GoSplit in your app</li>
      <li>Click "Join Group"</li>
      <li>Enter the invite code: <strong>{{invite_code}}</strong></li>
    </ol>
  </div>
  <p>This will allow you to see all the expenses and splits in the group.</p>
  <p>Happy traveling!<br>The GoSplit Team</p>
</div>
```

## Testing

1. **Test Email Service**
   - Create a test group with your email
   - Check if you receive the invitation email

2. **Check Console Logs**
   - Open browser developer tools
   - Look for email service logs in the console

3. **Fallback Testing**
   - If email services fail, the system will use mailto links as fallback

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check environment variables are set correctly
   - Verify EmailJS credentials
   - Check browser console for errors

2. **CORS Issues**
   - EmailJS handles CORS automatically
   - For custom services, ensure CORS is configured

3. **Rate Limiting**
   - EmailJS free tier has limits
   - Consider upgrading for production use

### Debug Mode

Add this to your code to see detailed logs:
```javascript
// In emailService.js
console.log('Email service configuration:', {
  emailjs: !!process.env.REACT_APP_EMAILJS_SERVICE_ID,
  custom: !!process.env.REACT_APP_EMAIL_API_KEY
});
```

## Security Considerations

1. **API Keys**
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys regularly

2. **Email Validation**
   - Validate email addresses before sending
   - Implement rate limiting
   - Add spam protection

3. **Privacy**
   - Only send emails to verified addresses
   - Include unsubscribe options
   - Comply with email regulations (CAN-SPAM, GDPR)

## Production Deployment

1. **Environment Variables**
   - Set up environment variables in your hosting platform
   - Use production email service credentials

2. **Monitoring**
   - Set up email delivery monitoring
   - Track bounce rates and failures

3. **Backup Plan**
   - Ensure mailto fallback works
   - Have manual invitation process as backup

## Support

If you need help setting up email notifications:

1. Check the EmailJS documentation
2. Review Firebase Functions documentation
3. Test with a simple email service first
4. Use the mailto fallback for immediate testing

The email notification system is designed to be robust with multiple fallback options, so even if one method fails, users can still receive invitations through alternative means.