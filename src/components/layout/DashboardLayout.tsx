import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    {
      name: 'Panel de Control',
      href: '/dashboard',
      icon: 'ri-dashboard-line',
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Punto de Ventas',
      href: '/pos',
      icon: 'ri-shopping-cart-line',
      current: location.pathname.startsWith('/pos')
    },
    {
      name: 'Productos',
      href: '/products',
      icon: 'ri-product-hunt-line',
      current: location.pathname.startsWith('/products')
    },
    {
      name: 'Inventario',
      href: '/inventory',
      icon: 'ri-archive-line',
      current: location.pathname.startsWith('/inventory')
    },
    {
      name: 'Cuentas por Cobrar',
      href: '/accounts-receivable',
      icon: 'ri-money-dollar-circle-line',
      current: location.pathname.startsWith('/accounts-receivable')
    },
    {
      name: 'Cuentas por Pagar',
      href: '/accounts-payable',
      icon: 'ri-file-list-3-line',
      current: location.pathname.startsWith('/accounts-payable'),
      submenu: [
        { name: 'Reportes CxP', href: '/accounts-payable/reports' },
        { name: 'Suplidores', href: '/accounts-payable/suppliers' },
        { name: 'Emisión de Pagos', href: '/accounts-payable/payments' },
        { name: 'Órdenes de Compra', href: '/accounts-payable/purchase-orders' },
        { name: 'Cotizaciones', href: '/accounts-payable/quotes' }
      ]
    },
    {
      name: 'Facturación',
      href: '/billing',
      icon: 'ri-file-text-line',
      current: location.pathname.startsWith('/billing'),
      submenu: [
        { name: 'Reporte de Ventas', href: '/billing/sales-reports' },
        { name: 'Facturación', href: '/billing/invoicing' },
        { name: 'Pre-facturación', href: '/billing/pre-invoicing' },
        { name: 'Facturación Recurrente', href: '/billing/recurring' },
        { name: 'Cierre de Caja', href: '/billing/cash-closing' },
        { name: 'Cotizaciones', href: '/billing/quotes' }
      ]
    },
    {
      name: 'Planes',
      href: '/plans',
      icon: 'ri-vip-crown-line',
      current: location.pathname.startsWith('/plans')
    },
    {
      name: 'Configuración',
      href: '/settings',
      icon: 'ri-settings-line',
      current: location.pathname.startsWith('/settings')
    }
  ];

  const primaryNavNames = [
    'Panel de Control',
    'Punto de Ventas',
    'Facturación',
    'Productos',
    'Cuentas por Cobrar',
    'Cuentas por Pagar',
  ];

  const primaryNav = navigation.filter(item => primaryNavNames.includes(item.name));
  const secondaryNav = navigation.filter(item => !primaryNavNames.includes(item.name));

  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleSubmenu = (href: string) => {
    setExpandedMenus(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const renderNavItem = (item: any) => {
    const hasSubmenu = Array.isArray(item.submenu) && item.submenu.length > 0;
    const isExpanded = expandedMenus.includes(item.href);

    return (
      <div key={item.name} className="relative">
        <Link
          to={item.href}
          className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            item.current
              ? 'bg-slate-900/80 text-slate-50 shadow-sm shadow-slate-900/60'
              : 'text-slate-300 hover:text-slate-50 hover:bg-slate-900/60'
          }`}
          onClick={() => {
            setMobileNavOpen(false);
          }}
        >
          <i className={`${item.icon} mr-2 text-lg flex-shrink-0`}></i>
          <span className="truncate">{item.name}</span>

          {hasSubmenu && (
            <button
              type="button"
              className="ml-1 text-slate-400 hover:text-slate-200"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSubmenu(item.href);
                setMobileNavOpen(false);
              }}
            >
              <i className={`ri-arrow-${isExpanded ? 'up' : 'down'}-s-line text-sm`}></i>
            </button>
          )}
        </Link>

        {hasSubmenu && isExpanded && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/10"
            onClick={() => toggleSubmenu(item.href)}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl shadow-slate-950/80"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className={`${item.icon} text-purple-300`}></i>
                  <span className="text-sm font-semibold text-slate-50">{item.name}</span>
                </div>
                <button
                  type="button"
                  className="p-1.5 rounded-full hover:bg-slate-900 text-slate-400 hover:text-slate-100"
                  onClick={() => toggleSubmenu(item.href)}
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              </div>
              <div className="py-2 max-h-[60vh] overflow-y-auto">
                {item.submenu?.map((subItem: any) => (
                  <Link
                    key={subItem.name}
                    to={subItem.href}
                    className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors duration-200 ${
                      location.pathname === subItem.href
                        ? 'bg-slate-900/80 text-purple-300 border border-slate-700'
                        : 'text-slate-300 hover:text-slate-50 hover:bg-slate-900/60 border border-transparent'
                    }`}
                    onClick={() => {
                      setExpandedMenus(prev => prev.filter(href => href !== item.href));
                      setMobileNavOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400/80 flex-shrink-0" />
                      <span className="truncate">{subItem.name}</span>
                    </div>
                    <i className="ri-arrow-right-line text-xs text-slate-500" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top navigation with modules */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm z-30">
        <div className="px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-x-6">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-sky-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/40">
                <span className="text-sm font-bold tracking-tight text-slate-950">BD</span>
              </div>
              <div className="ml-3 hidden sm:block">
                <h1 className="text-xl font-bold text-slate-50" style={{ fontFamily: '"Pacifico", serif' }}>BILLS DR</h1>
                <p className="text-xs text-slate-400">Plataforma de gestión empresarial</p>
              </div>
            </Link>

            {/* Desktop navigation modules */}
            <nav className="hidden md:flex items-center gap-x-1 max-w-[60vw] overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {primaryNav.map(renderNavItem)}

              {secondaryNav.length > 0 && (
                <div className="relative ml-1 flex-shrink-0">
                  <button
                    type="button"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      secondaryNav.some(item => item.current)
                        ? 'bg-slate-900/80 text-slate-50 shadow-sm shadow-slate-900/60'
                        : 'text-slate-300 hover:text-slate-50 hover:bg-slate-900/60'
                    }`}
                    onClick={() => setMoreMenuOpen(prev => !prev)}
                  >
                    <i className="ri-more-2-line mr-2 text-lg"></i>
                    <span className="truncate">Más módulos</span>
                    <i className={`ri-arrow-${moreMenuOpen ? 'up' : 'down'}-s-line ml-1 text-sm`}></i>
                  </button>

                  {moreMenuOpen && (
                    <div
                      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/10"
                      onClick={() => setMoreMenuOpen(false)}
                    >
                      <div
                        className="w-full max-w-md rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl shadow-slate-950/80"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <i className="ri-more-2-line text-purple-300"></i>
                            <span className="text-sm font-semibold text-slate-50">Más módulos</span>
                          </div>
                          <button
                            type="button"
                            className="p-1.5 rounded-full hover:bg-slate-900 text-slate-400 hover:text-slate-100"
                            onClick={() => setMoreMenuOpen(false)}
                          >
                            <i className="ri-close-line text-lg"></i>
                          </button>
                        </div>
                        <div className="py-2 max-h-[60vh] overflow-y-auto">
                          {secondaryNav.map(item => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors duration-200 ${
                                item.current
                                  ? 'bg-slate-900/80 text-purple-300 border border-slate-700'
                                  : 'text-slate-300 hover:text-slate-50 hover:bg-slate-900/60 border border-transparent'
                              }`}
                              onClick={() => {
                                setMoreMenuOpen(false);
                                setMobileNavOpen(false);
                              }}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <i className={`${item.icon} text-slate-400 text-lg`}></i>
                                <span className="truncate">{item.name}</span>
                              </div>
                              <i className="ri-arrow-right-line text-xs text-slate-500" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-x-3 sm:gap-x-4 lg:gap-x-6">
            {/* Mobile nav toggle */}
            <button
              type="button"
              className="-m-1.5 p-1.5 text-slate-200 md:hidden hover:bg-slate-800 rounded-lg transition-colors duration-200"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              <span className="sr-only">Abrir navegación</span>
              <i className="ri-menu-line text-2xl"></i>
            </button>

            {/* Logout button */}
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-slate-900/80 text-slate-100 hover:bg-slate-800 border border-slate-700 transition-colors duración-200"
              onClick={handleSignOut}
            >
              <i className="ri-logout-box-line mr-2 text-slate-400"></i>
              Cerrar sesión
            </button>
          </div>
        </div>
        {/* Breadcrumbs row */}
        <div className="border-t border-slate-800 px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <i className="ri-home-line"></i>
            <span>/</span>
            <span className="font-medium text-slate-100 capitalize">
              {location.pathname.split('/').filter(Boolean).join(' / ') || 'Dashboard'}
            </span>
          </div>
        </div>

        {/* Mobile navigation modules */}
        {mobileNavOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950/95">
            <div className="px-4 py-3 space-y-2">
              {navigation.map(renderNavItem)}
            </div>
          </div>
        )}
      </header>

      {/* Page content full width */}
      <main className="flex-1">
        <div className="py-4 sm:py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </main>

      {/* Click outside to close dropdowns */}
      {moreMenuOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => {
            setMoreMenuOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default DashboardLayout;