const sendEmail = async (to, subject, htmlContent) => {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'TaskBoard', email: 'yenareaditya321@gmail.com' },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }
};

export const sendWelcomeEmail = async (name, email) => {
  try {
    await sendEmail(email, '👋 Welcome to TaskBoard!', `
      <div style="font-family:monospace;background:#0d0f14;color:#e8eaf0;padding:32px;border-radius:12px;max-width:480px;">
        <h1 style="color:#f59e0b;">Welcome, ${name}! 🎉</h1>
        <p style="color:#9ca3af;">Your TaskBoard account has been created successfully.</p>
        <a href="https://mern-task-dashboard.vercel.app" style="display:inline-block;background:#f59e0b;color:#000;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px;">Go to Dashboard →</a>
      </div>`);
    console.log('✅ Welcome email sent to:', email);
  } catch (error) {
    console.error('❌ Welcome email error:', error.message);
  }
};

export const sendTaskCreatedEmail = async (name, email, task) => {
  try {
    await sendEmail(email, `✅ New Task Created: ${task.title}`, `
      <div style="font-family:monospace;background:#0d0f14;color:#e8eaf0;padding:32px;border-radius:12px;max-width:480px;">
        <h1 style="color:#f59e0b;">New Task Created</h1>
        <p style="color:#fff;"><strong>${task.title}</strong></p>
        <p style="color:#9ca3af;">${task.description || 'No description'}</p>
        <p style="color:#6b7280;">Priority: <span style="color:#f59e0b">${task.priority}</span> | Status: <span style="color:#3b82f6">${task.status}</span></p>
        <a href="https://mern-task-dashboard.vercel.app" style="display:inline-block;background:#f59e0b;color:#000;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">View Dashboard →</a>
      </div>`);
    console.log('✅ Task created email sent to:', email);
  } catch (error) {
    console.error('❌ Task created email error:', error.message);
  }
};

export const sendTaskCompletedEmail = async (name, email, task) => {
  try {
    await sendEmail(email, `🎉 Task Completed: ${task.title}`, `
      <div style="font-family:monospace;background:#0d0f14;color:#e8eaf0;padding:32px;border-radius:12px;max-width:480px;">
        <h1 style="color:#10b981;">🎉 Task Completed!</h1>
        <p style="color:#9ca3af;">Great work, ${name}! You completed:</p>
        <p style="color:#fff;"><strong>${task.title}</strong></p>
        <a href="https://mern-task-dashboard.vercel.app" style="display:inline-block;background:#10b981;color:#000;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">View Dashboard →</a>
      </div>`);
    console.log('✅ Task completed email sent to:', email);
  } catch (error) {
    console.error('❌ Task completed email error:', error.message);
  }
};

export const sendPasswordResetEmail = async (name, email, resetURL) => {
  try {
    await sendEmail(email, '🔐 Reset Your Password', `
      <div style="font-family:monospace;background:#0d0f14;color:#e8eaf0;padding:32px;border-radius:12px;max-width:480px;">
        <h1 style="color:#f59e0b;">Reset Password</h1>
        <p style="color:#9ca3af;">Hi ${name}, click below to reset your password.</p>
        <p style="color:#9ca3af;">This link expires in <strong style="color:#fff;">1 hour</strong>.</p>
        <a href="${resetURL}" style="display:inline-block;background:#f59e0b;color:#000;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px;">Reset Password →</a>
        <p style="color:#6b7280;font-size:12px;margin-top:16px;">If you didn't request this, ignore this email.</p>
      </div>`);
    console.log('✅ Password reset email sent to:', email);
  } catch (error) {
    console.error('❌ Password reset email error:', error.message);
  }
};