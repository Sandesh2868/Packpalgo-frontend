# Quick Email Setup for GoSplit

## Current Status
You're seeing test notifications because no email service is configured. Here's how to get real emails working:

## Option 1: EmailJS (Easiest - 5 minutes)

### Step 1: Sign up for EmailJS
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email

### Step 2: Add Email Service
1. In EmailJS dashboard, click "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" or "Outlook"
4. Follow the setup steps to connect your email

### Step 3: Create Email Template
1. Click "Email Templates"
2. Click "Create New Template"
3. Use this template:

**Subject:**
```
You've been invited to join {{group_name}} on GoSplit!
```

**Body (HTML):**
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

### Step 4: Get Your IDs
1. **Service ID**: From Email Services page
2. **Template ID**: From Email Templates page  
3. **User ID**: From Account → API Keys page

### Step 5: Add to Your Project
1. Create a `.env` file in your project root (if it doesn't exist)
2. Add these lines:
```
REACT_APP_EMAILJS_SERVICE_ID=your_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id_here
REACT_APP_EMAILJS_USER_ID=your_user_id_here
```
3. Restart your development server

## Option 2: Resend.com (Alternative)

### Step 1: Sign up
1. Go to [Resend.com](https://resend.com/)
2. Create account and get API key

### Step 2: Add to Project
1. Add to `.env` file:
```
REACT_APP_RESEND_API_KEY=re_your_api_key_here
```
2. Restart development server

## Test It

1. Create a group with your email address
2. You should receive a real email instead of a popup
3. Check your email inbox (and spam folder)

## Troubleshooting

- **Still getting popups?** Check that your `.env` file is in the project root
- **No emails received?** Check spam folder and verify API keys
- **Server restart needed?** Always restart after adding environment variables

## Current Behavior

- **With email service configured**: Real emails sent
- **Without email service**: Test notifications shown

The system will automatically detect if you have an email service configured and send real emails when available!