
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { usePlans } from '../../hooks/usePlans';
import BasicDashboard from './components/BasicDashboard';
import AdvancedKPIDashboard from './components/AdvancedKPIDashboard';

export default function DashboardPage() {
  const { currentPlan, trialInfo, hasAccess } = usePlans();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // Determine if user has access to advanced dashboard
  const hasAdvancedDashboard = currentPlan?.id === 'plus' || 
    (trialInfo.isActive && trialInfo.daysLeft > 0);

  useEffect(() => {
    // Show upgrade prompt for basic plans
    if (currentPlan && (currentPlan.id === 'pyme' || currentPlan.id === 'pro')) {
      setShowUpgradePrompt(true);
    }
  }, [currentPlan]);

  if (!hasAccess()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center max-w-md bg-slate-950 border border-slate-800 rounded-2xl px-8 py-10 shadow-2xl shadow-purple-500/30">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-sky-400 flex items-center justify-center">
              <i className="ri-lock-line text-2xl text-slate-950"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-50 mb-2">Acceso restringido</h2>
            <p className="text-slate-300 mb-6 text-sm">
              Tu prueba gratuita ha expirado. Elige un plan para seguir utilizando BILLS DR.
            </p>
            <Link 
              to="/plans"
              className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 px-6 py-3 rounded-xl hover:brightness-110 font-semibold shadow-lg shadow-purple-500/40 whitespace-nowrap"
            >
              Ver planes disponibles
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Trial Status Banner */}
        {trialInfo.isActive && trialInfo.daysLeft <= 5 && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-4 text-white shadow-lg shadow-orange-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="ri-alarm-warning-line text-2xl mr-3"></i>
                <div>
                  <h3 className="font-semibold">¡Tu prueba gratuita está por vencer!</h3>
                  <p className="text-sm opacity-90">
                    Te quedan {trialInfo.daysLeft} días. Selecciona un plan para continuar.
                  </p>
                </div>
              </div>
              <Link 
                to="/plans"
                className="bg-white/15 hover:bg-white/25 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Ver Planes
              </Link>
            </div>
          </div>
        )}

        {/* Upgrade Prompt for Basic Plans */}
        {showUpgradePrompt && currentPlan && (currentPlan.id === 'pyme' || currentPlan.id === 'pro') && (
          <div className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-sky-500 rounded-2xl p-6 text-white relative shadow-xl shadow-purple-500/40">
            <button 
              onClick={() => setShowUpgradePrompt(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mr-4">
                <i className="ri-vip-crown-line text-2xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">¡Desbloquea el Dashboard KPI Avanzado!</h3>
                <p className="text-fuchsia-100 mb-4 text-sm">
                  Obtén análisis financiero avanzado, métricas en tiempo real y reportes personalizados 
                  actualizando al plan PLUS.
                </p>
                <Link 
                  to="/plans"
                  className="bg-white text-purple-700 px-6 py-2 rounded-xl hover:bg-slate-100 font-semibold whitespace-nowrap"
                >
                  Actualizar Plan
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Current Plan Info */}
        {currentPlan && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-lg shadow-slate-900/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-sky-400 rounded-xl flex items-center justify-center mr-3">
                  <i className="ri-vip-crown-line text-slate-950"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-50">Plan {currentPlan.name}</h3>
                  <p className="text-sm text-slate-400">
                    Dashboard {hasAdvancedDashboard ? 'KPI Avanzado' : 'Básico'} activo
                  </p>
                </div>
              </div>
              <Link 
                to="/plans"
                className="text-purple-300 hover:text-purple-200 text-sm font-medium"
              >
                Gestionar Plan
              </Link>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {hasAdvancedDashboard ? <AdvancedKPIDashboard /> : <BasicDashboard />}
      </div>
    </DashboardLayout>
  );
}
