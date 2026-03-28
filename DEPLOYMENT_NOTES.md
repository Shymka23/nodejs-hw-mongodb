# Deployment Notes - HW6

## SMTP Email Functionality

### Local Development
✅ Email sending works perfectly on localhost using Brevo SMTP (port 587 or 465).

### Render.com Production
❌ **Known Issue**: Render.com Free tier blocks outbound SMTP connections on ports 587 and 465.

**Error**: `Connection timeout` when trying to connect to smtp-relay.brevo.com

**Solutions**:
1. Upgrade to Render paid plan (allows SMTP)
2. Use alternative hosting (Heroku, Railway, etc.)
3. Switch to HTTP-based email API (requires code changes, not per assignment requirements)

### Testing Locally
```bash
npm start
curl -X POST http://localhost:3000/auth/send-reset-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

Check your email inbox for password reset link.

### Environment Variables Required
- SMTP_HOST=smtp-relay.brevo.com
- SMTP_PORT=587 (or 465 for SSL)
- SMTP_USER=your_brevo_smtp_login
- SMTP_PASSWORD=your_brevo_smtp_password
- SMTP_FROM=your_registered_email@example.com
- APP_DOMAIN=https://your-domain.com
