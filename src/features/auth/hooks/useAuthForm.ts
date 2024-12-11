import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export function useAuthForm(type: 'signin' | 'signup' | 'forgot-password') {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, resetPassword, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState(false);

  const from = location.state?.from || '/';

  const validateForm = () => {
    setValidationError('');

    if (type === 'signup') {
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match');
        return false;
      }

      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      switch (type) {
        case 'signin':
          await signIn(email, password);
          if (!error) navigate(from, { replace: true });
          break;
        case 'signup':
          await signUp(email, password);
          if (!error) navigate('/auth/signin');
          break;
        case 'forgot-password':
          await resetPassword(email);
          if (!error) setSuccess(true);
          break;
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    validationError,
    success,
    handleSubmit,
    loading,
    error
  };
}