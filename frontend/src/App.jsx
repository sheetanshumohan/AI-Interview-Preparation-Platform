import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import ResumeAnalysisPage from './pages/ResumeAnalysisPage';
import AIQuestionGeneratorPage from './pages/AIQuestionGeneratorPage';
import MockInterviewPage from './pages/MockInterviewPage';
import HRPracticePage from './pages/HRPracticePage';
import AnswerEvaluationPage from './pages/AnswerEvaluationPage';
import SavedQuestionsPage from './pages/SavedQuestionsPage';
import InterviewHistoryPage from './pages/InterviewHistoryPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserHub from './pages/AdminUserHub';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminLogs from './pages/AdminLogs';



// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { user, isAuthenticated, isCheckingAuth } = useAuthStore();

	if (isCheckingAuth) return null;
	if (!isAuthenticated) return <Navigate to='/login' replace />;
	if (user?.isAdmin) return <Navigate to='/admin' replace />;

	return children;
};

// Redirect authenticated users to the dashboard
const RedirectAuthenticatedUser = ({ children }) => {
	const { user, isAuthenticated, isCheckingAuth } = useAuthStore();

	if (isCheckingAuth) return null;
	if (isAuthenticated) {
		if (user?.isAdmin) {
			return <Navigate to='/admin' replace />;
		}
		return <Navigate to='/dashboard' replace />;
	}

	return children;
};

// Protect routes that require admin privileges
const AdminRoute = ({ children }) => {
	const { user, isAuthenticated, isCheckingAuth } = useAuthStore();

	if (isCheckingAuth) return null;
	if (!isAuthenticated) return <Navigate to='/' replace />;
	if (!user?.isAdmin) return <Navigate to='/dashboard' replace />;

	return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    // Parse query params to extract OAuth token if redirected from social login
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
        localStorage.setItem('token', token);
        // Clean URL parameter
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
    }

    checkAuth();
    initTheme();
  }, [checkAuth, initTheme]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={
            <RedirectAuthenticatedUser>
                <LoginPage />
            </RedirectAuthenticatedUser>
        } />
        <Route path="/register" element={
            <RedirectAuthenticatedUser>
                <RegisterPage />
            </RedirectAuthenticatedUser>
        } />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          {/* Placeholder for other sidebar items */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="analysis" element={<ResumeAnalysisPage />} />
          <Route path="ai-questions" element={<AIQuestionGeneratorPage />} />
          <Route path="mock-interview" element={<MockInterviewPage />} />
          <Route path="hr-practice" element={<HRPracticePage />} />
          <Route path="evaluation" element={<AnswerEvaluationPage />} />

          <Route path="saved" element={<SavedQuestionsPage />} />
          <Route path="history" element={<InterviewHistoryPage />} />
          <Route path="settings" element={<Dashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
            <AdminRoute>
                <AdminLayout />
            </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserHub />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="logs" element={<AdminLogs />} />

        </Route>
      </Routes>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1rem',
          },
        }}
      />
    </>



  );
}

export default App;


