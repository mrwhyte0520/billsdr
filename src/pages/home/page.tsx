
import { Link } from 'react-router-dom';

export default function HomePage() {
  const features = [
    {
      icon: 'ri-file-text-line',
      title: 'Facturación Completa',
      description: 'Genera facturas con NCF, integración con Banco Azul y gestión de comprobantes de pago.'
    },
    {
      icon: 'ri-calculator-line',
      title: 'Contabilidad Avanzada',
      description: 'Catálogo de cuentas, asientos contables automáticos y reportes financieros completos.'
    },
    {
      icon: 'ri-file-chart-line',
      title: 'Reportes Fiscales',
      description: 'Genera reportes de impuestos y ventas listos para tu contador o tu software fiscal.'
    },
    {
      icon: 'ri-bank-line',
      title: 'Gestión Bancaria',
      description: 'Conciliación bancaria automática y gestión de transferencias con tus bancos en Estados Unidos.'
    },
    {
      icon: 'ri-group-line',
      title: 'Multi-empresa',
      description: 'Gestiona múltiples empresas desde una sola cuenta con roles y permisos.'
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Cumplimiento Fiscal',
      description: 'Organiza tu información para cumplir con las obligaciones fiscales federales y estatales.'
    }
  ];

  const plans = [
    {
      name: 'PYME',
      price: '$19.97',
      period: '/mes',
      features: [
        'Una empresa',
        'Facturación básica',
        'Dashboard básico',
        'Inventario limitado (500)',
        'Soporte por email',
        'Prueba gratis 15 días'
      ],
      popular: false
    },
    {
      name: 'PRO',
      price: '$49.97',
      period: '/mes',
      features: [
        'Hasta 3 empresas',
        'Contabilidad completa',
        'Dashboard básico',
        'Inventario limitado (2,000)',
        'Gestión bancaria básica',
        'Nómina básica (10 empleados)',
        'Soporte prioritario',
        'Prueba gratis 15 días'
      ],
      popular: true
    },
    {
      name: 'PLUS',
      price: '$99.97',
      period: '/mes',
      features: [
        'Empresas ilimitadas',
        'Todas las funciones',
        'Dashboard KPI avanzado',
        'Inventario ilimitado',
        'Nómina completa',
        'API personalizada',
        'Análisis financiero avanzado',
        'Soporte 24/7',
        'Prueba gratis 15 días'
      ],
      popular: false
    }
  ];

  const handleSmoothScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-sky-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-sm font-bold tracking-tight">BD</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: '"Pacifico", serif' }}>
                  BILLS DR
                </h1>
                <span className="text-xs text-slate-400 -mt-0.5">Contabilidad & Facturación</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <button
                onClick={() => handleSmoothScroll('features')}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Características
              </button>
              <button
                onClick={() => handleSmoothScroll('pricing')}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Precios
              </button>
              <Link
                to="/login"
                className="text-slate-200 hover:text-white cursor-pointer"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 px-4 py-2 rounded-lg hover:brightness-110 whitespace-nowrap cursor-pointer shadow-md shadow-purple-500/40"
              >
                Prueba Gratis
              </Link>
            </div>
            <div className="md:hidden">
              <button className="text-slate-200 hover:text-white cursor-pointer">
                <i className="ri-menu-line text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-slate-950 to-slate-950" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute top-40 -left-40 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="relative py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-slate-950/60 px-3 py-1 text-xs font-medium text-purple-200 mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Plataforma contable y de facturación para pequeñas empresas en EE.UU.
                </span>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
                  Contabilidad
                  <span className="block bg-gradient-to-r from-purple-400 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">
                    inteligente con BILLS DR
                  </span>
                </h1>
                <p className="text-lg text-slate-300 mb-8 max-w-xl">
                  Centraliza facturación, contabilidad y reportes de negocio en una sola plataforma moderna,
                  diseñada para pequeñas y medianas empresas en Estados Unidos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 px-8 py-4 rounded-xl hover:brightness-110 text-center font-semibold whitespace-nowrap cursor-pointer shadow-lg shadow-purple-500/40"
                  >
                    Comenzar prueba gratis
                  </Link>
                  <button
                    onClick={() => handleSmoothScroll('features')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-900/60 cursor-pointer"
                  >
                    Ver funcionalidades
                    <i className="ri-arrow-down-line text-sm" />
                  </button>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <i className="ri-shield-check-line text-emerald-400 text-sm" />
                    </span>
                    Preparado para cumplimiento fiscal federal y estatal en EE.UU.
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <i className="ri-time-line text-purple-300 text-sm" />
                    </span>
                    Prueba gratis 15 días, sin tarjeta
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500/30 via-fuchsia-500/10 to-sky-400/10 rounded-3xl blur-2xl" />
                <div className="relative rounded-3xl border border-slate-800 bg-slate-950/70 p-4 shadow-2xl shadow-purple-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <span className="text-xs text-slate-300">Panel principal BILLS DR</span>
                    </div>
                    <span className="text-xs text-slate-500">Hoy · USD</span>
                  </div>
                  <img
                    src="https://readdy.ai/api/search-image?query=Dark%20mode%20SaaS%20accounting%20dashboard%20purple%20and%20grey%20gradient%2C%20financial%20charts%20and%20invoices%20for%20Dominican%20businesses%2C%20modern%20UI&width=900&height=520&seq=bills-dr-hero&orientation=landscape"
                    alt="Dashboard de BILLS DR"
                    className="rounded-2xl border border-slate-800 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-fuchsia-200 to-sky-200 bg-clip-text text-transparent">
              Todo lo que necesitas para tu contabilidad
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Automatiza facturación, bancos y reportes financieros con una interfaz moderna pensada para
              el día a día de las empresas en Estados Unidos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-purple-500/60 hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/40 to-fuchsia-500/30 flex items-center justify-center mb-4">
                  <i className={`${feature.icon} text-xl text-purple-100`}></i>
                </div>
                <h3 className="text-lg font-semibold text-slate-50 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Planes que crecen con tu empresa</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Comienza gratis y escala a medida que tu operación contable se hace más compleja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border p-8 flex flex-col h-full ${
                  plan.popular
                    ? 'border-purple-500/80 bg-gradient-to-b from-purple-900/60 via-slate-950 to-slate-950 shadow-xl shadow-purple-500/40'
                    : 'border-slate-800 bg-slate-950/60'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-slate-950 px-4 py-1 rounded-full text-xs font-semibold shadow-md shadow-purple-500/40">
                      Más Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8 mt-2">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1 text-sm">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <span className="mt-0.5 h-4 w-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <i className="ri-check-line text-emerald-400 text-xs" />
                      </span>
                      <span className="text-slate-200">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-center block whitespace-nowrap cursor-pointer text-sm ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 hover:brightness-110 shadow-lg shadow-purple-500/40'
                      : 'bg-slate-900 text-slate-100 border border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Comenzar ahora
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-slate-950 to-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            ¿Listo para modernizar tu contabilidad con BILLS DR?
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Únete a las empresas que ya automatizan sus procesos contables y de facturación con una
            plataforma pensada para el mercado de Estados Unidos.
          </p>
          <Link
            to="/register"
            className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 px-8 py-4 rounded-xl hover:brightness-110 font-semibold text-lg whitespace-nowrap cursor-pointer shadow-lg shadow-purple-500/40"
          >
            Comenzar prueba gratis de 15 días
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ fontFamily: '"Pacifico", serif' }}>
                BILLS DR
              </h3>
              <p className="text-slate-400 text-sm">
                Plataforma moderna de contabilidad y facturación electrónica diseñada para pequeñas y
                medianas empresas en Estados Unidos.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm">Producto</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <button
                    onClick={() => handleSmoothScroll('features')}
                    className="hover:text-slate-100 cursor-pointer"
                  >
                    Características
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSmoothScroll('pricing')}
                    className="hover:text-slate-100 cursor-pointer"
                  >
                    Precios
                  </button>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-slate-100 cursor-pointer">
                    Integraciones
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm">Soporte</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <Link to="/dashboard" className="hover:text-slate-100 cursor-pointer">
                    Centro de ayuda
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-slate-100 cursor-pointer">
                    Estado del sistema
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <Link to="/dashboard" className="hover:text-slate-100 cursor-pointer">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-slate-100 cursor-pointer">
                    Términos
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-slate-100 cursor-pointer">
                    Seguridad
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-900 mt-8 pt-8 text-center text-slate-500 text-xs">
            <p>
              &copy; 2024 BILLS DR. Todos los derechos reservados.
              <a
                href="https://readdy.ai/?origin=logo"
                className="hover:text-slate-300 ml-1 cursor-pointer"
              >
                Powered by Readdy
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
