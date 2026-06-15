export interface StripePublishableKey {
  publishable_key: string;
}

export interface StripePaymentIntent {
  client_secret: string;
  ephemeral_key: string;
  customer_id: string;
  payment_intent_id: string;
  publishable_key: string;
}

export interface StripePaymentIntentCreateRequest {
  amount: number;
}
