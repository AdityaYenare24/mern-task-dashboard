import nodemailer from 'nodemailer';

// ── Create transporter lazily inside each function ─────────────────────────
// This ensures process.env variables are already loaded by dotenv
// before the transporter is created. Fixes "Missing credentials" error.
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendWelcomeEmail = async (name, email) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"TaskBoard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '👋 Welcome to TaskBoard!',
      html: `
        <div style="font-family: monospace; background: #0d0f14; color: #e8eaf0; padding: 32px; border-radius: 12px; max-width: 480px;">
          <h1 style="color: #f59e0b;">Welcome, ${name}! 🎉</h1>
          <p style="color: #9ca3af;">Your TaskBoard account has been created successfully.</p>
          <a href="http://localhost:5173/dashboard"
             style="display:inline-block; background:#f59e0b; color:#000; padding:10px 24px;
                    border-radius:8px; text-decoration:none; font-weight:bold; margin-top:16px;">
            Go to Dashboard →
          </a>
        </div>
      `,
    });
    console.log('✅ Welcome email sent to:', email);
  } catch (error) {
    console.error('❌ Welcome email error:', error.message);
  }
};

export const sendTaskCreatedEmail = async (name, email, task) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"TaskBoard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ New Task Created: ${task.title}`,
      html: `
        <div style="font-family: monospace; background: #0d0f14; color: #e8eaf0; padding: 32px; border-radius: 12px; max-width: 480px;">
          <h1 style="color: #f59e0b; font-size: 20px;">New Task Created</h1>
          <div style="background: #13161e; border: 1px solid #2a2f3d; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color:#fff; font-size:16px; margin:0 0 8px;"><strong>${task.title}</strong></p>
            <p style="color:#9ca3af; margin:0 0 8px;">${task.description || 'No description'}</p>
            <p style="color:#6b7280; font-size:12px; margin:0;">
              Priority: <span style="color:#f59e0b">${task.priority}</span> &nbsp;|&nbsp;
              Status: <span style="color:#3b82f6">${task.status}</span>
            </p>
          </div>
          <a href="http://localhost:5173/dashboard"
             style="display:inline-block; background:#f59e0b; color:#000; padding:10px 24px;
                    border-radius:8px; text-decoration:none; font-weight:bold;">
            View Dashboard →
          </a>
        </div>
      `,
    });
    console.log('✅ Task created email sent to:', email);
  } catch (error) {
    console.error('❌ Task created email error:', error.message);
  }
};

export const sendTaskCompletedEmail = async (name, email, task) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"TaskBoard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎉 Task Completed: ${task.title}`,
      html: `
        <div style="font-family: monospace; background: #0d0f14; color: #e8eaf0; padding: 32px; border-radius: 12px; max-width: 480px;">
          <h1 style="color: #10b981; font-size: 20px;">🎉 Task Completed!</h1>
          <p style="color: #9ca3af;">Great work, ${name}! You completed:</p>
          <div style="background: #13161e; border: 1px solid #10b981; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color:#fff; font-size:16px; margin:0;"><strong>${task.title}</strong></p>
          </div>
          <a href="http://localhost:5173/dashboard"
             style="display:inline-block; background:#10b981; color:#000; padding:10px 24px;
                    border-radius:8px; text-decoration:none; font-weight:bold;">
            View Dashboard →
          </a>
        </div>
      `,
    });
    console.log('✅ Task completed email sent to:', email);
  } catch (error) {
    console.error('❌ Task completed email error:', error.message);
  }
};