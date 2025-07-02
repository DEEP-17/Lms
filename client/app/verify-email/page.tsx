"use client";

import React from "react";
import { useVerifyEmailMutation } from "@/redux/features/user/userApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader/Loader";

const VerifyEmailPage = () => {
   const router = useRouter();
   const searchParams = useSearchParams();

   const token = searchParams?.get("token");
   console.log(token);
   const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
   const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");

   useEffect(() => {
      if (!token) {
         setStatus("error");
         return;
      }
      setStatus("verifying");
      verifyEmail(token)
         .unwrap()
         .then(() => {
            setStatus("success");
            toast.success("Email verified successfully!");
            setTimeout(() => router.push("/profile"), 2000);
         })
         .catch(() => {
            setStatus("error");
            toast.error("Invalid or expired verification link.");
         });
   }, [token, verifyEmail, router]);

   if (isLoading || status === "verifying") {
      return (
         <Loader/>
      );
   }
   return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
         {status === "success" && (
            <div className="text-green-600 text-lg font-semibold">Your email has been verified! Redirecting...</div>
         )}
         {status === "error" && (
            <div className="text-red-600 text-lg font-semibold">Invalid or expired verification link.</div>
         )}
      </div>
   );
};

export default VerifyEmailPage; 