"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationErrorTemplate = exports.verificationSuccessTemplate = void 0;
const verificationSuccessTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
    <title>Email Verification Success</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f2f5;
        }
        .card {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        .success-icon {
            color: #4CAF50;
            font-size: 48px;
            margin-bottom: 1rem;
        }
        h1 {
            color: #1a73e8;
            margin-bottom: 1rem;
        }
        p {
            color: #5f6368;
            line-height: 1.5;
        }
        .button {
            display: inline-block;
            background-color: #1a73e8;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="success-icon">✓</div>
        <h1>Email Verified Successfully!</h1>
        <p>Hi ${name},</p>
        <p>Your email has been successfully verified. You can now log in to your account.</p>
        <a href="${process.env.FRONTEND_URL}/login" class="button">Go to Login</a>
    </div>
</body>
</html>
`;
exports.verificationSuccessTemplate = verificationSuccessTemplate;
const verificationErrorTemplate = (message) => `
<!DOCTYPE html>
<html>
<head>
    <title>Email Verification Failed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f2f5;
        }
        .card {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        .error-icon {
            color: #dc3545;
            font-size: 48px;
            margin-bottom: 1rem;
        }
        h1 {
            color: #dc3545;
            margin-bottom: 1rem;
        }
        p {
            color: #5f6368;
            line-height: 1.5;
        }
        .button {
            display: inline-block;
            background-color: #1a73e8;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="error-icon">✕</div>
        <h1>Verification Failed</h1>
        <p>${message}</p>
        <a href="${process.env.FRONTEND_URL}" class="button">Go to Homepage</a>
    </div>
</body>
</html>
`;
exports.verificationErrorTemplate = verificationErrorTemplate;
