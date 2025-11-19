import { useRef, useState,type KeyboardEvent, type ClipboardEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, CheckCircle } from 'lucide-react';
import Button from '../../components/UI/Button';

export default function Otp() {
  const location = useLocation();
  const emailFromState = location.state?.email || '';
  const purposeFromState = location.state?.purpose || 'verification'; // 'verification' or 'reset'
  
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Focus previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) {
      setError('Please paste only numbers');
      return;
    }

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    // Focus the last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsSubmitting(true);
    console.log('OTP Submitted:', { email: emailFromState, token: otpValue, purpose: purposeFromState });
    
    // Simulate verification
    setTimeout(() => {
      setIsSubmitting(false);
      setIsVerified(true);
    }, 1000);
  };

  const handleResend = () => {
    console.log('Resending OTP to:', emailFromState);
    setOtp(new Array(6).fill(''));
    setError('');
    inputRefs.current[0]?.focus();
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
              Verification Successful!
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              {purposeFromState === 'reset'
                ? 'You can now reset your password.'
                : 'Your email has been verified.'}
            </p>
          </div>

          <div className="border border-neutral-200 p-6 rounded-sm">
            <Link to={purposeFromState === 'reset' ? '/reset-password' : '/login'} state={{ email: emailFromState }}>
              <Button className="w-full">
                {purposeFromState === 'reset' ? 'Continue to Reset Password' : 'Continue to Login'}
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
            <Shield className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-black">
            Enter verification code
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            We sent a 6-digit code to
            <br />
            <span className="font-medium text-black">{emailFromState || 'your email'}</span>
          </p>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 border border-neutral-200 p-6 rounded-sm"
        >
          <div className="space-y-4">
            {/* OTP Input Fields */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`
                    h-12 w-12 sm:h-14 sm:w-14 text-center text-xl font-semibold
                    bg-white text-black
                    border rounded-sm transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-black focus:border-black
                    disabled:cursor-not-allowed disabled:bg-neutral-50
                    ${
                      error
                        ? 'border-red-600 focus:ring-red-600 focus:border-red-600'
                        : 'border-neutral-300 hover:border-neutral-400'
                    }
                  `}
                  disabled={isSubmitting}
                />
              ))}
            </div>

            {error && (
              <p className="text-center text-sm font-medium text-red-600">{error}</p>
            )}

            <p className="text-center text-xs text-neutral-500">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting} className="w-full">
            {isSubmitting ? 'Verifying...' : 'Verify Code'}
          </Button>

          <div className="space-y-3">
            <div className="text-center text-sm text-neutral-600">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                className="font-medium text-black hover:underline"
                disabled={isSubmitting}
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