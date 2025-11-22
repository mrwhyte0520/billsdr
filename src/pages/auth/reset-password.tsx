
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the required tokens
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      setError('Enlace de recuperación inválido o expirado');
      return;
    }

    // Set the session with the tokens
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError('Error al actualizar la contraseña. Por favor intenta nuevamente.');
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-navy-gradient flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-navy-gradient-light rounded-xl shadow-lg p-8 text-center border border-navy-600">
          <div className="mb-6">
            <i className="ri-check-circle-line text-6xl text-green-400 mb-4"></i>
            <h2 className="text-2xl font-bold text-white mb-2">¡Contraseña actualizada!</h2>
            <p className="text-gray-300">Tu contraseña ha sido cambiada exitosamente. Redirigiendo al login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-gradient flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: '"Pacifico", serif' }}>
            Contabi RD
          </h1>
          <h2 className="text-xl font-semibold text-gray-200">
            Nueva Contraseña
          </h2>
          <p className="mt-2 text-gray-300">
            Ingresa tu nueva contraseña
          </p>
        </div>

        <div className="bg-navy-gradient-light rounded-lg shadow-xl p-8 border border-navy-600">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-400 text-red-300 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Nueva Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-navy-800 border border-navy-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-400">Mínimo 6 caracteres</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-navy-800 border border-navy-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Actualizando...
                  </div>
                ) : (
                  'Actualizar Contraseña'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
