import { loadStripe, Stripe } from '@stripe/stripe-js';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import { getEnvVar } from '../utils/getEnvVar';

// Attempt to read the key using the safe helper
const STRIPE_PUBLIC_KEY = getEnvVar('VITE_STRIPE_PUBLIC_KEY');

// Singleton for the Stripe instance
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Lazy load Stripe instance.
 * Safe to call even if the key is missing (returns null).
 */
const getStripe = (): Promise<Stripe | null> => {
  if (!STRIPE_PUBLIC_KEY) {
    console.warn("⚠️ [Stripe Service] VITE_STRIPE_PUBLIC_KEY is missing from environment. Payments will be disabled.");
    return Promise.resolve(null);
  }

  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

// Types for payment data
interface PaymentRequest {
    productId: string;
    type: 'TOKEN' | 'SUBSCRIPTION';
    price: number;
    productName: string;
    currency: string;
}

interface PaymentResponse {
    sessionId: string;
}

/**
 * Initiate Stripe Checkout Flow
 * Handles environment checks, backend calls, and redirection.
 */
export const initiatePayment = async (data: PaymentRequest): Promise<void> => {
    console.log(`[Stripe] Initiating payment for: ${data.productName} (${data.price} ${data.currency})`);

    try {
        // 1. Get Stripe Instance (Safe)
        const stripe = await getStripe();
        
        if (!stripe) {
            alert("Payment system is currently unavailable (Missing Configuration). Please contact support.");
            return;
        }

        // 2. Get Firebase Functions Instance
        const app = getApp();
        const functions = getFunctions(app);
        const createSession = httpsCallable<PaymentRequest, PaymentResponse>(functions, 'createStripeCheckoutSession');

        // 3. Call Backend to create Session
        const result = await createSession(data);
        const { sessionId } = result.data;

        if (!sessionId) {
            throw new Error("Backend failed to return a valid Session ID.");
        }

        console.log("[Stripe] Session created successfully:", sessionId);

        // 4. Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({
            sessionId: sessionId
        });

        if (error) {
            console.error("[Stripe] Redirect Error:", error);
            alert(`Stripe Error: ${error.message}`);
        }

    } catch (error: any) {
        console.error("[Stripe] General Error:", error);
        
        let message = "Payment could not be initiated.";
        if (error.code === 'functions/unauthenticated') {
            message = "You must be signed in to make a purchase.";
        } else if (error.message) {
            message = `Error: ${error.message}`;
        }
        
        alert(message);
        // Do not re-throw if you want the UI to remain stable, just log it.
    }
};