const verificationEmailTemplate = (user, verificationUrl) => `
<!DOCTYPE html>
<html>
<head>
    <title>Verify Your Email - Ticketeer</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

    <h2 style="color: #2C3E50;">Hello, {{user.name}}!</h2>

    <p>Welcome to <strong>Ticketeer</strong>! Before you can access your tickets, please verify your email address.</p>

    <p>Click the button below to verify your account:</p>

    <p style="text-align: center;">
        <a href="{{verificationUrl}}" 
           style="background-color: #007BFF; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify My Email
        </a>
    </p>

    <p>If you did not sign up for Ticketeer, please ignore this email.</p>

    <hr>

    <p style="font-size: 14px; color: #888;">If the button above doesn’t work, you can copy and paste the following link into your browser:</p>
    <p style="word-break: break-all;">{{verificationUrl}}</p>

    <p>Thank you,<br>
    <strong>Ticketeer Team</strong></p>

</body>
</html>`

module.exports = verificationEmailTemplate;