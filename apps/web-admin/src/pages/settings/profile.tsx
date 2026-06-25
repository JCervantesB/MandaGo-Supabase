import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { User, Check, AlertCircle } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { user, profile, supabase } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.fullName || '',
        email: profile.email || '',
        phone: '',
      });
      setLoading(false);
    }
  }, [profile]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    const { error: updateError } = await supabase
      .from('internal_users')
      .update({
        full_name: form.full_name,
        phone: form.phone || null,
      })
      .eq('id', user.id);

    setSaving(false);

    if (updateError) {
      setError('Error al guardar: ' + updateError.message);
      return;
    }

    setSuccess(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Mi Perfil</h1>
        <p className="text-text-secondary mt-1">
          Gestiona tu información personal
        </p>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-3">
          <User className="w-5 h-5 text-primary" />
          <div>
            <h2 className="font-semibold text-text">Datos Personales</h2>
            <p className="text-sm text-text-secondary">Actualiza tu información</p>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="error">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="success">
                <Check className="w-4 h-4" />
                <AlertDescription>Cambios guardados correctamente</AlertDescription>
              </Alert>
            )}

            <Input
              label="Nombre completo *"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              placeholder="Tu nombre"
            />

            <Input
              label="Email *"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />

            <Input
              label="Teléfono"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+52 123 456 7890"
            />
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={!form.full_name || !form.email} isLoading={saving}>
              Guardar cambios
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
