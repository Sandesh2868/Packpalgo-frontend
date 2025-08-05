# Email Debugging Guide

## Quick Check

1. **Open Browser Console** (F12 → Console tab)
2. **Create a group** with your email address
3. **Check console logs** for detailed error messages

## Common Issues & Solutions

### Issue 1: "Email services configured: false"

**Problem:** Environment variables not set or not loaded

**Solution:**
1. Create `.env` file in project root:
```
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_USER_ID=your_user_id
```

2. **Restart your development server** after adding `.env`

### Issue 2: "EmailJS configuration missing"

**Problem:** One or more EmailJS IDs are missing

**Solution:**
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Get your IDs:
   - **Service ID**: Email Services → Copy Service ID
   - **Template ID**: Email Templates → Copy Template ID  
   - **User ID**: Account → API Keys → Copy User ID

### Issue 3: "EmailJS API error: 400"

**Problem:** Invalid request to EmailJS API

**Solution:**
1. Check your template variables match exactly:
   - `{{to_email}}`
   - `{{group_name}}`
   - `{{inviter_name}}`
   - `{{invite_code}}`
   - `{{isNewGroup}}`

2. Verify your EmailJS template is published

### Issue 4: "EmailJS API error: 401"

**Problem:** Invalid User ID or API key

**Solution:**
1. Check your User ID is correct
2. Make sure your EmailJS account is active
3. Verify the service is properly connected

## Debug Steps

### Step 1: Check Environment Variables
```javascript
// In browser console, run:
console.log('EmailJS Config:', {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID ? 'Set' : 'Missing',
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID ? 'Set' : 'Missing', 
  userId: process.env.REACT_APP_EMAILJS_USER_ID ? 'Set' : 'Missing'
});
```

### Step 2: Test EmailJS Setup
1. Go to EmailJS Dashboard
2. Click "Test" on your template
3. Fill in test values and send
4. Check if test email arrives

### Step 3: Check Template Variables
Make sure your EmailJS template uses these exact variable names:
- `{{to_email}}`
- `{{group_name}}`
- `{{inviter_name}}`
- `{{invite_code}}`
- `{{isNewGroup}}`

## Console Logs to Look For

**Good logs:**
```
Email services configured: true
Attempting to send via EmailJS...
EmailJS Config: {serviceId: "Set", templateId: "Set", userId: "Set"}
EmailJS Request: {service_id: "...", template_id: "...", user_id: "...", template_params: {...}}
EmailJS Response: 200 OK
Email sent successfully!
```

**Bad logs:**
```
Email services configured: false
EmailJS configuration missing: {serviceId: undefined, templateId: undefined, userId: undefined}
EmailJS API error: 400 Bad Request
```

## Quick Fix Checklist

- [ ] `.env` file exists in project root
- [ ] Environment variables start with `REACT_APP_`
- [ ] Development server restarted after adding `.env`
- [ ] EmailJS account is active
- [ ] Email service is connected
- [ ] Template is published
- [ ] Template variables match exactly
- [ ] User ID is correct

## Still Not Working?

1. **Check spam folder** for test emails
2. **Try a different email service** (Resend.com)
3. **Use test notification mode** for now (remove `.env` file)

The enhanced logging will show exactly where the issue is! 🔍