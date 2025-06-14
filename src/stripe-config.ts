export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_SV34FLTmITKAkP',
    priceId: 'price_1Ra2yBFyAcNX3QOkVKjT3U9M',
    name: 'GitReader',
    description: 'Donate a couple of tokens to keep the vibes flowing ☕️',
    mode: 'payment'
  }
];

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};