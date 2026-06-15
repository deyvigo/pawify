import { OrderCreateRequestDTO } from "../types";
import { StripePaymentIntent, StripePublishableKey } from "../types/stripe";
import { apiAuthenticated } from "./api";

export const getPublishableKey = async () => {
  const response = await apiAuthenticated.get<StripePublishableKey>(
    "/stripe/publishable-key",
  );
  return response.data;
};

export const createPaymentIntent = async (data: OrderCreateRequestDTO) => {
  const response = await apiAuthenticated.post<StripePaymentIntent>(
    "/stripe/payment-intent",
    data,
  );
  return response.data;
};
