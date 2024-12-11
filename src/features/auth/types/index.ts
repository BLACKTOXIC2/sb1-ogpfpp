export interface AuthFormProps {
  type: 'signin' | 'signup' | 'forgot-password';
  email: string;
  setEmail: (email: string) => void;
  password?: string;
  setPassword?: (password: string) => void;
  confirmPassword?: string;
  setConfirmPassword?: (password: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  error?: string | null;
  validationError?: string;
}

export interface AuthFormState {
  email: string;
  password: string;
  confirmPassword: string;
  validationError: string;
  success: boolean;
}