import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { registerSchema } from '../utils/validators';
import { useAuthContext } from '../hooks/useAuthContext';
import { useToast } from '../hooks/useToast';
import Button from '../components/ui/Button';

function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthContext();
  const { show } = useToast();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data) {
    setServerError('');
    setSubmitting(true);
    try {
      await registerUser(data);
      show('Account created successfully');
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-xl font-bold text-ink-900 mb-6">Create Account</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <label className="block text-xs text-ink-500 mb-1.5">Full Name</label>
          <input
            {...register('name')}
            className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm focus:outline-none focus:border-brand-500"
          />
          {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs text-ink-500 mb-1.5">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm focus:outline-none focus:border-brand-500"
          />
          {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs text-ink-500 mb-1.5">Phone (optional)</label>
          <input
            {...register('phone')}
            className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm focus:outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs text-ink-500 mb-1.5">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm focus:outline-none focus:border-brand-500"
          />
          {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
        </div>

        {serverError && <p className="text-sm text-danger">{serverError}</p>}

        <Button type="submit" disabled={submitting} className="mt-2">
          {submitting ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className="text-sm text-ink-500 mt-5 text-center">
        Already have an account? <Link to="/login" className="text-brand-600 font-medium">Log in</Link>
      </p>
    </div>
  );
}

export default Register;