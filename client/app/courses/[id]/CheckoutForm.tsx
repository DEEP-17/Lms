import { useCreateOrderMutation, useLoadUserQuery } from '@/redux/features/api/apiSlice';
import {
   LinkAuthenticationElement,
   PaymentElement,
   useElements,
   useStripe
} from '@stripe/react-stripe-js';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface CheckoutFormProps {
   courseId: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ courseId }) => {
   const stripe = useStripe();
   const elements = useElements();
   const [message, setMessage] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
   const { data } = useLoadUserQuery(undefined);
   const [open, setOpen] = useState(false);

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!stripe || !elements) return;

      setIsLoading(true);
      setMessage(null);

      const { error, paymentIntent } = await stripe.confirmPayment({
         elements,
         redirect: 'if_required'
      });

      if (error) {
         setMessage(error.message || "An unexpected error occurred.");
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
         setIsLoading(false);
         if (!data?.user?._id) {
            toast.error("Please login to continue");
            setMessage("Please login to continue");
            setIsLoading(false);
            return;
         }
         await createOrder({
            courseId,
            userId: data?.user?._id,
            payment_info: paymentIntent
         });
      }

      setIsLoading(false);
   };

   useEffect(() => {
      if (orderData) {
         router.push(`/courses/${courseId}/completion`);
      }
      if (error) {
         if ("data" in error) {
            const errorData = error.data as string | { message?: string };
            if (typeof errorData === "string") {
               setMessage(errorData);
            } else if (
               typeof errorData === "object" &&
               errorData !== null &&
               Object.prototype.hasOwnProperty.call(errorData, "message") &&
               typeof (errorData as { message?: string }).message === "string"
            ) {
               setMessage((errorData as { message: string }).message);
            } else {
               setMessage("An unexpected error occurred.");
            }
         } else {
            setMessage("An unexpected error occurred.");
         }
         toast.error(
            typeof message === "string"
               ? message
               : typeof message === "object" &&
                  message !== null &&
                  Object.prototype.hasOwnProperty.call(message, "message") &&
                  typeof (message as { message?: string }).message === "string"
                  ? (message as { message: string }).message
                  : "An unexpected error occurred."
         );
      }
   }, [orderData, error]);

   return (
      <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
         <form
            id="payment-form"
            onSubmit={handleSubmit}
            className="space-y-6"
            autoComplete="off"
         >
            <h2 className="text-2xl font-bold text-center text-cyan-700 dark:text-cyan-300 mb-4">
               Secure Payment
            </h2>
            <div className="space-y-4">
               <LinkAuthenticationElement id="link-authentication-element" />
               <PaymentElement id="payment-element" />
            </div>
            <button
               type="submit"
               disabled={isLoading || !stripe || !elements}
               className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {isLoading ? (
                  <div className="flex items-center justify-center">
                     <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                     </svg>
                     Processing...
                  </div>
               ) : (
                  "Pay now"
               )}
            </button>
            {message && (
               <div
                  id="payment-message"
                  className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg py-2 px-3 mt-2"
               >
                  {message}
               </div>
            )}
         </form>

      </div>
   );
};

export default CheckoutForm;