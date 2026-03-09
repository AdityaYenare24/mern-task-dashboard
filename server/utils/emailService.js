import SibApiV3Sdk from 'sib-api-v3-sdk';

const getClient = () => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  return new SibApiV3Sdk.TransactionalEmailsApi();
};

export const sendWelcomeEmail = async (name, email) => {
  try {
    const api = getClient();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = '👋 Welcome to TaskBoard!';
    sendSmtpEmail.to = [{ email, name }];
    sendSmtpEmail.sender = { name: 'TaskBoard', email: 'a46940001@smtp-brevo.com' };
    sendSmtpEmail.htmlContent = `<div style="font-family:monospace;background:#0d0f14;color:#e8eaf0;padding:32px;border-radius:12px;max-width:480px;"><h1 style="color:#f59e0b;">Welcome, ${name}! 🎉</h1><p style="color:#9ca3af;">Your TaskBoard account has been created successfully.</p><a href="https://mern-task-dashboard.vercel.app" style="display:inline-block;background:#f59e0b;color:#000;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px;">Go to Dashboard →</a></div>`;
    await api.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Welcome email sent to:', email);
  } catch (error) {
    console.error('❌ Welcome email error:', error.message);
  }
};

export const sendTaskCreatedEmail = async (name, email, task) => {
  try {
    const api = getClient();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = `✅ New Task Created: ${task.title}`;
    sendSmtpEmail.to = [{ email, name }];
    sendSmtpEmail.sender = { name: 'TaskBoard', email: 'a46940001@smtp-brevo.com' };
    sendSmtpEmail.htmlContent = `<div style="font-family:monospace;background:#0d0f14;color:#e8eaf0;padding:32px;border-radius:12px;max-width:480px;"><h1 style="color:#f59e0b;">New Task Created</h1><p style="color:#fff;">${task.title}</p><p style="color:#9ca3af;">${task.description || 'No description'}</p></div>`;
    await api.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Task created email sent to:', email);
  } catch (error) {
    console.error('❌ Task created email error:', error.message);
  }
};

export const sendTaskCompletedEmail = async (name, email, task) => {
  try {
    const api = getClient();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = `🎉 Task Completed: ${task.title}`;
    sendSmtpEmail.to = [{ email, name }];
    sendSmtpEmail.sender = { name: 'TaskBoard', email: 'a46940001@smtp-brevo.com' };
    sendSmtpEmail.htmlContent = `<div style="font-family:monospace;background:#0d0f14;color:#e8eaf0;padding:32px;border-radius:12px;max-width:480px;"><h1 style="color:#10b981;">🎉 Task Completed!</h1><p style="color:#9ca3af;">Great work, ${name}! You completed: <strong style="color:#fff;">${task.title}</strong></p></div>`;
    await api.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Task completed email sent to:', email);
  } catch (error) {
    console.error('❌ Task completed email error:', error.message);
  }
};