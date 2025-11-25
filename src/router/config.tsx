import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

// Módulo de impuestos (República Dominicana) deshabilitado para la versión de EE.UU.

// Payroll module deshabilitado en esta versión

const HomePage = lazy(() => import('../pages/home/page'));
const DashboardPage = lazy(() => import('../pages/dashboard/page'));

const POSPage = lazy(() => import('../pages/pos/page'));
const ProductsPage = lazy(() => import('../pages/products/page'));
const InventoryPage = lazy(() => import('../pages/inventory/page'));
const AccountsReceivablePage = lazy(() => import('../pages/accounts-receivable/page'));
const AccountsPayablePage = lazy(() => import('../pages/accounts-payable/page'));
const BillingPage = lazy(() => import('../pages/billing/page'));
const PlansPage = lazy(() => import('../pages/plans/page'));
const LoginPage = lazy(() => import('../pages/auth/login'));
const RegisterPage = lazy(() => import('../pages/auth/register'));
const ResetPasswordPage = lazy(() => import('../pages/auth/reset-password'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));

// Settings Pages
const SettingsPage = lazy(() => import('../pages/settings/page'));
const CompanySettingsPage = lazy(() => import('../pages/settings/company/page'));
const UsersSettingsPage = lazy(() => import('../pages/settings/users/page'));
const AccountingSettingsPage = lazy(() => import('../pages/settings/accounting/page'));
const InventorySettingsPage = lazy(() => import('../pages/settings/inventory/page'));
const BackupSettingsPage = lazy(() => import('../pages/settings/backup/page'));
const IntegrationsSettingsPage = lazy(() => import('../pages/settings/integrations/page'));

// Billing Pages
const SalesReportsPage = lazy(() => import('../pages/billing/sales-reports/page'));
const InvoicingPage = lazy(() => import('../pages/billing/invoicing/page'));
const PreInvoicingPage = lazy(() => import('../pages/billing/pre-invoicing/page'));
const RecurringBillingPage = lazy(() => import('../pages/billing/recurring/page'));
const CashClosingPage = lazy(() => import('../pages/billing/cash-closing/page'));
const QuotesPage = lazy(() => import('../pages/billing/quotes/page'));

// Accounts Payable Pages
const APReportsPage = lazy(() => import('../pages/accounts-payable/reports/page'));
const SuppliersPage = lazy(() => import('../pages/accounts-payable/suppliers/page'));
const PaymentsPage = lazy(() => import('../pages/accounts-payable/payments/page'));
const PurchaseOrdersPage = lazy(() => import('../pages/accounts-payable/purchase-orders/page'));
const APQuotesPage = lazy(() => import('../pages/accounts-payable/quotes/page'));
const AdvancesPage = lazy(() => import('../pages/accounts-payable/advances/page'));

// Accounts Receivable Pages
const ARInvoicesPage = lazy(() => import('../pages/accounts-receivable/invoices/page'));
const ARCustomersPage = lazy(() => import('../pages/accounts-receivable/customers/page'));
const ARPaymentsPage = lazy(() => import('../pages/accounts-receivable/payments/page'));
const ARReportsPage = lazy(() => import('../pages/accounts-receivable/reports/page'));
const ARReceiptsPage = lazy(() => import('../pages/accounts-receivable/receipts/page'));
const ARAdvancesPage = lazy(() => import('../pages/accounts-receivable/advances/page'));
const ARCreditNotesPage = lazy(() => import('../pages/accounts-receivable/credit-notes/page'));
const ARDebitNotesPage = lazy(() => import('../pages/accounts-receivable/debit-notes/page'));

// Fixed Assets Pages (módulo deshabilitado en esta versión)

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/dashboard',
    element: <DashboardPage />
  },
  {
    path: '/pos',
    element: <POSPage />
  },
  {
    path: '/products',
    element: <ProductsPage />
  },
  {
    path: '/inventory',
    element: <InventoryPage />
  },
  {
    path: '/accounts-receivable',
    element: <AccountsReceivablePage />
  },
  // Accounts Receivable Sub-routes
  {
    path: '/accounts-receivable/invoices',
    element: <ARInvoicesPage />
  },
  {
    path: '/accounts-receivable/customers',
    element: <ARCustomersPage />
  },
  {
    path: '/accounts-receivable/payments',
    element: <ARPaymentsPage />
  },
  {
    path: '/accounts-receivable/reports',
    element: <ARReportsPage />
  },
  {
    path: '/accounts-receivable/receipts',
    element: <ARReceiptsPage />
  },
  {
    path: '/accounts-receivable/advances',
    element: <ARAdvancesPage />
  },
  {
    path: '/accounts-receivable/credit-notes',
    element: <ARCreditNotesPage />
  },
  {
    path: '/accounts-receivable/debit-notes',
    element: <ARDebitNotesPage />
  },
  {
    path: '/accounts-payable',
    element: <AccountsPayablePage />
  },
  // Accounts Payable Sub-routes
  {
    path: '/accounts-payable/reports',
    element: <APReportsPage />
  },
  {
    path: '/accounts-payable/suppliers',
    element: <SuppliersPage />
  },
  {
    path: '/accounts-payable/payments',
    element: <PaymentsPage />
  },
  {
    path: '/accounts-payable/purchase-orders',
    element: <PurchaseOrdersPage />
  },
  {
    path: '/accounts-payable/quotes',
    element: <APQuotesPage />
  },
  {
    path: '/accounts-payable/advances',
    element: <AdvancesPage />
  },
  {
    path: '/billing',
    element: <BillingPage />
  },
  // Billing Sub-routes
  {
    path: '/billing/sales-reports',
    element: <SalesReportsPage />
  },
  {
    path: '/billing/invoicing',
    element: <InvoicingPage />
  },
  {
    path: '/billing/pre-invoicing',
    element: <PreInvoicingPage />
  },
  {
    path: '/billing/recurring',
    element: <RecurringBillingPage />
  },
  {
    path: '/billing/cash-closing',
    element: <CashClosingPage />
  },
  {
    path: '/billing/quotes',
    element: <QuotesPage />
  },
  {
    path: '/plans',
    element: <PlansPage />
  },
  // Settings Routes
  {
    path: '/settings',
    element: <SettingsPage />
  },
  {
    path: '/settings/company',
    element: <CompanySettingsPage />
  },
  {
    path: '/settings/users',
    element: <UsersSettingsPage />
  },
  {
    path: '/settings/accounting',
    element: <AccountingSettingsPage />
  },
  {
    path: '/settings/inventory',
    element: <InventorySettingsPage />
  },
  {
    path: '/settings/backup',
    element: <BackupSettingsPage />
  },
  {
    path: '/settings/integrations',
    element: <IntegrationsSettingsPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/auth/reset-password',
    element: <ResetPasswordPage />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];

export default routes;
