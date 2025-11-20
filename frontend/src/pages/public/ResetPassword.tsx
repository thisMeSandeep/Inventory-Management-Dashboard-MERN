import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import { resetPasswordSchema, type ResetPasswordFormData } from '../../schemas/authSchemas';
import { useResetPassword } from '../../hooks/useAuth';

// ---  Main Form Component ---
export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || '';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: resetPasswordMutate, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromState,
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutate(
      {
        email: data.email,
        token: Number(data.token),
        password: data.password,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <KeyRound className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-black">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Enter the code sent to your email and create a new password
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

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="New Password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 translate-y-1/2 text-neutral-600 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm New Password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 translate-y-1/2 text-neutral-600 hover:text-black transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={isPending} isLoading={isPending} className="w-full">
            {isPending ? 'Resetting password...' : 'Reset Password'}
          </Button>

          <div className="text-center text-sm text-neutral-600">
            <Link to="/login" className="font-medium text-black hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}