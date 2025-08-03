const getVerificationEmail = (name, link) => {
  return `
    <h1>Welcome, ${name}</h1>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${link}">Verify Email</a>
  `;
};

const getResetPasswordEmail = (name, link) => {
  return `
    <h1>Hello, ${name}</h1>
    <p>Click below to reset your password:</p>
    <a href="${link}">Reset Password</a>
  `;
};

export { getVerificationEmail, getResetPasswordEmail };
