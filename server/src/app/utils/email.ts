import nodemailer from 'nodemailer';

const createTransporter = () => {
  const host = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT?.trim() || '587');
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.SMTP_FROM?.trim() || 'LuxeSpace <concierge@luxespace.com>';

  if (!user || !pass) {
    console.warn('⚠️ SMTP credentials not configured. Emails will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

const transporter = createTransporter();

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) => {
  if (!transporter) {
    console.log('📧 Email skipped (no SMTP config):', { to, subject });
    return false;
  }

  const from = process.env.SMTP_FROM?.trim() || 'LuxeSpace <concierge@luxespace.com>';
  
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });
    console.log('✅ Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};

export const sendContactConfirmation = async (email: string, name: string) => {
  const subject = 'Thank you for contacting LuxeSpace';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #c9a74d 0%, #d4af37 100%); padding: 40px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { padding: 40px; }
        .content h2 { color: #1a1a2e; margin-top: 0; }
        .content p { color: #666; line-height: 1.6; }
        .button { display: inline-block; background: #c9a74d; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: bold; }
        .footer { padding: 20px 40px; background: #f8f9fa; text-align: center; color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LuxeSpace</h1>
        </div>
        <div class="content">
          <h2>Dear ${name},</h2>
          <p>Thank you for reaching out to us. We have received your inquiry and our premium concierge team is reviewing your message.</p>
          <p>You can expect a personalized response within <strong>2 business hours</strong>. For urgent matters, please call our direct line.</p>
          <a href="https://luxespace.com" class="button">Explore Properties</a>
        </div>
        <div class="footer">
          <p>LuxeSpace | Premium Real Estate Network | Bangladesh</p>
          <p>This is an automated response. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  sendEmail({ to: email, subject, html }).catch(console.error);
};

export const sendReplyEmail = async (email: string, name: string, reply: string, subject: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #c9a74d 0%, #d4af37 100%); padding: 40px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { padding: 40px; }
        .content h2 { color: #1a1a2e; margin-top: 0; }
        .content p { color: #666; line-height: 1.6; }
        .reply-box { background: #f8f9fa; border-left: 4px solid #c9a74d; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .footer { padding: 20px 40px; background: #f8f9fa; text-align: center; color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LuxeSpace</h1>
        </div>
        <div class="content">
          <h2>Re: ${subject}</h2>
          <p>Dear ${name},</p>
          <div class="reply-box">
            <p>${reply}</p>
          </div>
          <p>Thank you for choosing LuxeSpace. We look forward to assisting you.</p>
          <p>Warm regards,<br/>LuxeSpace Concierge Team</p>
        </div>
        <div class="footer">
          <p>LuxeSpace | Premium Real Estate Network | Bangladesh</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  sendEmail({ to: email, subject: `Re: ${subject}`, html }).catch(console.error);
};