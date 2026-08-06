import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { GuestLayout } from "../layouts/GuestLayout";
import { CustomerLayout } from "../layouts/CustomerLayout";
import { WorkerLayout } from "../layouts/WorkerLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { PremiumLoader, PageSkeleton } from "../components/common/PremiumLoader";

// Intelligent loader component based on current path
const DynamicLoadingFallback = () => {
  const location = useLocation();
  const path = location.pathname;
  let dest: "home" | "workers" | "booking" | "profile" | "dashboard" = "home";
  if (path.includes("worker")) dest = "workers";
  else if (path.includes("booking")) dest = "booking";
  else if (path.includes("dashboard")) dest = "dashboard";
  else if (path.includes("profile")) dest = "profile";

  return <PremiumLoader destination={dest} />;
};

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
const CustomerAiRecommendationsView = lazy(() => import("../pages/customer/CustomerAiRecommendationsView").then(m => ({ default: m.CustomerAiRecommendationsView })));
const GamificationView = lazy(() => import("../pages/gamification/GamificationView").then(m => ({ default: m.GamificationView })));
const EmergencyHiringView = lazy(() => import("../pages/customer/EmergencyHiringView").then(m => ({ default: m.EmergencyHiringView })));
const LiveTrackingView = lazy(() => import("../pages/customer/LiveTrackingView").then(m => ({ default: m.LiveTrackingView })));

const WorkerDashboard = lazy(() => import("../pages/WorkerDashboard").then(m => ({ default: m.WorkerDashboard })));
const WorkerJobs = lazy(() => import("../pages/bookings/WorkerJobs").then(m => ({ default: m.WorkerJobs })));
const WorkerProfileView = lazy(() => import("../pages/worker/WorkerProfileView").then(m => ({ default: m.WorkerProfileView })));
const WorkerEarningsView = lazy(() => import("../pages/worker/WorkerEarningsView").then(m => ({ default: m.WorkerEarningsView })));
const WorkerWalletView = lazy(() => import("../pages/worker/WorkerWalletView").then(m => ({ default: m.WorkerWalletView })));
const WorkerMessagesView = lazy(() => import("../pages/worker/WorkerMessagesView").then(m => ({ default: m.WorkerMessagesView })));

const BookingDetails = lazy(() => import("../pages/bookings/BookingDetails").then(m => ({ default: m.BookingDetails })));
const BookingWizardPage = lazy(() => import("../pages/bookings/BookingWizardPage").then(m => ({ default: m.BookingWizardPage })));
const BookingSuccessPage = lazy(() => import("../pages/bookings/BookingSuccessPage").then(m => ({ default: m.BookingSuccessPage })));
const NotificationCenterView = lazy(() => import("../pages/notifications/NotificationCenterView").then(m => ({ default: m.NotificationCenterView })));
const ChatRoomView = lazy(() => import("../pages/messages/ChatRoomView").then(m => ({ default: m.ChatRoomView })));

const SignInPage = lazy(() => import("../pages/auth/SignInPage").then(m => ({ default: m.SignInPage })));
const SignUpPage = lazy(() => import("../pages/auth/SignUpPage").then(m => ({ default: m.SignUpPage })));
const AdminLoginPage = lazy(() => import("../pages/auth/AdminLoginPage").then(m => ({ default: m.AdminLoginPage })));
const RoleSelectionPage = lazy(() => import("../pages/auth/RoleSelectionPage").then(m => ({ default: m.RoleSelectionPage })));
const ProfileCompletionPage = lazy(() => import("../pages/auth/ProfileCompletionPage").then(m => ({ default: m.ProfileCompletionPage })));
const WorkerOnboardingPage = lazy(() => import("../pages/auth/WorkerOnboardingPage").then(m => ({ default: m.WorkerOnboardingPage })));
import { ProtectedRoute } from "../components/rbac/RBACComponents";

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
const AdminServicesView = lazy(() => import("../pages/admin/AdminServicesView").then(m => ({ default: m.AdminServicesView })));
const AdminReviewsView = lazy(() => import("../pages/admin/AdminReviewsView").then(m => ({ default: m.AdminReviewsView })));
const AdminSupportView = lazy(() => import("../pages/admin/AdminSupportView").then(m => ({ default: m.AdminSupportView })));
const CustomerSupportView = lazy(() => import("../pages/customer/CustomerSupportView").then(m => ({ default: m.CustomerSupportView })));
const WorkerSupportView = lazy(() => import("../pages/worker/WorkerSupportView").then(m => ({ default: m.WorkerSupportView })));
const ProfileMainView = lazy(() => import("../pages/profile/ProfileMainView").then(m => ({ default: m.ProfileMainView })));

const ComingSoon = lazy(() => import("../pages/ComingSoon").then(m => ({ default: m.ComingSoon })));
const Unauthorized = lazy(() => import("../pages/Unauthorized").then(m => ({ default: m.Unauthorized })));
const NotFound = lazy(() => import("../pages/NotFound").then(m => ({ default: m.NotFound })));
const AIPage = lazy(() => import("../pages/AIPage").then(m => ({ default: m.AIPage })));
const SearchHome = lazy(() => import("../pages/searchMap/SearchHome").then(m => ({ default: m.SearchHome })));
const SearchResults = lazy(() => import("../pages/searchMap/SearchResults").then(m => ({ default: m.SearchResults })));
const MapExplorer = lazy(() => import("../pages/searchMap/MapExplorer").then(m => ({ default: m.MapExplorer })));

export function AppRoutes() {
  return (
    <Suspense fallback={<DynamicLoadingFallback />}>
      <Routes>
        {/* Standalone Auth & Chat Routes */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/profile-completion" element={<ProfileCompletionPage />} />
        <Route path="/worker/onboarding" element={<ProtectedRoute allowedRole="worker"><WorkerOnboardingPage /></ProtectedRoute>} />
        <Route path="/messages/:conversationId" element={<ChatRoomView />} />

        {/* Profile & Account Management Routes */}
        <Route path="/profile" element={<ProfileMainView />} />
        <Route path="/profile/edit" element={<ProfileMainView />} />
        <Route path="/settings" element={<ProfileMainView />} />
        <Route path="/security" element={<ProfileMainView />} />
        <Route path="/preferences" element={<ProfileMainView />} />

        {/* 1. Admin Application Layout */}
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboardView />} />
          <Route path="dashboard" element={<AdminDashboardView />} />
          <Route path="services" element={<AdminServicesView />} />
          <Route path="reviews" element={<AdminReviewsView />} />
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
          <Route path="support" element={<AdminSupportView />} />
        </Route>

        {/* 2. Customer Application Layout */}
        <Route path="/customer" element={<ProtectedRoute allowedRole="customer"><CustomerLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="bookings" element={<CustomerBookings />} />
          <Route path="profile" element={<CustomerProfileView />} />
          <Route path="messages" element={<CustomerMessagesView />} />
          <Route path="saved" element={<CustomerSavedView />} />
          <Route path="wallet" element={<CustomerWalletView />} />
          <Route path="payments" element={<CustomerPaymentsView />} />
          <Route path="recommendations" element={<CustomerAiRecommendationsView />} />
          <Route path="notifications" element={<NotificationCenterView />} />
          <Route path="gamification" element={<GamificationView />} />
          <Route path="emergency" element={<EmergencyHiringView />} />
          <Route path="tracking" element={<LiveTrackingView />} />
          <Route path="support" element={<CustomerSupportView />} />
        </Route>
        <Route path="/customer-dashboard" element={<ProtectedRoute allowedRole="customer"><CustomerLayout /></ProtectedRoute>}>
          <Route index element={<CustomerDashboard />} />
        </Route>

        {/* 3. Worker Application Layout */}
        <Route path="/worker" element={<ProtectedRoute allowedRole="worker"><WorkerLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<WorkerDashboard />} />
          <Route path="jobs" element={<WorkerJobs />} />
          <Route path="profile" element={<WorkerProfileView />} />
          <Route path="earnings" element={<WorkerEarningsView />} />
          <Route path="wallet" element={<WorkerWalletView />} />
          <Route path="messages" element={<WorkerMessagesView />} />
          <Route path="notifications" element={<NotificationCenterView />} />
          <Route path="gamification" element={<GamificationView />} />
          <Route path="tracking" element={<LiveTrackingView />} />
          <Route path="support" element={<WorkerSupportView />} />
        </Route>
        <Route path="/worker-dashboard" element={<ProtectedRoute allowedRole="worker"><WorkerLayout /></ProtectedRoute>}>
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
          <Route path="/find-workers" element={<Workers />} />
          <Route path="/workers/:id" element={<WorkerPublicProfile />} />
          <Route path="/workers/:workerId" element={<WorkerPublicProfile />} />

          {/* Booking Flow & Details */}
          <Route path="/booking/:workerId" element={<BookingWizardPage />} />
          <Route path="/checkout" element={<BookingWizardPage />} />
          <Route path="/booking/success" element={<BookingSuccessPage />} />
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
