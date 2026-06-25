import { Shield } from 'lucide-react';

interface RoleBadgeProps {
  role: 'admin' | 'operator';
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const isAdmin = role === 'admin';

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        isAdmin ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary',
      ].join(' ')}
    >
      <Shield className="mr-1 h-3.5 w-3.5" />
      {isAdmin ? 'Administrador' : 'Operador'}
    </span>
  );
}
