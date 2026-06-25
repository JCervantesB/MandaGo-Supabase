interface StatusBadgeProps {
  active: boolean;
}

export function StatusBadge({ active }: StatusBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger',
      ].join(' ')}
    >
      {active ? 'Activo' : 'Inactivo'}
    </span>
  );
}
