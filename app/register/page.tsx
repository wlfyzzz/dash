"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2, User, Lock, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { delay } from '@/functions/delay'
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { OTPModal } from "@/components/otp";
import { sendEmail } from "@/functions/email";

export default function RegisterPage() {
  const [correctCode] = useState('123456') // This could be fetched from an API or generated dynamically
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [otpCode, setOtpCode] = useState(""); // Added OTP code state
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callback") || "/dashboard";

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        style: {
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    setShowTermsDialog(true);
  };

  const Register = async () => {
    setIsModalOpen(false)
    setShowTermsDialog(false);
    setIsLoading(true);
    const log = toast.loading("Creating your account...");

    try {
      await delay(1200);
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        toast.dismiss(log);
        toast.success("Account created successfully!", {
          style: {
            background: '#333',
            color: '#fff',
          },
        });
        router.push('/');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      toast.dismiss(log);
      toast.error("Failed to create account. Please try again.", {
        style: {
          background: '#333',
          color: '#fff',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    Register();
  }

  const handleFailure = () => {
    toast.error("Incorrect OTP. Please try again.", {
      style: {
        background: '#333',
        color: '#fff',
      },
    });
  }

  const handleAcceptTerms = async () => {
    setShowTermsDialog(false);
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(generatedCode);
    try {
      await sendVerificationEmail(email, generatedCode); // Assuming sendVerificationEmail function exists
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to send verification email. Please try again.", {
        style: {
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  const handleCancelTerms = () => {
    setShowTermsDialog(false);
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription className="text-gray-400">Sign up for a new account here</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="User Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-700 text-white border-gray-600 pl-10"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 text-white border-gray-600 pl-10"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700 text-white border-gray-600 pl-10"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-700 text-white border-gray-600 pl-10"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
            <AlertDialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Terms of Service</AlertDialogTitle>
                  <AlertDialogDescription>
                    By creating an account, you agree to our Terms of Service and Privacy Policy. Please read them carefully before proceeding.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={handleCancelTerms}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAcceptTerms}>Accept</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <OTPModal 
              correctCode={otpCode} 
              onSuccess={handleSuccess} 
              onFailure={handleFailure}
              isOpen={isModalOpen}
              onOpenChange={setIsModalOpen}
            />
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/" className="text-blue-400 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

// Placeholder for sendVerificationEmail function.  Replace with your actual implementation.
const sendVerificationEmail = async (email: string, code: string) => {
  const response = await fetch('/api/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, code }),
  });
};

