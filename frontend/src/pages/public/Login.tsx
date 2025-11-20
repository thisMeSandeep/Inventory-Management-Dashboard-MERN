import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import { loginSchema, type LoginFormData } from '../../schemas/authSchemas';
import { useLogin } from '../../hooks/useAuth';

// ---  Main Form Component ---
export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
        navigate('/dashboard/products');
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-8">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-black">
            Login to your account
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Enter your credentials to access your account
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

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
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

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-neutral-600 hover:text-black hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" disabled={isPending} isLoading={isPending}>
            {isPending ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="text-center text-sm text-neutral-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-black hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}