import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import { emailVerificationSchema, type EmailVerificationFormData } from '../../schemas/authSchemas';

// ---  Main Form Component ---
export default function EmailVerification() {
  const location = useLocation();
  const emailFromState = location.state?.email || '';
  const [isVerified, setIsVerified] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailVerificationFormData>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      email: emailFromState,
    },
  });

  const onSubmit = (data: EmailVerificationFormData) => {
    console.log('Email Verification Submitted:', data);
    // Simulate verification success
    setTimeout(() => setIsVerified(true), 1000);
  };

  if (isVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-black">
              Email Verified!
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Your email has been successfully verified.
            </p>
          </div>

          <div className="border border-neutral-200 p-6 rounded-sm">
            <Link to="/login">
              <Button className="w-full">
                Continue to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <Mail className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-black">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            We've sent a 6-digit verification code to your email.
            <br />Please enter it below.
          </p>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-6 border border-neutral-200 p-6 rounded-sm"
        >
          <div className="space-y-4">
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              id="token"
              type="text"
              label="Verification Code"
              placeholder="123456"
              maxLength={6}
              error={errors.token?.message}
              {...register('token')}
              helperText="Enter the 6-digit code sent to your email"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting} className="w-full">
            {isSubmitting ? 'Verifying...' : 'Verify Email'}
          </Button>

          <div className="space-y-3">
            <div className="text-center text-sm text-neutral-600">
              Didn't receive the code?{' '}
              <button
                type="button"
                className="font-medium text-black hover:underline"
                onClick={() => console.log('Resend code')}
              >
                Resend
              </button>
            </div>
            <div className="text-center text-sm text-neutral-600">
              <Link to="/login" className="font-medium text-black hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}