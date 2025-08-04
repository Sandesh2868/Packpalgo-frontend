# Quick Email Setup for GoSplit

## Current Status
Right now, the email system shows a test notification instead of sending actual emails. This is for testing purposes.

## To Get Real Emails Working:

### Option 1: EmailJS (Easiest - 5 minutes setup)

1. **Go to [EmailJS.com](https://www.emailjs.com/)**
2. **Sign up for free account**
3. **Add Email Service:**
   - Click "Email Services"
   - Add "Gmail" or "Outlook"
   - Follow the setup steps
4. **Create Email Template:**
   - Click "Email Templates"
   - Create new template
   - Use this template:
   ```
   Subject: You've been invited to join {{group_name}} on GoSplit!
   
   Body:
   Hello!
   
   {{inviter_name}} has invited you to join the travel group "{{group_name}}" on GoSplit.
   
   You can join the group using the invite code: {{invite_code}}
   
   To join:
   1. Go to GoSplit in your app
   2. Click "Join Group"
   3. Enter the invite code: {{invite_code}}
   
   This will allow you to see all the expenses and splits in the group.
   
   Happy traveling!
   The GoSplit Team
   ```
5. **Get Your IDs:**
   - Service ID (from Email Services)
   - Template ID (from Email Templates)
   - User ID (from Account > API Keys)
6. **Create .env file in your project root:**
   ```
   REACT_APP_EMAILJS_SERVICE_ID=your_service_id
   REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
   REACT_APP_EMAILJS_USER_ID=your_user_id
   ```
7. **Restart your development server**

### Option 2: Resend.com (Alternative)

1. **Go to [Resend.com](https://resend.com/)**
2. **Sign up and get API key**
3. **Add to .env file:**
   ```
   REACT_APP_RESEND_API_KEY=re_your_api_key_here
   ```
4. **Restart your development server**

### Option 3: Keep Test Mode (For Now)

If you want to keep the current test notifications:
- The system will show alert boxes with email content
- No setup required
- Good for testing the flow

## Test the Email System:

1. **Create a new group** with your email address
2. **Or invite someone** to an existing group
3. **You should see:**
   - Test notification with email content
   - Console logs showing email details
   - Success message with email status

## What You'll See Now:

When you create a group or invite someone, you'll get a popup like this:
```
📧 Email Notification (Test Mode)

To: your-email@example.com
Subject: You've been invited to join "Goa Trip" on GoSplit!

Hello!

John has created a travel group "Goa Trip" on GoSplit.

You can join the group using the invite code: ABC123

To join:
1. Go to GoSplit in your app
2. Click "Join Group"
3. Enter the invite code: ABC123

This will allow you to see all the expenses and splits in the group.

Happy traveling!
The GoSplit Team

Note: This is a test notification. In production, this would be sent as an actual email.
```

## Next Steps:

1. **Choose an email service** (EmailJS recommended)
2. **Follow the setup steps** above
3. **Test with your email**
4. **Real emails will be sent** instead of test notifications

## Troubleshooting:

- **Check browser console** for email service logs
- **Verify environment variables** are set correctly
- **Restart development server** after adding .env file
- **Check email service dashboard** for delivery status

The email system is working - it just needs to be configured with a real email service to send actual emails instead of showing test notifications.