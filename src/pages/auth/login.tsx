
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const { signIn, resetPassword, getRememberedUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load remembered user email
    const rememberedEmail = getRememberedUser();
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, [getRememberedUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await signIn(email, password, rememberMe);
    
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Credenciales inválidas. Por favor verifica tu email y contraseña.');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Por favor confirma tu email antes de iniciar sesión.');
      } else {
        setError('Error al iniciar sesión. Por favor intenta nuevamente.');
      }
    } else {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setError('');
    
    const { error } = await resetPassword(resetEmail);
    
    if (error) {
      setError('Error al enviar el email de recuperación. Verifica que el email sea correcto.');
    } else {
      setResetSuccess(true);
    }
    
    setResetLoading(false);
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-slate-950 to-slate-950" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute top-40 -left-40 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="relative max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-sky-400 flex items-center justify-center shadow-lg shadow-purple-500/40">
                <span className="text-sm font-bold tracking-tight">BD</span>
              </div>
              <div className="flex flex-col items-start">
                <h1 className="text-2xl font-bold text-slate-50" style={{ fontFamily: '"Pacifico", serif' }}>
                  BILLS DR
                </h1>
                <span className="text-xs text-slate-400">Plataforma contable y de facturación</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-slate-50">
              Recuperar contraseña
            </h2>
            <p className="mt-2 text-slate-300 text-sm">
              Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl shadow-purple-500/30 p-8 backdrop-blur">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-400 text-red-300 rounded-md text-sm">
                {error}
              </div>
            )}

            {resetSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/60 text-emerald-200 rounded-md text-sm">
                Te hemos enviado un email con instrucciones para recuperar tu contraseña.
              </div>
            )}

            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div>
                <label htmlFor="resetEmail" className="block text-sm font-medium text-slate-200 mb-2">
                  Correo Electrónico
                </label>
                <input
                  id="resetEmail"
                  name="resetEmail"
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-md text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-xl text-slate-950 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap shadow-lg shadow-purple-500/40"
                >
                  {resetLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </div>
                  ) : (
                    'Enviar Instrucciones'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full flex justify-center py-2 px-4 border border-slate-700 text-sm font-medium rounded-xl text-slate-300 bg-transparent hover:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 whitespace-nowrap"
                >
                  Volver al Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-slate-950 to-slate-950" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute top-40 -left-40 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="relative max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-sky-400 flex items-center justify-center shadow-lg shadow-purple-500/40">
              <span className="text-sm font-bold tracking-tight">BD</span>
            </div>
            <div className="flex flex-col items-start">
              <h1 className="text-2xl font-bold text-slate-50" style={{ fontFamily: '"Pacifico", serif' }}>
                BILLS DR
              </h1>
              <span className="text-xs text-slate-400">Plataforma contable y de facturación</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-50">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-slate-300 text-sm">
            Accede a tu panel para gestionar facturación, contabilidad y reportes.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl shadow-purple-500/30 p-8 backdrop-blur">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-400 text-red-300 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6 mt-2" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-md text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-md text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-slate-700 rounded bg-slate-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="font-medium text-purple-300 hover:text-purple-200"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-xl text-slate-950 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap shadow-lg shadow-purple-500/40"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-300">
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="font-medium text-purple-300 hover:text-purple-200">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
