"use client";
import React from "react";
import { useResetPasswordMutation } from "@/redux/features/user/userApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
   const searchParams = useSearchParams();
   const router = useRouter();
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [message, setMessage] = useState("");
   const [error, setError] = useState("");
   const token = searchParams?.get("token") || "";
   const email = searchParams?.get("email") || "";

   const [resetPassword, { isLoading }] = useResetPasswordMutation();

   useEffect(() => {
      if (!token || !email) {
         setError("Invalid or missing reset link.");
      }
   }, [token, email]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setMessage("");
      setError("");
      if (password !== confirmPassword) {
         setError("Passwords do not match");
         return;
      }
      try {
         await resetPassword({ token, email, password }).unwrap();
         setMessage("Password reset successful. You can now sign in.");
         setTimeout(() => router.push("/"), 2000);
      } catch {
         setError("Something went wrong while resetting password.");
      }
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen py-30 bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
         <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
         <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <input
               type="password"
               placeholder="New password"
               value={password}
               onChange={e => setPassword(e.target.value)}
               required
               className="w-full px-4 py-2 border rounded"
            />
            <input
               type="password"
               placeholder="Confirm new password"
               value={confirmPassword}
               onChange={e => setConfirmPassword(e.target.value)}
               required
               className="w-full px-4 py-2 border rounded"
            />
            <button
               type="submit"
               className="gap-2 px-3 py-2 w-full bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
               disabled={isLoading || !token || !email}
            >
               {isLoading ? "Resetting..." : "Reset Password"}
            </button>
         </form>
         {message && <p className="text-green-600 mt-4">{message}</p>}
         {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
   );
} 