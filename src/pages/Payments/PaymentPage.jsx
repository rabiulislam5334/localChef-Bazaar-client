import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { useNavigate, useLocation } from "react-router";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

// Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

/* ===================== CHECKOUT FORM ===================== */
function CheckoutForm({ clientSecret, order }) {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card,
          billing_details: {
            email: user?.email,
            name: user?.displayName || "Customer",
          },
        },
      }
    );

    if (error) {
      toast.error(error.message || "Payment failed");
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      try {
        const payload = {
          orderId: order._id,
          transactionId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          email: user.email,
        };

        await axiosSecure.post("/payments", payload);
        toast.success("Payment successful 🎉");
        navigate("/dashboard/payment-history");
      } catch (err) {
        console.error(err);
        toast.error("Payment done but failed to save record");
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-semibold mb-4">
        Pay ${order.price * order.quantity}
      </h2>

      <div className="mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#9e2146" },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-primary w-full"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

/* ===================== PAYMENT PAGE ===================== */
const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [order, setOrder] = useState(location.state?.order || null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const initPayment = async () => {
      try {
        let currentOrder = order;

        // If order not passed via state, fetch using query
        if (!currentOrder) {
          const params = new URLSearchParams(window.location.search);
          const orderId = params.get("orderId");

          if (!orderId) {
            toast.error("Order not found");
            navigate("/dashboard");
            return;
          }

          const res = await axiosSecure.get(`/orders/${orderId}`);
          currentOrder = res.data;
          setOrder(currentOrder);
        }

        // Create payment intent (secure)
        const res = await axiosSecure.post("/create-payment-intent", {
          orderId: currentOrder._id,
        });

        setClientSecret(res.data.clientSecret);
      } catch (error) {
        console.error(error);
        toast.error("Failed to initialize payment");
        navigate("/dashboard");
      }
    };

    initPayment();
  }, [order, navigate, axiosSecure]);

  if (!order || !clientSecret) {
    return <div className="p-6 text-center">Preparing payment...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm clientSecret={clientSecret} order={order} />
    </Elements>
  );
};

export default PaymentPage;
