
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }
    
    const { error } = await signUp(formData.email, formData.password, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      companyName: formData.companyName,
      phone: formData.phone
    });
    
    if (error) {
      if (error.message.includes('already registered') || error.message.includes('already been registered')) {
        setError('Este correo electrónico ya está registrado');
      } else if (error.message.includes('Password should be at least')) {
        setError('La contraseña debe tener al menos 6 caracteres');
      } else if (error.message.includes('Invalid email')) {
        setError('El formato del correo electrónico no es válido');
      } else {
        setError('Error al crear la cuenta. Por favor intenta nuevamente.');
      }
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-slate-950 to-slate-950" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute top-40 -left-40 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="relative max-w-md w-full rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl shadow-purple-500/30 p-8 text-center backdrop-blur">
          <div className="mb-6">
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
            <i className="ri-check-circle-line text-5xl text-emerald-400 mb-3"></i>
            <h2 className="text-2xl font-bold text-slate-50 mb-2">¡Cuenta creada exitosamente!</h2>
            <p className="text-slate-300 text-sm">Estamos preparando tu panel. Serás redirigido en unos segundos...</p>
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
            Crear cuenta
          </h2>
          <p className="mt-2 text-slate-300 text-sm">
            Regístrate para comenzar tu prueba y configurar tu empresa.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl shadow-purple-500/30 p-8 backdrop-blur">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-400 text-red-300 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6 mt-2" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-200 mb-2">
                  Nombre
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-md text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Juan"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-200 mb-2">
                  Apellido
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-md text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Pérez"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-md text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-slate-200 mb-2">
                Nombre de la Empresa
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-md text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Mi Empresa LLC"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-200 mb-2">
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-md text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="(555) 123-4567"
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
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-md text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-slate-400">Mínimo 6 caracteres</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200 mb-2">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-md text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
              />
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
                    Creando cuenta...
                  </div>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-300">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="font-medium text-purple-300 hover:text-purple-200">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
