import React from 'react';
import { LogIn, UserPlus, Mail } from 'lucide-react';
import { AuthFormProps } from '../types';
import { FormInput } from './FormInput';
import { ErrorMessage } from './ErrorMessage';
import { SubmitButton } from './SubmitButton';

export const AuthForm: React.FC<AuthFormProps> = ({
  type,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  loading,
  error,
  validationError
}) => {
  const formConfig = {
    signin: {
      title: 'Welcome back',
      subtitle: 'Sign in to your account',
      buttonText: 'Sign in',
      icon: LogIn
    },
    signup: {
      title: 'Create an account',
      subtitle: 'Join MCQGEN today',
      buttonText: 'Sign up',
      icon: UserPlus
    },
    'forgot-password': {
      title: 'Reset your password',
      subtitle: 'Enter your email address and we\'ll send you a link to reset your password',
      buttonText: 'Send reset link',
      icon: Mail
    }
  };

  const config = formConfig[type];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">{config.title}</h2>
          <p className="mt-2 text-gray-600">{config.subtitle}</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <ErrorMessage error={error || validationError} />

          <div className="space-y-4">
            <FormInput
              id="email"
              type="email"
              label="Email address"
              value={email}
              onChange={setEmail}
              required
            />

            {type !== 'forgot-password' && setPassword && (
              <FormInput
                id="password"
                type="password"
                label="Password"
                value={password}
                onChange={setPassword}
                required
              />
            )}

            {type === 'signup' && setConfirmPassword && (
              <FormInput
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                required
              />
            )}
          </div>

          <SubmitButton
            loading={loading}
            text={config.buttonText}
            Icon={config.icon}
          />
        </form>
      </div>
    </div>
  );
};