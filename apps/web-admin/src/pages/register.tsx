import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema, type RegisterInput } from '@/schemas/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGlobalError('');
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setErrors({ password: 'Las contraseñas no coinciden' });
      return;
    }

    const result = registerSchema.safeParse({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      companyName: formData.companyName,
      phone: formData.phone || undefined,
    });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterInput, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof RegisterInput;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signUp({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      companyName: formData.companyName,
      phone: formData.phone || undefined,
    });
    setIsLoading(false);

    if (error) {
      setGlobalError(error.message);
      return;
    }

    navigate('/message?title=Check your email&description=We sent a confirmation link to your email address. Please click the link to activate your account.');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              <span className="text-primary">Manda</span>
              <span className="text-accent">GO</span>
            </h1>
            <p className="text-text-secondary mt-1">Crear cuenta</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {globalError && <Alert variant="error">{globalError}</Alert>}

            <Input
              type="text"
              name="fullName"
              label="Nombre completo"
              placeholder="Juan Pérez"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />

            <Input
              type="text"
              name="companyName"
              label="Nombre de la empresa"
              placeholder="Mi Empresa S.A."
              value={formData.companyName}
              onChange={handleChange}
              error={errors.companyName}
            />

            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              type="tel"
              name="phone"
              label="Teléfono (opcional)"
              placeholder="311 000 0000"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />

            <Input
              type="password"
              name="password"
              label="Contraseña"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
            />

            <Input
              type="password"
              name="confirmPassword"
              label="Confirmar contraseña"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Crear cuenta
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-text-secondary">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
