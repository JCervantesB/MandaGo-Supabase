import { Building2, Phone, Mail, MapPin, Calendar } from 'lucide-react';

interface CompanyDetailProps {
  company: {
    id: string;
    name: string;
    trade_name?: string | null;
    tax_id?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
  };
}

export function CompanyDetail({ company }: CompanyDetailProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {company.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-text">{company.name}</h3>
          {company.trade_name && (
            <p className="text-sm text-text-secondary">{company.trade_name}</p>
          )}
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        {company.tax_id && (
          <div className="flex items-center gap-3 text-sm">
            <Building2 className="h-4 w-4 text-text-secondary" />
            <span className="text-text">{company.tax_id}</span>
          </div>
        )}

        {company.email && (
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-text-secondary" />
            <span className="text-text">{company.email}</span>
          </div>
        )}

        {company.phone && (
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-text-secondary" />
            <span className="text-text">{company.phone}</span>
          </div>
        )}

        {company.address && (
          <div className="flex items-start gap-3 text-sm">
            <MapPin className="h-4 w-4 shrink-0 text-text-secondary" />
            <span className="text-text">{company.address}</span>
          </div>
        )}

        <div className="flex items-center gap-3 text-sm">
          <Calendar className="h-4 w-4 text-text-secondary" />
          <span className="text-text-secondary font-mono text-xs">
            {company.id}
          </span>
        </div>
      </div>
    </div>
  );
}
