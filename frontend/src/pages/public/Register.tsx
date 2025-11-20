import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import { registerSchema, type RegisterFormData } from '../../schemas/authSchemas';
import { useRegister } from '../../hooks/useAuth';


// ---  Main Form Component ---
export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate: registerMutate, isPending } = useRegister();

  const onSubmit = async (data: RegisterFormData) => {
    registerMutate(data, {
      onSuccess: (response) => {
        reset();
        // Navigate to email verification with the registered email
        navigate('/verify-email', {
          state: { email: response.data.user.email }
        });
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-8">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-black">
            Register your account
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Enter your details below to create your account
          </p>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-6 border border-neutral-200 p-6 rounded-sm"
        >
          <div className="space-y-4">
            <Input
              id="name"
              label="Full Name"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name')}
            />

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
          </div>

          <Button type="submit" disabled={isPending} isLoading={isPending}>
            {isPending ? 'Creating account...' : 'Create account'}
          </Button>

          <div className="text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-black hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}