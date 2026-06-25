import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { ListSection } from '@/components/settings/ListSection';
import { UserRow } from '@/components/settings/UserRow';
import { UserEditRow } from '@/components/settings/UserEditRow';
import { CompanyRow } from '@/components/settings/CompanyRow';
import { DetailModal } from '@/components/settings/DetailModal';
import { UserDetail } from '@/components/settings/UserDetail';
import { CompanyDetail } from '@/components/settings/CompanyDetail';
import { Users, Building2, AlertCircle, Search, X } from 'lucide-react';

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
  created_at?: string;
}

interface Company {
  id: string;
  name: string;
  trade_name?: string | null;
  tax_id?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export default function UsersSettingsPage() {
  const { profile, supabase } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<InternalUser[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<InternalUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<InternalUser | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    if (profile?.role !== 'admin') {
      setLoading(false);
      return;
    }
    loadData();
  }, [profile?.role]);

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const term = userSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.full_name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.companies?.name.toLowerCase().includes(term)
    );
  }, [users, userSearch]);

  const filteredCompanies = useMemo(() => {
    if (!companySearch.trim()) return companies;
    const term = companySearch.toLowerCase();
    return companies.filter((c) => c.name.toLowerCase().includes(term));
  }, [companies, companySearch]);

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
        .select('id, name, trade_name, tax_id, email, phone, address')
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

  function handleViewUser(user: InternalUser) {
    setSelectedUser(user);
  }

  function handleViewCompany(company: Company) {
    setSelectedCompany(company);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-14">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-border border-t-primary" />
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
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos para acceder a esta página. Solo los administradores pueden gestionar usuarios.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Gestión de Usuarios</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Administra usuarios internos y empresas registradas.
          </p>
        </div>
      </header>

      {error && (
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ListSection
        icon={<Users className="h-5 w-5 text-primary" />}
        title="Usuarios Internos"
        count={filteredUsers.length}
        emptyMessage={userSearch ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
        search={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o empresa..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="h-9 w-64 rounded-lg border border-border bg-background pl-9 pr-8 text-sm text-text placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {userSearch && (
              <button
                onClick={() => setUserSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-surface-muted"
              >
                <X className="h-3.5 w-3.5 text-text-secondary" />
              </button>
            )}
          </div>
        }
      >
        {filteredUsers.length > 0 && (
          <div className="divide-y divide-border">
            {filteredUsers.map((user) =>
              editingUser?.id === user.id ? (
                <UserEditRow
                  key={user.id}
                  user={editingUser}
                  saving={saving}
                  onCancel={() => setEditingUser(null)}
                  onSave={handleSave}
                  onChange={setEditingUser}
                />
              ) : (
                <UserRow
                  key={user.id}
                  user={user}
                  onEdit={() => setEditingUser(user)}
                  onView={() => handleViewUser(user)}
                />
              )
            )}
          </div>
        )}
      </ListSection>

      <ListSection
        icon={<Building2 className="h-5 w-5 text-primary" />}
        title="Empresas"
        count={filteredCompanies.length}
        emptyMessage={companySearch ? 'No se encontraron empresas' : 'No hay empresas registradas'}
        search={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Buscar empresa..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              className="h-9 w-48 rounded-lg border border-border bg-background pl-9 pr-8 text-sm text-text placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {companySearch && (
              <button
                onClick={() => setCompanySearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-surface-muted"
              >
                <X className="h-3.5 w-3.5 text-text-secondary" />
              </button>
            )}
          </div>
        }
      >
        {filteredCompanies.length > 0 && (
          <div className="divide-y divide-border">
            {filteredCompanies.map((company) => (
              <CompanyRow key={company.id} company={company} onView={() => handleViewCompany(company)} />
            ))}
          </div>
        )}
      </ListSection>

      <DetailModal
        isOpen={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        title="Detalle del Usuario"
      >
        {selectedUser && <UserDetail user={selectedUser} />}
      </DetailModal>

      <DetailModal
        isOpen={selectedCompany !== null}
        onClose={() => setSelectedCompany(null)}
        title="Detalle de la Empresa"
      >
        {selectedCompany && <CompanyDetail company={selectedCompany} />}
      </DetailModal>
    </div>
  );
}
