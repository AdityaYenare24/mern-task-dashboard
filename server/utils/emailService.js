import * as Brevo from '@getbrevo/brevo';

const getClient = () => {
  const client = new Brevo.TransactionalEmailsApi();
  client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
  return client;
};

export const sendWelcomeEmail = async (name, email) => {
  try {
    const client = getClient();
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = '👋 Welcome to TaskBoard!';
    sendSmtpEmail.to = [{ email, name }];
    sendSmtpEmail.sender = { name: 'TaskBoard', email: 'a46940001@smtp-brevo.com' };
    sendSmtpEmail.htmlContent = `
      <div style="font-family:monospace;background:#0d0f14;color:#e8eaf0;padding:32px;border-radius:12px;max-width:480px;">
        <h1 style="color:#f59e0b;">Welcome, ${name}! 🎉</h1>
        <p style="color:#9ca3af;">Your TaskBoard account has been created successfully.</p>
        <a href="https://mern-task-dashboard.vercel.app/dashboard"
           style="display:inline-block;background:#f59e0b;color:#000;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px;">
          Go to Dashboard →
        </a>
      </div>`;
    await client.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Welcome email sent to:', email);
  } catch (error) {
    console.error('❌ Welcome email error:', error.message);
  }
};

export const sendTaskCreatedEmail = async (name, email, task) => {
  try {
    const client = getClient();
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `✅ New Task Created: ${task.title}`;
    sendSmtpEmail.to = [{ email, name }];
    sendSmtpEmail.sender = { name: 'TaskBoard', email: 'a46940001@smtp-brevo.com' };
    sendSmtpEmail.htmlContent = `
      <div style="font-family:monospace;background:#0d0f14;color:#e8eaf0;padding:32px;border-radius:12px;max-width:480px;">
        <h1 style="color:#f59e0b;font-size:20px;">New Task Created</h1>
        <div style="background:#13161e;border:1px solid #2a2f3d;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="color:#fff;font-size:16px;margin:0 0 8px;"><strong>${task.title}</strong></p>
          <p style="color:#9ca3af;margin:0 0 8px;">${task.description || 'No description'}</p>
          <p style="color:#6b7280;font-size:12px;margin:0;">
            Priority: <span style="color:#f59e0b">${task.priority}</span> &nbsp;|&nbsp;
            Status: <span style="color:#3b82f6">${task.status}</span>
          </p>
        </div>
        <a href="https://mern-task-dashboard.vercel.app/dashboard"
           style="display:inline-block;background:#f59e0b;color:#000;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
          View Dashboard →
        </a>
      </div>`;
    await client.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Task created email sent to:', email);
  } catch (error) {
    console.error('❌ Task created email error:', error.message);
  }
};

export const sendTaskCompletedEmail = async (name, email, task) => {
  try {
    const client = getClient();
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `🎉 Task Completed: ${task.title}`;
    sendSmtpEmail.to = [{ email, name }];
    sendSmtpEmail.sender = { name: 'TaskBoard', email: 'a46940001@smtp-brevo.com' };
    sendSmtpEmail.htmlContent = `
      <div style="font-family:monospace;background:#0d0f14;color:#e8eaf0;padding:32px;border-radius:12px;max-width:480px;">
        <h1 style="color:#10b981;font-size:20px;">🎉 Task Completed!</h1>
        <p style="color:#9ca3af;">Great work, ${name}! You completed:</p>
        <div style="background:#13161e;border:1px solid #10b981;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="color:#fff;font-size:16px;margin:0;"><strong>${task.title}</strong></p>
        </div>
        <a href="https://mern-task-dashboard.vercel.app/dashboard"
           style="display:inline-block;background:#10b981;color:#000;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
          View Dashboard →
        </a>
      </div>`;
    await client.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Task completed email sent to:', email);
  } catch (error) {
    console.error('❌ Task completed email error:', error.message);
  }
};