import { Mail, Building2, Phone, Edit2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RoleBadge } from './RoleBadge';
import { StatusBadge } from './StatusBadge';

interface User {
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

interface UserRowProps {
  user: User;
  onEdit: () => void;
  onView: () => void;
}

export function UserRow({ user, onEdit, onView }: UserRowProps) {
  return (
    <div className="px-5 py-4 transition-colors hover:bg-surface-muted/30">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-text">
                {user.full_name}
              </h3>

              <div className="mt-1 flex min-w-0 items-center gap-2 text-sm text-text-secondary">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>

              {user.phone && (
                <div className="mt-1 flex items-center gap-2 text-sm text-text-secondary">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <RoleBadge role={user.role} />
              <StatusBadge active={user.is_active} />
            </div>
          </div>

          {user.companies && (
            <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate">{user.companies.name}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 lg:ml-6">
          <Button variant="ghost" size="sm" onClick={onView}>
            <Eye className="mr-1 h-4 w-4" />
            Ver
          </Button>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit2 className="mr-1 h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>
    </div>
  );
}
