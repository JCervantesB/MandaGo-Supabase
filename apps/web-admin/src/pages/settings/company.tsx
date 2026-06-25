import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Building2, Check, AlertCircle } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  trade_name: string | null;
  tax_id: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
}

export default function CompanySettingsPage() {
  const { profile, supabase } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);

  const [form, setForm] = useState({
    name: '',
    trade_name: '',
    tax_id: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (!profile?.companyId) {
      setLoading(false);
      return;
    }

    supabase
      .from('companies')
      .select('*')
      .eq('id', profile.companyId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError('Error al cargar datos de la empresa');
          setLoading(false);
          return;
        }
        if (data) {
          setCompany(data);
          setForm({
            name: data.name || '',
            trade_name: data.trade_name || '',
            tax_id: data.tax_id || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
          });
        }
        setLoading(false);
      });
  }, [profile?.companyId, supabase]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!company) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    const { error: updateError } = await supabase
      .from('companies')
      .update({
        name: form.name,
        trade_name: form.trade_name || null,
        tax_id: form.tax_id || null,
        email: form.email || null,
        phone: form.phone || null,
        address: form.address || null,
      })
      .eq('id', company.id);

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

  if (!profile?.companyId) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text">Configuración de Empresa</h1>
          <p className="text-text-secondary mt-1">
            Gestiona la información de tu empresa
          </p>
        </div>
        <Alert variant="warning">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            No tienes una empresa asociada. Contacta al administrador.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Configuración de Empresa</h1>
        <p className="text-text-secondary mt-1">
          Gestiona la información de tu empresa
        </p>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-primary" />
          <div>
            <h2 className="font-semibold text-text">Información de la Empresa</h2>
            <p className="text-sm text-text-secondary">Datos generales de tu empresa</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre *"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Nombre de la empresa"
              />
              <Input
                label="Nombre comercial"
                name="trade_name"
                value={form.trade_name}
                onChange={handleChange}
                placeholder="Nombre comercial (opcional)"
              />
              <Input
                label="RFC / Tax ID"
                name="tax_id"
                value={form.tax_id}
                onChange={handleChange}
                placeholder="RFC o identificador fiscal"
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@empresa.com"
              />
              <Input
                label="Teléfono"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+52 123 456 7890"
              />
            </div>

            <Input
              label="Dirección"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Dirección completa"
            />
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={!form.name} isLoading={saving}>
              Guardar cambios
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
