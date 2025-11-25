import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { settingsService } from '../../services/database';

interface SettingsSection {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
}

interface ChangeHistoryItem {
  id: string;
  section: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

const settingsSections: SettingsSection[] = [
  {
    id: 'company',
    name: 'Información de la Empresa',
    description: 'Configurar datos básicos de la empresa, logo y contacto',
    icon: 'ri-building-line',
    href: '/settings/company'
  },
  {
    id: 'accounting',
    name: 'Configuración Contable',
    description: 'Configurar períodos fiscales, monedas y políticas contables',
    icon: 'ri-calculator-line',
    href: '/settings/accounting'
  },
  {
    id: 'taxes',
    name: 'Configuración de Impuestos',
    description: 'Configurar tipos de impuestos, tasas y reglas fiscales',
    icon: 'ri-percent-line',
    href: '/settings/taxes'
  },
  {
    id: 'inventory',
    name: 'Configuración de Inventario',
    description: 'Configurar métodos de valuación, categorías y almacenes',
    icon: 'ri-archive-line',
    href: '/settings/inventory'
  },
  {
    id: 'backup',
    name: 'Respaldos y Seguridad',
    description: 'Configurar respaldos automáticos y políticas de seguridad',
    icon: 'ri-shield-check-line',
    href: '/settings/backup'
  }
];

export default function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredSections = settingsSections.filter(section =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSectionClick = (href: string) => {
    window.REACT_APP_NAVIGATE(href);
  };

  const handleExportConfiguration = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      // Obtener todas las configuraciones del sistema
      const [
        companyInfo, 
        accountingSettings, 
        taxSettings, 
        inventorySettings,
        taxRates,
        warehouses
      ] = await Promise.all([
        settingsService.getCompanyInfo(),
        settingsService.getAccountingSettings(),
        settingsService.getTaxSettings(),
        settingsService.getInventorySettings(),
        settingsService.getTaxRates(),
        settingsService.getWarehouses()
      ]);

      // Crear objeto de configuración completa
      const configData = {
        exportInfo: {
          exportDate: new Date().toISOString(),
          version: '1.0',
          systemName: 'Contabi RD',
          description: 'Configuración completa del sistema contable'
        },
        companyInfo: companyInfo || null,
        accountingSettings: accountingSettings || null,
        taxSettings: taxSettings || null,
        inventorySettings: inventorySettings || null,
        taxRates: taxRates || [],
        warehouses: warehouses || []
      };

      // Crear y descargar archivo JSON
      const blob = new Blob([JSON.stringify(configData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contabi-configuracion-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ 
        type: 'success', 
        text: 'Configuración exportada exitosamente. El archivo se ha descargado.' 
      });
    } catch (error) {
      console.error('Error exporting configuration:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error al exportar la configuración. Inténtalo de nuevo.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportConfiguration = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setLoading(true);
      setMessage(null);
      
      try {
        const text = await file.text();
        const configData = JSON.parse(text);

        // Validar estructura del archivo
        if (!configData.exportInfo || !configData.exportInfo.version) {
          throw new Error('Archivo de configuración inválido o corrupto');
        }

        // Verificar que es un archivo de Contabi RD
        if (configData.exportInfo.systemName !== 'Contabi RD') {
          throw new Error('Este archivo no es compatible con Contabi RD');
        }

        let importedSections = 0;

        // Importar configuraciones una por una
        if (configData.companyInfo) {
          await settingsService.saveCompanyInfo(configData.companyInfo);
          importedSections++;
        }

        if (configData.accountingSettings) {
          await settingsService.saveAccountingSettings(configData.accountingSettings);
          importedSections++;
        }

        if (configData.taxSettings) {
          await settingsService.saveTaxSettings(configData.taxSettings);
          importedSections++;
        }

        if (configData.inventorySettings) {
          await settingsService.saveInventorySettings(configData.inventorySettings);
          importedSections++;
        }

        // Importar tasas de impuestos
        if (configData.taxRates && Array.isArray(configData.taxRates)) {
          for (const rate of configData.taxRates) {
            try {
              await settingsService.createTaxRate(rate);
            } catch (error) {
              // Continuar si ya existe
              console.warn('Tax rate already exists or error creating:', error);
            }
          }
        }

        // Importar almacenes
        if (configData.warehouses && Array.isArray(configData.warehouses)) {
          for (const warehouse of configData.warehouses) {
            try {
              await settingsService.createWarehouse(warehouse);
            } catch (error) {
              // Continuar si ya existe
              console.warn('Warehouse already exists or error creating:', error);
            }
          }
        }

        setMessage({ 
          type: 'success', 
          text: `Configuración importada exitosamente. ${importedSections} secciones actualizadas.` 
        });
      } catch (error) {
        console.error('Error importing configuration:', error);
        let errorMessage = 'Error al importar la configuración.';
        
        if (error instanceof SyntaxError) {
          errorMessage = 'El archivo seleccionado no es un JSON válido.';
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        setMessage({ type: 'error', text: errorMessage });
      } finally {
        setLoading(false);
      }
    };
    input.click();
  };

  const handleResetConfiguration = async () => {
    setLoading(true);
    try {
      // Restablecer configuraciones a valores por defecto para la versión general de BILLS DR
      const defaultAccountingSettings = {
        fiscal_year_start: '2024-01-01',
        fiscal_year_end: '2024-12-31',
        default_currency: 'DOP',
        decimal_places: 2,
        date_format: 'DD/MM/YYYY',
        number_format: '1,234.56',
        auto_backup: true,
        backup_frequency: 'daily',
        retention_period: 30
      };

      const defaultTaxSettings = {
        itbis_rate: 18.0,
        isr_rate: 27.0,
        retention_rate: 10.0,
        declaration_frequency: 'monthly',
        fiscal_year_start: '2024-01-01',
        fiscal_year_end: '2024-12-31'
      };

      const defaultInventorySettings = {
        valuation_method: 'FIFO',
        auto_reorder: false,
        track_serial_numbers: false,
        track_expiration_dates: false,
        default_warehouse: 'Principal'
      };

      await Promise.all([
        settingsService.saveAccountingSettings(defaultAccountingSettings),
        settingsService.saveTaxSettings(defaultTaxSettings),
        settingsService.saveInventorySettings(defaultInventorySettings)
      ]);

      setMessage({ 
        type: 'success', 
        text: 'Configuración restablecida a valores por defecto del sistema' 
      });
      setShowResetModal(false);
    } catch (error) {
      console.error('Error resetting configuration:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error al restablecer la configuración' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data para historial de cambios
  const changeHistory: ChangeHistoryItem[] = [
    {
      id: '1',
      section: 'Información de la Empresa',
      action: 'Actualización',
      user: 'Admin',
      timestamp: new Date().toISOString(),
      details: 'Actualizado nombre de la empresa y dirección'
    },
    {
      id: '2',
      section: 'Configuración de Impuestos',
      action: 'Modificación',
      user: 'Contador',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      details: 'Modificada tasa de ITBIS de 18% a 18%'
    },
    {
      id: '3',
      section: 'Gestión de Usuarios',
      action: 'Creación',
      user: 'Admin',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      details: 'Creado nuevo usuario con rol de Contador'
    }
  ];

  // Auto-hide message after 5 seconds
  useState(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-xl border text-sm ${
              message.type === 'success'
                ? 'bg-emerald-950/70 text-emerald-200 border-emerald-500/60'
                : 'bg-rose-950/70 text-rose-200 border-rose-500/60'
            }`}
          >
            <div className="flex items-center">
              <i
                className={`${
                  message.type === 'success'
                    ? 'ri-check-circle-line text-emerald-300'
                    : 'ri-error-warning-line text-rose-300'
                } mr-2`}
              ></i>
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-slate-950/80 rounded-2xl shadow-lg shadow-slate-950/60 border border-slate-800 p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-slate-50">Configuración del Sistema</h1>
              <p className="text-slate-400 mt-1 text-sm">
                Administra la configuración general de tu sistema empresarial
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-search-line text-slate-500"></i>
                </div>
                <input
                  type="text"
                  placeholder="Buscar configuración..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              onClick={() => handleSectionClick(section.href)}
              className="bg-slate-950/80 rounded-2xl border border-slate-800 p-6 shadow-sm shadow-slate-950/40 hover:shadow-xl hover:border-purple-500/70 transition-all cursor-pointer group"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-center group-hover:border-purple-500 group-hover:bg-slate-900 transition-colors">
                    <i className={`${section.icon} text-purple-300 text-xl`}></i>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-50 group-hover:text-purple-300 transition-colors">
                    {section.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {section.description}
                  </p>
                  <div className="mt-3 flex items-center text-sm text-purple-300 group-hover:text-purple-200">
                    <span>Configurar</span>
                    <i className="ri-arrow-right-line ml-1"></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-950/80 rounded-2xl shadow-lg shadow-slate-950/60 border border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-slate-50 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={handleExportConfiguration}
              disabled={loading}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border border-emerald-500/60 bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <i className={`${loading ? 'ri-loader-4-line animate-spin' : 'ri-download-line'}`}></i>
              <span>{loading ? 'Exportando...' : 'Exportar Configuración'}</span>
            </button>
            <button
              onClick={handleImportConfiguration}
              disabled={loading}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border border-sky-500/60 bg-sky-950/60 text-sky-200 hover:bg-sky-900/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <i className={`${loading ? 'ri-loader-4-line animate-spin' : 'ri-upload-line'}`}></i>
              <span>{loading ? 'Importando...' : 'Importar Configuración'}</span>
            </button>
            <button
              onClick={() => setShowResetModal(true)}
              disabled={loading}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border border-amber-500/70 bg-amber-950/60 text-amber-200 hover:bg-amber-900/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <i className="ri-refresh-line"></i>
              <span>Restablecer Valores</span>
            </button>
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border border-purple-500/70 bg-purple-950/60 text-purple-200 hover:bg-purple-900/70 transition-colors whitespace-nowrap"
            >
              <i className="ri-history-line"></i>
              <span>Historial de Cambios</span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-slate-950/80 rounded-2xl shadow-lg shadow-slate-950/60 border border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-slate-50 mb-4">Estado del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50">
              <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-emerald-200">Base de Datos</p>
                <p className="text-xs text-emerald-400">Conectada y funcionando</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50">
              <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-emerald-200">Respaldos</p>
                <p className="text-xs text-emerald-400">Último: Hoy 03:00 AM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-amber-950/70 border border-amber-500/50">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-amber-200">Actualizaciones</p>
                <p className="text-xs text-amber-400">1 actualización disponible</p>
              </div>
            </div>
          </div>
        </div>

        {/* History Modal */}
        {showHistoryModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-slate-950 rounded-2xl shadow-2xl shadow-slate-950/80 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden border border-slate-800">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h3 className="text-lg font-semibold text-slate-50">Historial de Cambios</h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-full p-1.5"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  {changeHistory.map((item) => (
                    <div key={item.id} className="border border-slate-800 rounded-xl p-4 bg-slate-950/80">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-slate-50">{item.section}</h4>
                            <span
                              className={`px-2 py-1 text-xs rounded-full border ${
                                item.action === 'Creación'
                                  ? 'bg-emerald-950/60 text-emerald-200 border-emerald-500/50'
                                  : item.action === 'Actualización'
                                  ? 'bg-sky-950/60 text-sky-200 border-sky-500/50'
                                  : 'bg-amber-950/60 text-amber-200 border-amber-500/50'
                              }`}
                            >
                              {item.action}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 mt-1">{item.details}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                            <span>Por: {item.user}</span>
                            <span>{new Date(item.timestamp).toLocaleString('es-DO')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-slate-950 rounded-2xl shadow-2xl shadow-slate-950/80 max-w-md w-full mx-4 border border-slate-800">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-amber-950/70 rounded-full flex items-center justify-center">
                    <i className="ri-alert-line text-amber-300"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-50">Confirmar Restablecimiento</h3>
                </div>
                <p className="text-slate-400 mb-6 text-sm">
                  ¿Estás seguro de que deseas restablecer todas las configuraciones a sus valores por defecto del sistema?
                  Esta acción no se puede deshacer.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowResetModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-700 rounded-lg text-slate-200 hover:bg-slate-900 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleResetConfiguration}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-amber-600 text-slate-950 rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Restableciendo...' : 'Restablecer'}
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
