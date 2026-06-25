import { Mail, Phone, Building2, Calendar } from 'lucide-react';
import { RoleBadge } from './RoleBadge';
import { StatusBadge } from './StatusBadge';

interface UserDetailProps {
  user: {
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
  };
}

export function UserDetail({ user }: UserDetailProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {user.full_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-text">{user.full_name}</h3>
          <div className="mt-1 flex items-center gap-2">
            <RoleBadge role={user.role} />
            <StatusBadge active={user.is_active} />
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center gap-3 text-sm">
          <Mail className="h-4 w-4 text-text-secondary" />
          <span className="text-text">{user.email}</span>
        </div>

        {user.phone && (
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-text-secondary" />
            <span className="text-text">{user.phone}</span>
          </div>
        )}

        {user.companies && (
          <div className="flex items-center gap-3 text-sm">
            <Building2 className="h-4 w-4 text-text-secondary" />
            <span className="text-text">{user.companies.name}</span>
          </div>
        )}

        <div className="flex items-center gap-3 text-sm">
          <Calendar className="h-4 w-4 text-text-secondary" />
          <span className="text-text-secondary">
            ID: {user.id}
          </span>
        </div>
      </div>
    </div>
  );
}
