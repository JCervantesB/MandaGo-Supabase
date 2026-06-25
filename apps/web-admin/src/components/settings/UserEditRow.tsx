import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, Check } from 'lucide-react';

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

interface UserEditRowProps {
  user: InternalUser;
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
  onChange: (user: InternalUser) => void;
}

export function UserEditRow({ user, saving, onCancel, onSave, onChange }: UserEditRowProps) {
  return (
    <div className="bg-primary/5 px-5 py-5">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_220px_220px_auto] xl:items-end">
        <Input
          label="Nombre"
          value={user.full_name}
          onChange={(e) => onChange({ ...user, full_name: e.target.value })}
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-text">Rol</label>
          <select
            value={user.role}
            onChange={(e) =>
              onChange({
                ...user,
                role: e.target.value as 'admin' | 'operator',
              })
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
          >
            <option value="operator">Operador</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text">Estado</label>
          <select
            value={user.is_active ? 'true' : 'false'}
            onChange={(e) =>
              onChange({
                ...user,
                is_active: e.target.value === 'true',
              })
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>

        <div className="flex gap-2 xl:justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="mr-1 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onSave}
            disabled={saving}
            isLoading={saving}
          >
            <Check className="mr-1 h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}
