import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Users, Package, Truck, MapPin } from 'lucide-react';

export default function DashboardPage() {
  const { profile } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <p className="text-text-secondary mt-1">
          Welcome{profile?.fullName ? `, ${profile.fullName}` : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">0</p>
              <p className="text-sm text-text-secondary">Orders</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">0</p>
              <p className="text-sm text-text-secondary">Recipients</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">0</p>
              <p className="text-sm text-text-secondary">Pickup Points</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">0</p>
              <p className="text-sm text-text-secondary">Drivers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-text">Recent Orders</h2>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary text-sm py-8 text-center">
              No orders yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-text">Quick Actions</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-text-secondary text-sm">
              Use the sidebar menu to navigate and manage your resources.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
