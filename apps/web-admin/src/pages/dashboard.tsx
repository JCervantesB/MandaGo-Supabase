import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { profile } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text">Dashboard</h1>
      <p className="text-text-secondary mt-2">
        Welcome{profile?.fullName ? `, ${profile.fullName}` : ''}
      </p>
      <div className="mt-8 p-6 bg-surface rounded-xl border border-border">
        <p className="text-text-secondary">
          This is the dashboard. The following sections will be implemented progressively:
        </p>
        <ul className="mt-4 space-y-2 text-text-secondary">
          <li>• Company management</li>
          <li>• Users</li>
          <li>• Pickup points</li>
          <li>• Recipients</li>
          <li>• Orders</li>
        </ul>
      </div>
    </div>
  );
}
