
import { onCall, HttpsError, onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || 'sk_test_PLACEHOLDER_KEY';
const stripe = new Stripe(STRIPE_SECRET, {
  apiVersion: '2023-10-16',
});

// --- CONSUME TOKENS (ATOMIC TRANSACTION) ---
interface ConsumeRequest {
    amount: number;
    featureName: string;
}

export const consumeTokens = onCall(async (request) => {
    // 1. Security: Check Auth
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'User must be logged in.');
    }

    const { amount, featureName } = request.data as ConsumeRequest;
    const userId = request.auth.uid;
    const userRef = admin.firestore().collection('users').doc(userId);

    // 2. Atomic Transaction
    try {
        await admin.firestore().runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);

            if (!userDoc.exists) {
                throw new HttpsError('not-found', 'User profile not found.');
            }

            const currentBalance = userDoc.data()?.tokens || 0;

            // 3. Validate Balance
            if (currentBalance < amount) {
                // Return specific error code for frontend to trigger Store UI
                throw new HttpsError('failed-precondition', 'INSUFFICIENT_FUNDS');
            }

            // 4. Deduct Tokens & Log History
            const newBalance = currentBalance - amount;
            
            transaction.update(userRef, { tokens: newBalance });

            // Create usage history entry
            const historyRef = userRef.collection('usage_history').doc();
            transaction.set(historyRef, {
                action: featureName,
                cost: amount,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                balanceAfter: newBalance
            });
        });

        return { success: true, message: 'Transaction successful' };

    } catch (error: any) {
        console.error("Token Transaction Failed:", error);
        // Re-throw known errors (like insufficient funds)
        if (error.code === 'failed-precondition') {
            throw error;
        }
        throw new HttpsError('internal', 'Transaction failed due to server error.');
    }
});

/**
 * 1. Create Stripe Checkout Session
 */
export const createStripeCheckoutSession = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be logged in to purchase.');
  }

  const { productId, type, price, currency = 'usd', productName } = request.data;
  const userId = request.auth.uid;
  const userEmail = request.auth.token.email;

  if (!productId || !price) {
    throw new HttpsError('invalid-argument', 'Missing product details.');
  }

  try {
    const origin = request.rawRequest.headers.origin || 'https://astroverse.uk';
    // All purchases are now one-time payments in Pay-As-You-Go model
    const mode = 'payment';

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: productName,
              metadata: {
                productId: productId,
              }
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${origin}/dashboard?payment_success=true`,
      cancel_url: `${origin}/dashboard?payment_cancelled=true`,
      customer_email: userEmail,
      metadata: {
        userId: userId,
        productId: productId,
        type: type
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);
    return { sessionId: session.id };

  } catch (error: any) {
    console.error("Stripe Session Error:", error);
    throw new HttpsError('internal', error.message || 'Unable to create payment session.');
  }
});

/**
 * 2. Stripe Webhook
 */
export const stripeWebhook = onRequest(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!signature || !endpointSecret) {
        res.status(400).send('Webhook Error: Missing signature or config');
        return;
    }
    event = stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret);
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const productId = session.metadata?.productId;
    // const type = session.metadata?.type; // No longer needed as we only have TOKENS

    if (userId && productId) {
        try {
            const userRef = admin.firestore().collection('users').doc(userId);
            
            await admin.firestore().runTransaction(async (transaction) => {
                const userDoc = await transaction.get(userRef);
                
                if (!userDoc.exists) {
                    transaction.set(userRef, { email: session.customer_email, tokens: 50 });
                }

                const currentTokens = userDoc.exists ? (userDoc.data()?.tokens || 0) : 50;

                // --- CREDIT UPDATE LOGIC (Pay-As-You-Go) ---
                let tokensToAdd = 0;
                
                // Matches utils/monetization.ts
                if (productId === 'SMALL') tokensToAdd = 10000;
                if (productId === 'MEDIUM') tokensToAdd = 22000; // 10% Bonus
                if (productId === 'LARGE') tokensToAdd = 50000;  // 25% Bonus

                transaction.update(userRef, { tokens: currentTokens + tokensToAdd });
                
                // Log purchase
                const historyRef = userRef.collection('transaction_history').doc();
                transaction.set(historyRef, {
                    action: 'PURCHASE_CREDITS',
                    amount: tokensToAdd,
                    productId: productId,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    balanceAfter: currentTokens + tokensToAdd
                });
            });

        } catch (dbError) {
            console.error('Firestore Update Error:', dbError);
            res.status(500).send('Database Error');
            return;
        }
    }
  }

  res.json({ received: true });
});
