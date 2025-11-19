import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MailQuestion, Send } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../schemas/authSchemas';

// ---  Main Form Component ---
export default function ForgotPassword() {
    const navigate = useNavigate();
    const [emailSent, setEmailSent] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = (data: ForgotPasswordFormData) => {
        console.log('Forgot Password Submitted:', data);
        setSubmittedEmail(data.email);
        // Simulate email sent
        setTimeout(() => {
            setEmailSent(true);
        }, 1000);
    };

    if (emailSent) {
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
                            <span className="font-medium text-black">{submittedEmail}</span>
                        </p>
                    </div>

                    {/* Action Container */}
                    <div className="border border-neutral-200 p-6 rounded-sm space-y-4">
                        <Button
                            onClick={() => navigate('/otp', { state: { email: submittedEmail, purpose: 'reset' } })}
                            className="w-full"
                        >
                            Enter Verification Code
                        </Button>

                        <div className="space-y-3">
                            <div className="text-center text-sm text-neutral-600">
                                Didn't receive the email?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEmailSent(false);
                                        console.log('Resending to:', submittedEmail);
                                    }}
                                    className="font-medium text-black hover:underline"
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
                        <MailQuestion className="h-8 w-8 text-black" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-black">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                        No worries, we'll send you reset instructions.
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
                            helperText="Enter the email address associated with your account"
                        />
                    </div>

                    <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting} className="w-full">
                        {isSubmitting ? 'Sending...' : 'Send Reset Code'}
                    </Button>

                    <div className="text-center text-sm text-neutral-600">
                        Remember your password?{' '}
                        <Link to="/login" className="font-medium text-black hover:underline">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
