# Email Template Variables Guide

## Available Variables

Your email template can use these variables that are automatically passed from the GoSplit app:

### Required Variables:
- `{{to_email}}` - Recipient's email address
- `{{group_name}}` - Name of the group
- `{{inviter_name}}` - Name of the person who created/invited
- `{{invite_code}}` - The invite code to join the group

### Conditional Variables:
- `{{isNewGroup}}` - Boolean: `true` if group was just created, `false` if member was invited to existing group

## Your Template Analysis

✅ **Correctly Used Variables:**
- `{{inviter_name}}` ✅
- `{{group_name}}` ✅  
- `{{invite_code}}` ✅
- `{{isNewGroup}}` ✅ (now fixed in the code)

## Updated Email Template

Here's your template with all variables properly mapped:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
  <h2 style="color: #4f46e5;">GoSplit Group Invitation</h2>
  <p>Hello!</p>

  <p>
    <strong>{{inviter_name}}</strong> has 
    {{#if isNewGroup}}
      created a travel group 
    {{else}}
      invited you to join the travel group 
    {{/if}}
    <strong>"{{group_name}}"</strong> on GoSplit.
  </p>

  <p>
    You can join the group using this invite code:
    <strong style="font-size: 18px; color: #4f46e5;">{{invite_code}}</strong>
  </p>

  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0;">To join:</h3>
    <ol>
      <li>Go to GoSplit</li>
      <li>Click "Join Group"</li>
      <li>Enter the invite code: <strong>{{invite_code}}</strong></li>
    </ol>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="https://packpalgopretripp.netlify.app" target="_blank" style="
      background-color: #4f46e5;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      display: inline-block;
    ">Join Now</a>
  </div>

  <p>This will allow you to track expenses and split costs with your group.</p>

  <p style="margin-top: 30px;">
    Happy traveling!<br/>
    <strong>The GoSplit Team</strong>
  </p>
</div>
```

## Environment Variables Required

Make sure your `.env` file has these variables:

```
REACT_APP_EMAILJS_SERVICE_ID=your_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id_here
REACT_APP_EMAILJS_USER_ID=your_user_id_here
```

## Testing

1. Create a group with your email address
2. Check if you receive the email with all variables populated
3. The `{{isNewGroup}}` variable will show different text based on whether it's a new group or invitation

## Troubleshooting

- **Variables not showing?** Check that your EmailJS template uses the exact variable names above
- **Email not sending?** Verify your environment variables are set correctly
- **Template not working?** Make sure you're using Handlebars syntax `{{variable_name}}`

Your template looks perfect! All variables are now properly supported. 🎯