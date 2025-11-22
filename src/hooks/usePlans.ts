import { useState, useEffect } from 'react';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  active: boolean;
}

interface TrialInfo {
  isActive: boolean;
  daysLeft: number;
  startDate: Date;
  endDate: Date;
}

export function usePlans() {
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [trialInfo, setTrialInfo] = useState<TrialInfo>({
    isActive: true,
    daysLeft: 15,
    startDate: new Date(),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
  });

  useEffect(() => {
    // Load trial info from localStorage or API
    const savedTrialInfo = localStorage.getItem('contard_trial_info');
    if (savedTrialInfo) {
      const parsed = JSON.parse(savedTrialInfo);
      const endDate = new Date(parsed.endDate);
      const now = new Date();
      const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      
      setTrialInfo({
        ...parsed,
        endDate: new Date(parsed.endDate),
        startDate: new Date(parsed.startDate),
        daysLeft,
        isActive: daysLeft > 0
      });
    } else {
      // First time user - start trial
      const startDate = new Date();
      const endDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
      const newTrialInfo = {
        isActive: true,
        daysLeft: 15,
        startDate,
        endDate
      };
      
      localStorage.setItem('contard_trial_info', JSON.stringify(newTrialInfo));
      setTrialInfo(newTrialInfo);
    }
  }, []);

  const subscribeToPlan = async (planId: string) => {
    try {
      // Here will integrate with Banco Azul payment processing
      console.log('Subscribing to plan:', planId);
      
      // Simulate successful subscription
      const plan: Plan = {
        id: planId,
        name: planId.toUpperCase(),
        price: getPlanPrice(planId),
        features: getPlanFeatures(planId),
        active: true
      };
      
      setCurrentPlan(plan);
      
      // End trial period
      setTrialInfo(prev => ({
        ...prev,
        isActive: false,
        daysLeft: 0
      }));
      
      localStorage.setItem('contard_current_plan', JSON.stringify(plan));
      
      return { success: true };
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      return { success: false, error };
    }
  };

  const cancelSubscription = async () => {
    try {
      setCurrentPlan(null);
      localStorage.removeItem('contard_current_plan');
      
      // Start new trial period
      const startDate = new Date();
      const endDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
      const newTrialInfo = {
        isActive: true,
        daysLeft: 15,
        startDate,
        endDate
      };
      
      setTrialInfo(newTrialInfo);
      localStorage.setItem('contard_trial_info', JSON.stringify(newTrialInfo));
      
      return { success: true };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return { success: false, error };
    }
  };

  const hasAccess = () => {
    return currentPlan?.active || trialInfo.isActive;
  };

  const getPlanPrice = (planId: string): number => {
    const prices: Record<string, number> = {
      'pyme': 19.97,
      'pro': 49.97,
      'plus': 99.97
    };
    return prices[planId] || 0;
  };

  const getPlanFeatures = (planId: string): string[] => {
    const features: Record<string, string[]> = {
      'pyme': [
        'Una empresa', 
        'Facturación básica con NCF', 
        'Dashboard básico',
        'Reportes básicos de ventas e impuestos', 
        'Inventario limitado (500 productos)',
        '2 usuarios'
      ],
      'pro': [
        '3 empresas', 
        'Contabilidad completa', 
        'Dashboard básico',
        'Gestión bancaria básica', 
        'Inventario limitado (2,000 productos)',
        'Nómina básica (10 empleados)',
        '5 usuarios'
      ],
      'plus': [
        'Empresas ilimitadas', 
        'Todas las funciones contables', 
        'Dashboard KPI avanzado',
        'API personalizada', 
        'Inventario ilimitado',
        'Nómina completa',
        'Análisis financiero avanzado',
        'Usuarios ilimitados'
      ]
    };
    return features[planId] || [];
  };

  return {
    currentPlan,
    trialInfo,
    subscribeToPlan,
    cancelSubscription,
    hasAccess
  };
}
