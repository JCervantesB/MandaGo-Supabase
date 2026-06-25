import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Users, Check, AlertCircle, X, Edit2 } from 'lucide-react';

interface InternalUser {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: 'admin' | 'operator';
  is_active: boolean;
  company_id: string | null;
  companies: {
    id: string;
    name: string;
  } | null;
}

interface Company {
  id: string;
  name: string;
}

export default function UsersSettingsPage() {
  const { profile, supabase } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<InternalUser[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<InternalUser | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.role !== 'admin') {
      setLoading(false);
      return;
    }
    loadData();
  }, [profile?.role]);

  async function loadData() {
    setLoading(true);
    setError(null);

    const [usersResult, companiesResult] = await Promise.all([
      supabase
        .from('internal_users')
        .select('*, companies(id, name)')
        .order('created_at', { ascending: false }),
      supabase
        .from('companies')
        .select('id, name')
        .order('name'),
    ]);

    if (usersResult.error) {
      setError('Error al cargar usuarios');
      setLoading(false);
      return;
    }

    setUsers(usersResult.data || []);
    setCompanies(companiesResult.data || []);
    setLoading(false);
  }

  async function handleSave() {
    if (!editingUser) return;

    setSaving(true);
    const { error: updateError } = await supabase
      .from('internal_users')
      .update({
        role: editingUser.role,
        is_active: editingUser.is_active,
        full_name: editingUser.full_name,
      })
      .eq('id', editingUser.id);

    setSaving(false);

    if (updateError) {
      setError('Error al guardar: ' + updateError.message);
      return;
    }

    setEditingUser(null);
    loadData();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (profile?.role !== 'admin') {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text">Gestión de Usuarios</h1>
        </div>
        <Alert variant="warning">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            No tienes permisos para acceder a esta página. Solo los administradores pueden gestionar usuarios.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Gestión de Usuarios</h1>
          <p className="text-text-secondary mt-1">
            Administra los usuarios del sistema
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="error" className="mb-4">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <div>
            <h2 className="font-semibold text-text">Usuarios Internos</h2>
            <p className="text-sm text-text-secondary">
              {users.length} usuario(s) registrado(s)
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-3 text-sm font-medium text-text-secondary">Nombre</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-text-secondary">Email</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-text-secondary">Empresa</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-text-secondary">Rol</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-text-secondary">Estado</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-text-secondary">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4">
                      {editingUser?.id === user.id ? (
                        <Input
                          value={editingUser.full_name}
                          onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                          className="py-1"
                        />
                      ) : (
                        <span className="font-medium text-text">{user.full_name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{user.email}</td>
                    <td className="px-6 py-4 text-text-secondary">
                      {user.companies?.name || 'Sin empresa'}
                    </td>
                    <td className="px-6 py-4">
                      {editingUser?.id === user.id ? (
                        <select
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'admin' | 'operator' })}
                          className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background text-text"
                        >
                          <option value="operator">Operador</option>
                          <option value="admin">Administrador</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-accent/10 text-accent'
                          }`}
                        >
                          {user.role === 'admin' ? 'Admin' : 'Operador'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingUser?.id === user.id ? (
                        <select
                          value={editingUser.is_active ? 'true' : 'false'}
                          onChange={(e) => setEditingUser({ ...editingUser, is_active: e.target.value === 'true' })}
                          className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background text-text"
                        >
                          <option value="true">Activo</option>
                          <option value="false">Inactivo</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.is_active
                              ? 'bg-success/10 text-success'
                              : 'bg-danger/10 text-danger'
                          }`}
                        >
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingUser?.id === user.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingUser(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={handleSave}
                            disabled={saving}
                            isLoading={saving}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
                      No hay usuarios registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-semibold text-text">Empresas</h2>
              <p className="text-sm text-text-secondary">
                {companies.length} empresa(s) registrada(s)
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 text-sm font-medium text-text-secondary">Nombre</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-text-secondary">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id} className="border-b border-border last:border-0">
                      <td className="px-6 py-4 font-medium text-text">{company.name}</td>
                      <td className="px-6 py-4 text-text-secondary font-mono text-xs">{company.id}</td>
                    </tr>
                  ))}
                  {companies.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-6 py-12 text-center text-text-secondary">
                        No hay empresas registradas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
