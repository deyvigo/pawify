import { useMutation, useQuery } from "@tanstack/react-query";
import { createPaymentIntent, getPublishableKey } from "../services/stripe";
import {
  StripePaymentIntent,
} from "../types/stripe";
import { OrderCreateRequestDTO } from "../types";

export const useStripePayment = () => {
  const { data } = useQuery({
    queryKey: ["stripe", "publishable-key"],
    queryFn: () => getPublishableKey(),
    staleTime: 30_000,
  });

  const paymentIntentMutation = useMutation<
    StripePaymentIntent,
    unknown,
    OrderCreateRequestDTO
  >({
    mutationKey: ["stripe", "payment-intent"],
    mutationFn: createPaymentIntent,
  });

  return { data, paymentIntentMutation };
};
