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
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
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
  }
};