const CLIENT_URL = process.env.CLIENT_URL
const nodemailer = require("nodemailer");

const sendUserLogInMail = (data) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Login Notification</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif;">
        <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #1e293b; padding: 24px; text-align: center; color: #ffffff;">
                    <h2 style="margin: 0; font-size: 24px;">Ticketeer</h2>
                    <p style="margin: 4px 0 0; font-size: 14px; color: #cbd5e1;">Login Confirmation</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 32px;">
                    <h3 style="color: #0f172a; margin-top: 0;">Hello ${data.name},</h3>
                    <p style="color: #334155; line-height: 1.6;">
                      We're excited to confirm that you've successfully logged in to your account! 🎉
                    </p>

                   <p style="color: #334155; margin-top: 24px;">
                      If you didn’t perform this action, click here to unsubscribe 
                      <div style="margin-top: 30px; text-align: center;">
                      <button  style="background-color: #778C99; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Unsubscribe</button>
                    </div>
                    </p>

                    <div style="margin-top: 30px; text-align: center;">
                      <a href="${CLIENT_URL}/dashboard" style="background-color: #f97316; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Go to Dashboard</a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
                    This message was sent by Ticketeer for login confirmation. <br />
                    Need help? Email us at <a href="mailto:ticketeer01@gmail.com" style="color: #94a3b8;">ticketeer01@gmail.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: `Log-In Confirmation - ${data.name}, Welcome back to Ticketeer!`,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Log-in email sent successfully", data.email);
    }
  });
};

const sendUserRegisterMail = (data) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width" />
      <title>Registration Notification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif;">
      <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);">
              <!-- Header -->
              <tr>
                <td style="background-color: #1e293b; padding: 24px; text-align: center; color: #ffffff;">
                  <h2 style="margin: 0; font-size: 24px;">Ticketeer</h2>
                  <p style="margin: 4px 0 0; font-size: 14px; color: #cbd5e1;">Registration Confirmation</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 32px;">
                  <h3 style="color: #0f172a; margin-top: 0;">Hello ${data.name},</h3>
                  <p style="color: #334155; line-height: 1.6;">
                    We're excited to confirm that you've successfully created an account with us! 🎉
                  </p>

                 <p style="color: #334155; margin-top: 24px;">
                    If you didn’t perform this action, click here to unsubscribe 
                    <div style="margin-top: 30px; text-align: center;">
                    <button  style="background-color: #778C99; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Unsubscribe</button>
                  </div>
                  </p>

                  <div style="margin-top: 30px; text-align: center;">
                    <a href="${CLIENT_URL}/dashboard" style="background-color: #f97316; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Go to Dashboard</a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
                  This message was sent by Ticketeer for registration confirmation. <br />
                  Need help? Email us at <a href="mailto:ticketeer01@gmail.com" style="color: #94a3b8;">ticketeer01@gmail.com</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: `Registration Confirmation - ${data.name}, Welcome back to Ticketeer!`,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Registration email sent successfully", data.email);
    }
  });
};

const sendUserUpdateMail = (data) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width" />
      <title>Profile Update Notification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif;">
      <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);">
              <!-- Header -->
              <tr>
                <td style="background-color: #1e293b; padding: 24px; text-align: center; color: #ffffff;">
                  <h2 style="margin: 0; font-size: 24px;">Ticketeer</h2>
                  <p style="margin: 4px 0 0; font-size: 14px; color: #cbd5e1;">Profile Update Confirmation</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 32px;">
                  <h3 style="color: #0f172a; margin-top: 0;">Hello ${data.name},</h3>
                  <p style="color: #334155; line-height: 1.6;">
                    We're excited to confirm that you've successfully updated your profile information! 🎉
                  </p>

                 <p style="color: #334155; margin-top: 24px;">
                    If you didn’t perform this action, click here to unsubscribe 
                    <div style="margin-top: 30px; text-align: center;">
                    <button  style="background-color: #778C99; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Unsubscribe</button>
                  </div>
                  </p>

                  <div style="margin-top: 30px; text-align: center;">
                    <a href="${CLIENT_URL}/dashboard" style="background-color: #f97316; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Go to Dashboard</a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
                  This message was sent by Ticketeer for profile update confirmation. <br />
                  Need help? Email us at <a href="mailto:ticketeer01@gmail.com" style="color: #94a3b8;">ticketeer01@gmail.com</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: `Profile Update Confirmation!`,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Profile Update email sent successfully", data.email);
    }
  });
};

const sendUserLogoutMail = (data) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Logout Notification</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif;">
        <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #1e293b; padding: 24px; text-align: center; color: #ffffff;">
                    <h2 style="margin: 0; font-size: 24px;">Ticketeer</h2>
                    <p style="margin: 4px 0 0; font-size: 14px; color: #cbd5e1;">Logout Confirmation</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 32px;">
                    <h3 style="color: #0f172a; margin-top: 0;">Hello ${data.name},</h3>
                    <p style="color: #334155; line-height: 1.6;">
                      We're excited to confirm that you've successfully logged out to your account! 🎉
                    </p>

                   <p style="color: #334155; margin-top: 24px;">
                      If you didn’t perform this action, click here to unsubscribe 
                      <div style="margin-top: 30px; text-align: center;">
                      <button  style="background-color: #778C99; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Unsubscribe</button>
                    </div>
                    </p>

                    <div style="margin-top: 30px; text-align: center;">
                      <a href="${CLIENT_URL}/dashboard" style="background-color: #f97316; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Go to Dashboard</a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
                    This message was sent by Ticketeer for logout confirmation. <br />
                    Need help? Email us at <a href="mailto:ticketeer01@gmail.com" style="color: #94a3b8;">ticketeer01@gmail.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: `Logout Confirmation!`,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Logout email sent successfully", data.email);
    }
  });
};

const sendUserDeleteMail = (data) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Account deletion Notification</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif;">
        <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #1e293b; padding: 24px; text-align: center; color: #ffffff;">
                    <h2 style="margin: 0; font-size: 24px;">Ticketeer</h2>
                    <p style="margin: 4px 0 0; font-size: 14px; color: #cbd5e1;">Account deletion Confirmation</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 32px;">
                    <h3 style="color: #0f172a; margin-top: 0;">Hello ${data.name},</h3>
                    <p style="color: #334155; line-height: 1.6;">
                      We're excited to confirm that you've successfully deleted your account! 🎉
                    </p>

                   <p style="color: #334155; margin-top: 24px;">
                      If you didn’t perform this action, click here to unsubscribe 
                      <div style="margin-top: 30px; text-align: center;">
                      <button  style="background-color: #778C99; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Unsubscribe</button>
                    </div>
                    </p>

                    <div style="margin-top: 30px; text-align: center;">
                      <a href="${CLIENT_URL}/dashboard" style="background-color: #f97316; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Go to Dashboard</a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
                    This message was sent by Ticketeer for account deletion confirmation. <br />
                    Need help? Email us at <a href="mailto:ticketeer01@gmail.com" style="color: #94a3b8;">ticketeer01@gmail.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: `Account deletion Confirmation!`,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Account deletion email sent successfully", data.email);
    }
  });
};

module.exports = {sendUserLogInMail, sendUserRegisterMail, sendUserUpdateMail, sendUserLogoutMail, sendUserDeleteMail};