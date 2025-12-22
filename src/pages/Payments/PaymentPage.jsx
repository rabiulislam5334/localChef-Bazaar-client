import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import {
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowLeft,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

// Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

/* ===================== CHECKOUT FORM COMPONENT ===================== */
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 block">
          Card Information
        </label>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1f2937",
                  fontFamily: '"Inter", sans-serif',
                  "::placeholder": { color: "#9ca3af" },
                },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-xl ${
          processing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-200"
        }`}
      >
        {processing ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <>
            <Lock size={18} />
            Pay ${order.total} Now
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 font-medium uppercase tracking-widest">
        <div className="flex items-center gap-1">
          <ShieldCheck size={14} className="text-green-500" /> Secure
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 size={14} className="text-green-500" /> Encrypted
        </div>
      </div>
    </form>
  );
};

/* ===================== MAIN PAYMENT PAGE ===================== */
const PaymentPage = () => {
  const { id } = useParams();
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
  }, [id, axiosSecure, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <span className="loading loading-ring loading-lg text-indigo-600"></span>
          <p className="text-gray-500 font-medium animate-pulse">
            Initializing Secure Checkout...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Main Container with Top Padding to avoid Header overlap */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Modern Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-10 transition-all bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100 w-fit"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-bold text-sm">Return to Orders</span>
        </motion.button>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDE: Order Summary */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="lg:col-span-5"
          >
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-800">
                    Order Summary
                  </h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Review before pay
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t border-dashed border-gray-200 pt-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-semibold">Meal Item</span>
                  <span className="text-gray-800 font-bold">
                    {order?.mealName}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-semibold">Quantity</span>
                  <span className="text-gray-800 font-bold">
                    × {order?.quantity}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-5 mt-2 border-t border-gray-100">
                  <span className="text-gray-800 font-bold">Total Amount</span>
                  <span className="text-2xl font-black text-indigo-600">
                    ${order?.total}
                  </span>
                </div>
              </div>

              {/* Secure Info Card */}
              <div className="mt-8 p-4 bg-blue-50/50 rounded-2xl flex gap-3 items-start">
                <ShieldCheck size={20} className="text-blue-500 shrink-0" />
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Your payment data is processed securely by Stripe. We do not
                  store your credit card information on our servers.
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Payment Form */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.04)] border border-indigo-50 relative overflow-hidden">
              {/* Decorative Background Element */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/40 rounded-bl-full -mr-16 -mt-16 -z-0"></div>

              <div className="flex items-center gap-4 mb-10 relative z-10">
                <div className="p-3.5 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-800">
                    Secure Payment
                  </h3>
                  <p className="text-sm text-gray-400 font-medium">
                    Credit or Debit Card
                  </p>
                </div>
              </div>

              <div className="relative z-10">
                <Elements stripe={stripePromise}>
                  <CheckoutForm clientSecret={clientSecret} order={order} />
                </Elements>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
