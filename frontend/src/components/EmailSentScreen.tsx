import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import Button from './UI/Button';

interface EmailSentScreenProps {
  email: string;
  emailPreviewUrl?: string | null;
  onNavigate: () => void;
  onResend: () => void;
  isResending: boolean;
  countdown: number;
}

export default function EmailSentScreen({
  email,
  emailPreviewUrl,
  onNavigate,
  onResend,
  isResending,
  countdown,
}: EmailSentScreenProps) {
  const isResendDisabled = isResending || countdown > 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Send className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-black">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            We've sent a password reset code to
            <br />
            <span className="font-medium text-black">{email}</span>
          </p>
          {emailPreviewUrl && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800 mb-2">
                Click the link below to view your email:
              </p>
              <a
                href={emailPreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
              >
                {emailPreviewUrl}
              </a>
            </div>
          )}
        </div>

        {/* Action Container */}
        <div className="border border-neutral-200 p-6 rounded-sm space-y-4">
          <Button onClick={onNavigate} className="w-full">
            Continue to Reset Password
          </Button>

          <div className="space-y-3">
            <div className="text-center text-sm text-neutral-600">
              Didn't receive the email?{' '}
              <button
                type="button"
                onClick={onResend}
                disabled={isResendDisabled}
                className="font-medium text-black hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend'}
              </button>
            </div>
            <div className="text-center text-sm text-neutral-600">
              <Link to="/login" className="font-medium text-black hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
