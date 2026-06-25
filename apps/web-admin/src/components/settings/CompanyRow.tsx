import { Building2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Company {
  id: string;
  name: string;
}

interface CompanyRowProps {
  company: Company;
  onView: () => void;
}

export function CompanyRow({ company, onView }: CompanyRowProps) {
  return (
    <div className="px-5 py-4 transition-colors hover:bg-surface-muted/30">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-text">
            {company.name}
          </h3>
          <p className="mt-1 truncate font-mono text-xs text-text-secondary">
            {company.id}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Building2 className="h-4 w-4 shrink-0" />
          <span>Empresa registrada</span>
        </div>

        <Button variant="ghost" size="sm" onClick={onView}>
          <Eye className="mr-1 h-4 w-4" />
          Ver
        </Button>
      </div>
    </div>
  );
}
