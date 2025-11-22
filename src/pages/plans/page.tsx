
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  color: string;
  icon: string;
}

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(15);
  const [isTrialActive, setIsTrialActive] = useState(true);

  const plans: Plan[] = [
    {
      id: 'pyme',
      name: 'PYME',
      price: 19.97,
      period: '/mes',
      description: 'Perfecto para pequeñas empresas',
      features: [
        'Una empresa',
        'Facturación básica con NCF',
        'Reportes básicos de ventas e impuestos',
        'Inventario hasta 500 productos',
        'Dashboard básico',
        'Soporte por email',
        'Backup diario',
        'Usuarios: 2'
      ],
      popular: false,
      color: 'from-blue-500 to-blue-600',
      icon: 'ri-building-2-line'
    },
    {
      id: 'pro',
      name: 'PRO',
      price: 49.97,
      period: '/mes',
      description: 'Para empresas en crecimiento',
      features: [
        'Hasta 3 empresas',
        'Contabilidad completa',
        'Reportes avanzados de ventas e impuestos',
        'Inventario hasta 2,000 productos',
        'Dashboard básico',
        'Gestión bancaria básica',
        'Nómina básica (hasta 10 empleados)',
        'Soporte prioritario',
        'Usuarios: 5'
      ],
      popular: true,
      color: 'from-indigo-500 to-indigo-600',
      icon: 'ri-rocket-line'
    },
    {
      id: 'plus',
      name: 'PLUS',
      price: 99.97,
      period: '/mes',
      description: 'Solución empresarial completa',
      features: [
        'Empresas ilimitadas',
        'Todas las funciones contables',
        'Dashboard KPI avanzado',
        'Inventario ilimitado',
        'API personalizada',
        'Integración con bancos y pasarelas de pago',
        'Nómina completa (empleados ilimitados)',
        'Reportes personalizados',
        'Análisis financiero avanzado',
        'Soporte 24/7',
        'Usuarios: Ilimitados'
      ],
      popular: false,
      color: 'from-purple-500 to-purple-600',
      icon: 'ri-vip-crown-line'
    }
  ];

  useEffect(() => {
    // Simulate trial countdown
    const interval = setInterval(() => {
      if (trialDaysLeft > 0) {
        setTrialDaysLeft(prev => prev - 1);
      } else {
        setIsTrialActive(false);
      }
    }, 86400000); // 24 hours

    return () => clearInterval(interval);
  }, [trialDaysLeft]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    // Here will integrate with Banco Azul
    alert('Integración con Banco Azul próximamente');
    setShowPaymentModal(false);
  };

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-700 to-navy-800 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Planes y Suscripciones</h1>
              <p className="text-navy-200">Elige el plan perfecto para tu empresa</p>
            </div>
            <div className="text-right">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm text-navy-200">Prueba gratuita</div>
                <div className="text-2xl font-bold">{trialDaysLeft} días</div>
                <div className="text-sm text-navy-200">restantes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trial Warning */}
        {trialDaysLeft <= 5 && isTrialActive && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 text-white">
            <div className="flex items-center">
              <i className="ri-alarm-warning-line text-2xl mr-3"></i>
              <div>
                <h3 className="font-semibold">¡Tu prueba gratuita está por vencer!</h3>
                <p className="text-sm opacity-90">
                  Te quedan {trialDaysLeft} días. Selecciona un plan para continuar usando Contabi RD.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Trial Expired */}
        {!isTrialActive && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white text-center">
            <i className="ri-lock-line text-4xl mb-3"></i>
            <h3 className="text-xl font-bold mb-2">Prueba gratuita expirada</h3>
            <p className="mb-4">Para continuar usando Contabi RD, selecciona un plan de suscripción.</p>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'border-indigo-500 scale-105' : 'border-gray-200 hover:border-navy-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-center py-2 text-sm font-semibold">
                  Más Popular
                </div>
              )}

              <div className={`bg-gradient-to-r ${plan.color} p-6 text-white ${plan.popular ? 'pt-12' : ''}`}>
                <div className="text-center">
                  <i className={`${plan.icon} text-4xl mb-3`}></i>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-lg ml-1">{plan.period}</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="text-sm opacity-75">
                      <span className="line-through">${plan.originalPrice}</span>
                      <span className="ml-2 bg-white/20 px-2 py-1 rounded">80% OFF</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={!isTrialActive && trialDaysLeft === 0}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700'
                      : 'bg-gradient-to-r from-navy-600 to-navy-700 text-white hover:from-navy-700 hover:to-navy-800'
                  } ${(!isTrialActive && trialDaysLeft === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isTrialActive || trialDaysLeft > 0 ? 'Seleccionar Plan' : 'Suscribirse Ahora'}
                </button>

                <div className="text-center mt-3">
                  <span className="text-xs text-gray-500">15 días de prueba gratuita</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Comparación de Características
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Características</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">PYME</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">PRO</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">PLUS</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Número de empresas</td>
                  <td className="py-3 px-4 text-center">1</td>
                  <td className="py-3 px-4 text-center">3</td>
                  <td className="py-3 px-4 text-center">Ilimitadas</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Usuarios</td>
                  <td className="py-3 px-4 text-center">2</td>
                  <td className="py-3 px-4 text-center">5</td>
                  <td className="py-3 px-4 text-center">Ilimitados</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Productos en inventario</td>
                  <td className="py-3 px-4 text-center">500</td>
                  <td className="py-3 px-4 text-center">2,000</td>
                  <td className="py-3 px-4 text-center">Ilimitados</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Dashboard</td>
                  <td className="py-3 px-4 text-center">Básico</td>
                  <td className="py-3 px-4 text-center">Básico</td>
                  <td className="py-3 px-4 text-center">KPI Avanzado</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Empleados en nómina</td>
                  <td className="py-3 px-4 text-center">N/A</td>
                  <td className="py-3 px-4 text-center">10</td>
                  <td className="py-3 px-4 text-center">Ilimitados</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Integración Banco Azul</td>
                  <td className="py-3 px-4 text-center"><i className="ri-close-line text-red-500"></i></td>
                  <td className="py-3 px-4 text-center"><i className="ri-close-line text-red-500"></i></td>
                  <td className="py-3 px-4 text-center"><i className="ri-check-line text-green-500"></i></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">API personalizada</td>
                  <td className="py-3 px-4 text-center"><i className="ri-close-line text-red-500"></i></td>
                  <td className="py-3 px-4 text-center"><i className="ri-close-line text-red-500"></i></td>
                  <td className="py-3 px-4 text-center"><i className="ri-check-line text-green-500"></i></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Análisis financiero avanzado</td>
                  <td className="py-3 px-4 text-center"><i className="ri-close-line text-red-500"></i></td>
                  <td className="py-3 px-4 text-center"><i className="ri-close-line text-red-500"></i></td>
                  <td className="py-3 px-4 text-center"><i className="ri-check-line text-green-500"></i></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedPlanData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Confirmar Suscripción</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className={`bg-gradient-to-r ${selectedPlanData.color} rounded-lg p-4 text-white mb-4`}>
                <div className="text-center">
                  <i className={`${selectedPlanData.icon} text-3xl mb-2`}></i>
                  <h4 className="text-lg font-bold">{selectedPlanData.name}</h4>
                  <div className="text-2xl font-bold">${selectedPlanData.price}{selectedPlanData.period}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Incluye:</h5>
                  <ul className="space-y-1">
                    {selectedPlanData.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <i className="ri-check-line text-green-500 mr-2"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center text-blue-800">
                    <i className="ri-bank-line mr-2"></i>
                    <span className="font-semibold">Pago seguro con Banco Azul</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    Procesamiento seguro y confiable
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handlePayment}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-navy-600 to-navy-700 text-white rounded-lg hover:from-navy-700 hover:to-navy-800"
                  >
                    Proceder al Pago
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
