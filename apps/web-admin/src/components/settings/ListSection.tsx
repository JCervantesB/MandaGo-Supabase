import type { ReactNode } from 'react';

interface ListSectionProps {
  icon: ReactNode;
  title: string;
  count: number;
  emptyMessage: string;
  search?: ReactNode;
  children?: ReactNode;
}

export function ListSection({ icon, title, count, emptyMessage, search, children }: ListSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border bg-surface-muted/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-base font-semibold text-text">{title}</h2>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {count}
          </span>
        </div>

        {search}
      </div>

      {count === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-text-secondary">
          {emptyMessage}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
