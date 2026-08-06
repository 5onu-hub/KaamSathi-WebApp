import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { GuestLayout } from "../layouts/GuestLayout";
import { CustomerLayout } from "../layouts/CustomerLayout";
import { WorkerLayout } from "../layouts/WorkerLayout";
import { AdminLayout } from "../layouts/AdminLayout";

// Loading Fallback Component
const LoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-gray-50/50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading KaamSathi Page...</p>
    </div>
  </div>
);

// Lazy Loaded Pages
const Home = lazy(() => import("../pages/Home").then(m => ({ default: m.Home })));
const ServicesCatalogView = lazy(() => import("../pages/services/ServicesCatalogView").then(m => ({ default: m.ServicesCatalogView })));
const CategoryServiceResolver = lazy(() => import("../pages/services/CategoryServiceResolver").then(m => ({ default: m.CategoryServiceResolver })));
const DynamicServiceDetailsPage = lazy(() => import("../pages/services/DynamicServiceDetailsPage").then(m => ({ default: m.DynamicServiceDetailsPage })));
const Workers = lazy(() => import("../pages/Workers").then(m => ({ default: m.Workers })));
const WorkerDetails = lazy(() => import("../pages/WorkerDetails").then(m => ({ default: m.WorkerDetails })));
const WorkerPublicProfile = lazy(() => import("../pages/WorkerPublicProfile").then(m => ({ default: m.WorkerPublicProfile })));
const CustomerDashboard = lazy(() => import("../pages/CustomerDashboard").then(m => ({ default: m.CustomerDashboard })));
const CustomerBookings = lazy(() => import("../pages/bookings/CustomerBookings").then(m => ({ default: m.CustomerBookings })));
const CustomerProfileView = lazy(() => import("../pages/customer/CustomerProfileView").then(m => ({ default: m.CustomerProfileView })));
const CustomerMessagesView = lazy(() => import("../pages/customer/CustomerMessagesView").then(m => ({ default: m.CustomerMessagesView })));
const CustomerSavedView = lazy(() => import("../pages/customer/CustomerSavedView").then(m => ({ default: m.CustomerSavedView })));
const CustomerWalletView = lazy(() => import("../pages/customer/CustomerWalletView").then(m => ({ default: m.CustomerWalletView })));
const CustomerPaymentsView = lazy(() => import("../pages/customer/CustomerPaymentsView").then(m => ({ default: m.CustomerPaymentsView })));

const WorkerDashboard = lazy(() => import("../pages/WorkerDashboard").then(m => ({ default: m.WorkerDashboard })));
const WorkerJobs = lazy(() => import("../pages/bookings/WorkerJobs").then(m => ({ default: m.WorkerJobs })));
const WorkerProfileView = lazy(() => import("../pages/worker/WorkerProfileView").then(m => ({ default: m.WorkerProfileView })));
const WorkerEarningsView = lazy(() => import("../pages/worker/WorkerEarningsView").then(m => ({ default: m.WorkerEarningsView })));
const WorkerWalletView = lazy(() => import("../pages/worker/WorkerWalletView").then(m => ({ default: m.WorkerWalletView })));
const WorkerMessagesView = lazy(() => import("../pages/worker/WorkerMessagesView").then(m => ({ default: m.WorkerMessagesView })));

const BookingDetails = lazy(() => import("../pages/bookings/BookingDetails").then(m => ({ default: m.BookingDetails })));
const NotificationCenterView = lazy(() => import("../pages/notifications/NotificationCenterView").then(m => ({ default: m.NotificationCenterView })));
const ChatRoomView = lazy(() => import("../pages/messages/ChatRoomView").then(m => ({ default: m.ChatRoomView })));

const SignInPage = lazy(() => import("../pages/auth/SignInPage").then(m => ({ default: m.SignInPage })));
const SignUpPage = lazy(() => import("../pages/auth/SignUpPage").then(m => ({ default: m.SignUpPage })));
const RoleSelectionPage = lazy(() => import("../pages/auth/RoleSelectionPage").then(m => ({ default: m.RoleSelectionPage })));
const ProfileCompletionPage = lazy(() => import("../pages/auth/ProfileCompletionPage").then(m => ({ default: m.ProfileCompletionPage })));

const AdminDashboard = lazy(() => import("../pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminDashboardView = lazy(() => import("../pages/admin/AdminDashboardView").then(m => ({ default: m.AdminDashboardView })));
const AdminUsersView = lazy(() => import("../pages/admin/AdminUsersView").then(m => ({ default: m.AdminUsersView })));
const AdminWorkersView = lazy(() => import("../pages/admin/AdminWorkersView").then(m => ({ default: m.AdminWorkersView })));
const AdminVerificationsView = lazy(() => import("../pages/admin/AdminVerificationsView").then(m => ({ default: m.AdminVerificationsView })));
const AdminBookingsView = lazy(() => import("../pages/admin/AdminBookingsView").then(m => ({ default: m.AdminBookingsView })));
const AdminCategoriesView = lazy(() => import("../pages/admin/AdminCategoriesView").then(m => ({ default: m.AdminCategoriesView })));
const AdminPaymentsView = lazy(() => import("../pages/admin/AdminPaymentsView").then(m => ({ default: m.AdminPaymentsView })));
const AdminFinanceView = lazy(() => import("../pages/admin/AdminFinanceView").then(m => ({ default: m.AdminFinanceView })));
const AdminComplaintsView = lazy(() => import("../pages/admin/AdminComplaintsView").then(m => ({ default: m.AdminComplaintsView })));
const AdminNotificationsView = lazy(() => import("../pages/admin/AdminNotificationsView").then(m => ({ default: m.AdminNotificationsView })));
const AdminAnalyticsView = lazy(() => import("../pages/admin/AdminAnalyticsView").then(m => ({ default: m.AdminAnalyticsView })));
const AdminReportsView = lazy(() => import("../pages/admin/AdminReportsView").then(m => ({ default: m.AdminReportsView })));
const AdminAiInsightsView = lazy(() => import("../pages/admin/AdminAiInsightsView").then(m => ({ default: m.AdminAiInsightsView })));
const AdminAuditLogsView = lazy(() => import("../pages/admin/AdminAuditLogsView").then(m => ({ default: m.AdminAuditLogsView })));
const AdminSettingsView = lazy(() => import("../pages/admin/AdminSettingsView").then(m => ({ default: m.AdminSettingsView })));

const ComingSoon = lazy(() => import("../pages/ComingSoon").then(m => ({ default: m.ComingSoon })));
const Unauthorized = lazy(() => import("../pages/Unauthorized").then(m => ({ default: m.Unauthorized })));
const NotFound = lazy(() => import("../pages/NotFound").then(m => ({ default: m.NotFound })));
const AIPage = lazy(() => import("../pages/AIPage").then(m => ({ default: m.AIPage })));
const SearchHome = lazy(() => import("../pages/searchMap/SearchHome").then(m => ({ default: m.SearchHome })));
const SearchResults = lazy(() => import("../pages/searchMap/SearchResults").then(m => ({ default: m.SearchResults })));
const MapExplorer = lazy(() => import("../pages/searchMap/MapExplorer").then(m => ({ default: m.MapExplorer })));

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Standalone Auth & Chat Routes */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/profile-completion" element={<ProfileCompletionPage />} />
        <Route path="/messages/:conversationId" element={<ChatRoomView />} />

        {/* 1. Admin Application Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardView />} />
          <Route path="dashboard" element={<AdminDashboardView />} />
          <Route path="users" element={<AdminUsersView />} />
          <Route path="workers" element={<AdminWorkersView />} />
          <Route path="verifications" element={<AdminVerificationsView />} />
          <Route path="bookings" element={<AdminBookingsView />} />
          <Route path="categories" element={<AdminCategoriesView />} />
          <Route path="payments" element={<AdminPaymentsView />} />
          <Route path="finance" element={<AdminFinanceView />} />
          <Route path="complaints" element={<AdminComplaintsView />} />
          <Route path="notifications" element={<AdminNotificationsView />} />
          <Route path="analytics" element={<AdminAnalyticsView />} />
          <Route path="reports" element={<AdminReportsView />} />
          <Route path="ai-insights" element={<AdminAiInsightsView />} />
          <Route path="audit-logs" element={<AdminAuditLogsView />} />
          <Route path="settings" element={<AdminSettingsView />} />
        </Route>

        {/* 2. Customer Application Layout */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="bookings" element={<CustomerBookings />} />
          <Route path="profile" element={<CustomerProfileView />} />
          <Route path="messages" element={<CustomerMessagesView />} />
          <Route path="saved" element={<CustomerSavedView />} />
          <Route path="wallet" element={<CustomerWalletView />} />
          <Route path="payments" element={<CustomerPaymentsView />} />
          <Route path="notifications" element={<NotificationCenterView />} />
        </Route>
        <Route path="/customer-dashboard" element={<CustomerLayout />}>
          <Route index element={<CustomerDashboard />} />
        </Route>

        {/* 3. Worker Application Layout */}
        <Route path="/worker" element={<WorkerLayout />}>
          <Route path="dashboard" element={<WorkerDashboard />} />
          <Route path="jobs" element={<WorkerJobs />} />
          <Route path="profile" element={<WorkerProfileView />} />
          <Route path="earnings" element={<WorkerEarningsView />} />
          <Route path="wallet" element={<WorkerWalletView />} />
          <Route path="messages" element={<WorkerMessagesView />} />
          <Route path="notifications" element={<NotificationCenterView />} />
        </Route>
        <Route path="/worker-dashboard" element={<WorkerLayout />}>
          <Route index element={<WorkerDashboard />} />
        </Route>

        {/* 4. Guest / Public Marketing Layout */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/search" element={<SearchHome />} />
          <Route path="/search/results" element={<SearchResults />} />
          <Route path="/map" element={<MapExplorer />} />
          <Route path="/map/worker/:workerId" element={<MapExplorer />} />

          {/* Services Routes */}
          <Route path="/services" element={<ServicesCatalogView />} />
          <Route path="/services/:categoryId" element={<CategoryServiceResolver />} />
          <Route path="/services/:groupSlug/:serviceSlug" element={<DynamicServiceDetailsPage />} />

          {/* Workers Catalog & Details */}
          <Route path="/workers" element={<Workers />} />
          <Route path="/workers/:id" element={<WorkerPublicProfile />} />
          <Route path="/workers/:workerId" element={<WorkerPublicProfile />} />

          {/* Booking Details */}
          <Route path="/booking/:id" element={<BookingDetails />} />
          <Route path="/bookings/:bookingId" element={<BookingDetails />} />

          {/* Standalone Admin Route */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* Utility Routes */}
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
