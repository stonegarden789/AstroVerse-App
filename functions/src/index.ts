import { onCall, HttpsError, onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

// Initialize Stripe securely
// Falls back to a placeholder to prevent crash on deploy if var is missing, but will error at runtime.
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || 'sk_test_PLACEHOLDER_KEY';
const stripe = new Stripe(STRIPE_SECRET, {
  apiVersion: '2023-10-16',
});

/**
 * 1. Create Stripe Checkout Session (Callable from Frontend)
 * Creates a payment session for either a Token Pack (One-time) or Subscription.
 */
export const createStripeCheckoutSession = onCall(async (request) => {
  // Authentication Check
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
    // Determine return URL dynamically based on the request origin
    // This allows it to work on localhost:5173 AND astroverse.uk without code changes
    const origin = request.rawRequest.headers.origin || 'https://astroverse.uk';

    // Determine mode: 'payment' for tokens, 'subscription' for tiers
    const mode = type === 'SUBSCRIPTION' ? 'subscription' : 'payment';

    // Create session parameters
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: productName,
              metadata: {
                productId: productId, // e.g., 'SMALL', 'PRIME'
              }
            },
            unit_amount: Math.round(price * 100), // Stripe expects cents
            recurring: mode === 'subscription' ? { interval: 'month' } : undefined,
          },
          quantity: 1,
        },
      ],
      mode: mode,
      // Redirect URLs
      success_url: `${origin}/dashboard?payment_success=true`,
      cancel_url: `${origin}/dashboard?payment_cancelled=true`,
      customer_email: userEmail,
      // Metadata is crucial for the Webhook to know who to credit
      metadata: {
        userId: userId,
        productId: productId,
        type: type // 'TOKEN' or 'SUBSCRIPTION'
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
 * 2. Stripe Webhook (HTTP Trigger)
 * Securely listens for 'checkout.session.completed' events from Stripe servers
 * and updates the user's balance in Firestore.
 */
export const stripeWebhook = onRequest(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!signature || !endpointSecret) {
        console.error("Missing signature or webhook secret");
        res.status(400).send('Webhook Error: Missing signature or config');
        return;
    }
    
    // Verify the event came from Stripe using the raw body
    event = stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret);
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const userId = session.metadata?.userId;
    const productId = session.metadata?.productId;
    const type = session.metadata?.type;

    if (userId && productId) {
        try {
            const userRef = admin.firestore().collection('users').doc(userId);
            
            await admin.firestore().runTransaction(async (transaction) => {
                const userDoc = await transaction.get(userRef);
                
                // If user doesn't exist in DB yet (rare), create basic record
                if (!userDoc.exists) {
                    transaction.set(userRef, { email: session.customer_email, tokens: 5, subscriptionTier: 'Free' });
                }

                const currentTokens = userDoc.exists ? (userDoc.data()?.tokens || 0) : 5;

                if (type === 'TOKEN') {
                    // Add Tokens based on package ID
                    let tokensToAdd = 0;
                    if (productId === 'SMALL') tokensToAdd = 10;
                    if (productId === 'MEDIUM') tokensToAdd = 30;
                    if (productId === 'LARGE') tokensToAdd = 50;

                    transaction.update(userRef, { tokens: currentTokens + tokensToAdd });
                    console.log(`Added ${tokensToAdd} tokens to user ${userId}`);
                } 
                else if (type === 'SUBSCRIPTION') {
                    // Update Subscription Tier
                    let tierName = 'Free';
                    let tokensToAdd = 0;
                    
                    if (productId === 'EXPLORER') { tierName = 'Explorer'; tokensToAdd = 5; }
                    if (productId === 'INSIGHT') { tierName = 'Insight'; tokensToAdd = 15; }
                    if (productId === 'PRIME') { tierName = 'Prime'; tokensToAdd = 30; }

                    transaction.update(userRef, { 
                        subscriptionTier: tierName,
                        tokens: currentTokens + tokensToAdd, // Add monthly allowance immediately
                        subscriptionStatus: 'active',
                        subscriptionId: session.subscription
                    });
                    console.log(`Upgraded user ${userId} to ${tierName}`);
                }
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