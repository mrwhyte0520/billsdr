
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { usePlans } from '../../hooks/usePlans';

interface TrialGuardProps {
  children: ReactNode;
  feature?: string;
}

export default function TrialGuard({ children, feature }: TrialGuardProps) {
  const { hasAccess, trialInfo } = usePlans();

  if (!hasAccess()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 to-navy-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <i className="ri-lock-line text-6xl text-red-500 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acceso Restringido
            </h2>
            <p className="text-gray-600">
              Tu período de prueba ha expirado. Para continuar usando Contabi RD, 
              selecciona un plan de suscripción.
            </p>
          </div>

          {feature && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Función solicitada:</strong> {feature}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              to="/plans"
              className="w-full bg-gradient-to-r from-navy-600 to-navy-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-navy-700 hover:to-navy-800 transition-all duration-200 block"
            >
              Ver Planes de Suscripción
            </Link>
            
            <Link
              to="/dashboard"
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 block"
            >
              Volver al Dashboard
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              ¿Necesitas ayuda? Contacta nuestro soporte
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
