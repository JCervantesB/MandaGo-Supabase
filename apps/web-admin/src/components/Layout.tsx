import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Building2,
  Users,
  Truck,
  Package,
  MapPin,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

function SidebarContent({
  collapsed = false,
  onClose,
}: {
  collapsed?: boolean;
  onClose?: () => void;
}) {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/settings/profile', label: 'Mi Perfil', icon: User },
    { path: '/settings/company', label: 'Mi Empresa', icon: Building2 },
    ...(isAdmin
      ? [{ path: '/settings/users', label: 'Usuarios', icon: Users }]
      : []),
    { path: '/drivers', label: 'Repartidores', icon: Truck },
    { path: '/recipients', label: 'Destinatarios', icon: Package },
    { path: '/pickup-points', label: 'Puntos de Recolección', icon: MapPin },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        <div
          className={[
            'flex items-center gap-3',
            collapsed ? 'w-full justify-center' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground shadow-sm">
            M
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-text">
                <span className="text-primary">Manda</span>
                <span className="text-accent">GO</span>
              </h1>
              <p className="text-xs text-text-secondary">Admin Panel</p>
            </div>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-muted hover:text-text lg:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            const linkClassName = [
              'group flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all',
              collapsed ? 'justify-center' : 'gap-3',
              isActive
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-text-secondary hover:bg-surface-muted hover:text-text',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={linkClassName}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={signOut}
          className={[
            'flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-danger/10 hover:text-danger',
            collapsed ? 'justify-center' : 'gap-3',
          ]
            .filter(Boolean)
            .join(' ')}
          title={collapsed ? 'Sign out' : undefined}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );
}

interface LayoutProps {
  children: ReactNode;
  sidebarCollapsed: boolean;
  onSidebarToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onMobileOpen: () => void;
}

export default function Layout({
  children,
  sidebarCollapsed,
  onSidebarToggle,
  mobileOpen,
  onMobileClose,
  onMobileOpen,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-text">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] md:hidden"
          onClick={onMobileClose}
        />
      )}

      <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center border-b border-border bg-surface/95 px-4 backdrop-blur md:hidden">
        <button
          onClick={onMobileOpen}
          className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-muted hover:text-primary"
        >
          <Menu size={22} />
        </button>

        <div className="ml-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            M
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-semibold">
              <span className="text-primary">Manda</span>
              <span className="text-accent">GO</span>
            </h1>
            <p className="text-[11px] text-text-secondary">Admin Panel</p>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        <aside
          className={[
            'fixed left-0 top-0 z-50 h-full w-72 border-r border-border bg-surface transition-transform duration-300 md:hidden',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <SidebarContent onClose={onMobileClose} />
        </aside>

        <aside
          className={[
            'relative hidden border-r border-border bg-surface transition-all duration-300 md:flex md:flex-col',
            sidebarCollapsed ? 'w-20' : 'w-72',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <SidebarContent collapsed={sidebarCollapsed} />

          <button
            onClick={onSidebarToggle}
            className="absolute right-0 top-6 translate-x-1/2 rounded-full border border-border bg-surface p-1.5 text-text-secondary shadow-sm transition-colors hover:text-primary"
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </aside>

        <main className="flex-1 pt-16 md:pt-0">
          <div className="mx-auto w-full max-w-[1600px] p-4 md:p-6 xl:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
