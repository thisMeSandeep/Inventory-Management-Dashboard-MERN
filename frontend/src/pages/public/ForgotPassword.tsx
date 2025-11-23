import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MailQuestion } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../schemas/authSchemas';
import { useForgotPassword } from '../../hooks/useAuth';
import EmailSentScreen from '../../components/EmailSentScreen';

// ---  Main Form Component ---
export default function ForgotPassword() {
    const navigate = useNavigate();
    const [emailSent, setEmailSent] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [emailPreviewUrl, setEmailPreviewUrl] = useState<string | null>(null);
    const { mutate: sendResetCode, isPending } = useForgotPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    // Countdown timer effect
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const onSubmit = (data: ForgotPasswordFormData) => {
        sendResetCode(data, {
            onSuccess: (response) => {
                setSubmittedEmail(data.email);
                setEmailSent(true);
                setCountdown(60);
                // Store preview URL if available
                if (response.data.emailPreviewUrl) {
                    setEmailPreviewUrl(response.data.emailPreviewUrl);
                }
            },
        });
    };

    const handleResend = () => {
        sendResetCode({ email: submittedEmail }, {
            onSuccess: (response) => {
                setCountdown(60);
                // Update preview URL if available
                if (response.data.emailPreviewUrl) {
                    setEmailPreviewUrl(response.data.emailPreviewUrl);
                }
            },
        });
    };

    if (emailSent) {
        return (
            <EmailSentScreen
                email={submittedEmail}
                emailPreviewUrl={emailPreviewUrl}
                onNavigate={() => navigate('/reset-password', { state: { email: submittedEmail } })}
                onResend={handleResend}
                isResending={isPending}
                countdown={countdown}
            />
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

                    <Button type="submit" disabled={isPending} isLoading={isPending} className="w-full">
                        {isPending ? 'Sending...' : 'Send Reset Code'}
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
