import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

// Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

/* ===================== CHECKOUT FORM ===================== */
const CheckoutForm = ({ clientSecret, order }) => {
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

    try {
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
        await axiosSecure.post("/payments", {
          orderId: order._id,
          transactionId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          email: user.email,
        });

        toast.success("Payment successful 🎉");
        navigate("/dashboard/payment-history");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-semibold mb-4">Pay ${order.total}</h2>

      <div className="mb-4">
        <CardElement />
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
};

/* ===================== PAYMENT PAGE ===================== */
const PaymentPage = () => {
  const { id } = useParams(); // orderId
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPayment = async () => {
      if (!id) return;

      try {
        const orderRes = await axiosSecure.get(`/orders/${id}`);
        setOrder(orderRes.data);

        const paymentRes = await axiosSecure.post("/create-payment-intent", {
          orderId: id,
        });

        setClientSecret(paymentRes.data.clientSecret);
      } catch (err) {
        toast.error("Payment setup failed");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    initPayment();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Preparing payment...</div>;
  }

  if (!order || !clientSecret) {
    return <div className="p-6 text-center">Payment not ready</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm clientSecret={clientSecret} order={order} />
    </Elements>
  );
};

export default PaymentPage;
