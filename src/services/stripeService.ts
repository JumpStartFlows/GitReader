import { supabase } from './supabaseClient';

export interface CheckoutSessionRequest {
  priceId: string;
  mode: 'payment' | 'subscription';
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export class StripeServiceError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'StripeServiceError';
  }
}

export const stripeService = {
  async createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        throw new StripeServiceError('Authentication required', 401);
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: request.priceId,
          mode: request.mode,
          success_url: request.successUrl || `${window.location.origin}/success`,
          cancel_url: request.cancelUrl || `${window.location.origin}/cancel`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new StripeServiceError(
          errorData.error || `Checkout failed: ${response.statusText}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof StripeServiceError) {
        throw error;
      }
      throw new StripeServiceError('Network error occurred during checkout');
    }
  },

  async getUserSubscription() {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        throw new StripeServiceError('Failed to fetch subscription data');
      }

      return data;
    } catch (error) {
      if (error instanceof StripeServiceError) {
        throw error;
      }
      throw new StripeServiceError('Failed to fetch subscription data');
    }
  },

  async getUserOrders() {
    try {
      const { data, error } = await supabase
        .from('stripe_user_orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (error) {
        throw new StripeServiceError('Failed to fetch order data');
      }

      return data || [];
    } catch (error) {
      if (error instanceof StripeServiceError) {
        throw error;
      }
      throw new StripeServiceError('Failed to fetch order data');
    }
  }
};