# Email Configuration for Password Reset

## Current Status ✅

The password reset functionality is **fully implemented** and working with email logging. Here's what's working:

- ✅ Forgot password form generates reset tokens
- ✅ Password reset emails are sent (logged to files for development)
- ✅ Reset password page validates tokens and updates passwords
- ✅ Token expiration (60 minutes)
- ✅ Full user flow from forgot password to reset

## Email Delivery Setup

### Option 1: Development (Current - Email Logging)
Emails are currently logged to files instead of being sent. You can view them in:
```
server/storage/logs/laravel.log
```

### Option 2: SMTP Configuration (Real Email)

To send actual emails, update your `.env` file:

```env
# For Gmail/Google Workspace
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@monchezzmoi.com"
MAIL_FROM_NAME="Mon Chez Moi"

# For Mailtrap (Testing)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
```

### Option 3: Mailgun/SendGrid/SES

```env
# Mailgun
MAIL_MAILER=mailgun
MAILGUN_DOMAIN=your-domain.com
MAILGUN_SECRET=your-api-key

# SendGrid
MAIL_MAILER=sendgrid
SENDGRID_API_KEY=your-api-key
```

## Testing the Email System

### 1. Create a Test User
```bash
php artisan tinker
User::create(['name' => 'Test User', 'email' => 'test@example.com', 'password' => Hash::make('password123')]);
```

### 2. Test Forgot Password
1. Go to `/Auth` → Click "Forgot your password?"
2. Enter `test@example.com`
3. Check the email log: `tail -f storage/logs/laravel.log`

### 3. Test Reset Password
1. Copy the reset URL from the email log
2. Paste it in your browser
3. Enter new password
4. Verify password was updated

## Email Template Customization

The email template is located at:
```
server/app/Notifications/PasswordResetNotification.php
```

You can customize the subject, greeting, and message content.

## Production Deployment

For production, ensure:

1. **Environment Variables**: Set real SMTP credentials
2. **Frontend URL**: Update `FRONTEND_URL` to your production domain
3. **Email Verification**: Test with real email addresses
4. **Security**: Use app-specific passwords (not regular passwords)

## Troubleshooting

### Emails Not Sending
- Check `.env` mail configuration
- Verify SMTP credentials
- Check Laravel logs: `php artisan log:tail`

### Reset Links Not Working
- Verify `FRONTEND_URL` is correct
- Check token format in email logs
- Ensure reset password route exists

### Token Expired
- Default expiration is 60 minutes
- Can be changed in `.env`: `AUTH_PASSWORDS_USERS_EXPIRE=120`

## Security Features

- ✅ Tokens are hashed in database
- ✅ Tokens expire after 60 minutes
- ✅ Email validation prevents unauthorized resets
- ✅ Password confirmation required
- ✅ Tokens are single-use (deleted after reset)

The system is production-ready once you configure real SMTP settings!
