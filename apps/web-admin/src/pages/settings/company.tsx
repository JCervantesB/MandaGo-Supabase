import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Building2 } from 'lucide-react';

export default function CompanySettingsPage() {
  const { profile } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Company Settings</h1>
        <p className="text-text-secondary mt-1">
          Manage your company information
        </p>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-primary" />
          <div>
            <h2 className="font-semibold text-text">Company Information</h2>
            <p className="text-sm text-text-secondary">Your company details</p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">
            Company settings will be available after verifying your email.
          </p>
          {profile?.companyId && (
            <p className="text-sm text-text-secondary mt-2">
              Company ID: {profile.companyId}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
