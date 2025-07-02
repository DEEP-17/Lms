"use client";
import React from "react";
import { useForgotPasswordMutation } from "@/redux/features/user/userApi";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
   const [email, setEmail] = useState("");
   const [message, setMessage] = useState("");
   const [error, setError] = useState("");
   const router = useRouter();

   const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setMessage("");
      setError("");
      try {
         await forgotPassword({ email }).unwrap();
         setMessage("If your email exists, a reset link has been sent.");
         setTimeout(() => router.push("/"), 2000);
      } catch {
         setError("Something went wrong in sending reset link.");
      }
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen py-30 bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
         <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
         <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <input
               type="email"
               placeholder="Enter your email"
               value={email}
               onChange={e => setEmail(e.target.value)}
               required
               className="w-full px-4 py-2 border rounded"
            />
            <button
               type="submit"
               className="gap-2 px-3 py-2 w-full bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
               disabled={isLoading}
            >
               {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
         </form>
         {message && <p className="text-green-600 mt-4">{message}</p>}
         {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
   );
} 