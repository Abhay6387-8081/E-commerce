import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { loginSchema } from '../utils/validators';
import { useAuthContext } from '../hooks/useAuthContext';
import { useToast } from '../hooks/useToast';
import Button from '../components/ui/Button';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const { show } = useToast();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data) {
    setServerError('');
    setSubmitting(true);
    try {
      await login(data);
      show('Logged in successfully');
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-xl font-bold text-ink-900 mb-6">Log In</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
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
          {submitting ? 'Logging in...' : 'Log In'}
        </Button>
      </form>

      <p className="text-sm text-ink-500 mt-5 text-center">
        New here? <Link to="/register" className="text-brand-600 font-medium">Create an account</Link>
      </p>
    </div>
  );
}

export default Login;