// This service simulates a secure, external serverless function (e.g., a Google Cloud Function)
// that is responsible for sending system emails. It bypasses any local environment restrictions.

// SECURITY FIX: Removed hardcoded API key and replaced with an environment variable.
const MOCK_API_KEY = process.env.EMAIL_PROXY_KEY;

// In a real backend, this would be a more robust token generation and storage mechanism (e.g., JWT, Redis)
const pendingTokens: { [token: string]: { email: string; type: 'ACTIVATION' | 'RESET' } } = {};

/**
 * Simulates calling a secure serverless function to send a system email.
 * @param email The recipient's email address.
 * @param action The type of email to send ('ACTIVATION' or 'RESET').
 * @param apiKey The secret key to authorize the request.
 * @returns A unique token that would normally be part of the link in the email.
 */
export const sendSystemEmail = (
  email: string,
  action: 'ACTIVATION' | 'RESET',
  apiKey: string | undefined
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // 1. Security Check: The proxy function must be called with the correct key.
      if (!apiKey || apiKey !== MOCK_API_KEY) {
        console.error("EMAIL PROXY: Unauthorized attempt to send email.");
        return reject(new Error("Unauthorized: Invalid API Key for Email Proxy Service."));
      }

      // 2. Generate a secure, unique token.
      const token = `${action.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

      // 3. Store the token's purpose (in a real app, this would be in a database/Redis with an expiry).
      pendingTokens[token] = { email, type: action };
      
      console.log(`EMAIL PROXY: Successfully generated token for ${email} - Action: ${action}`);
      console.log(`   -> Token: ${token}`);
      console.log(`   -> In a real app, an email would now be sent via SendGrid/SES with a link containing this token.`);

      // 4. Return the token to the frontend to simulate the user clicking the link.
      resolve(token);

    }, 1500); // 1.5 second delay to mimic a real network request
  });
};

/**
 * Simulates the backend verifying a token when a user clicks a link.
 * @param token The token from the email link.
 * @returns The email and type associated with the token if valid.
 */
export const verifyToken = (token: string): { email: string; type: 'ACTIVATION' | 'RESET' } | null => {
    const record = pendingTokens[token];
    if (record) {
        // In a real app, you would invalidate the token after use.
        delete pendingTokens[token];
        console.log(`EMAIL PROXY: Token ${token} successfully verified and consumed.`);
        return record;
    }
    console.error(`EMAIL PROXY: Invalid or expired token attempted: ${token}`);
    return null;
};