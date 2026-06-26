import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import LoginModal from './components/common/LoginModal';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './features/home/Home';
import Templates from './features/templates/Templates';
import TemplateDetail from './features/templates/TemplateDetail';
import Pricing from './features/pricing/Pricing';
import Contact from './features/contact/Contact';
import Invitation from './features/invitation/Invitation';
import Admin from './features/admin/Admin';
import CreateInvitation from './features/create/CreateInvitation';
import UserPanel from './features/user/UserPanel';
import { GoogleSuccess, GoogleError } from './features/auth/GoogleAuthCallback';

// Helper to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Layout chính (marketing) — có Header + Footer
function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-container">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <Router>
        <ScrollToTop />
        <LoginModal />
        <Routes>
          {/* Trang độc lập, KHÔNG Header/Footer site */}
          <Route path="/auth/google/success" element={<GoogleSuccess />} />
          <Route path="/auth/google/error" element={<GoogleError />} />
          <Route path="/thiep/demo/:slug" element={<Invitation />} />
          <Route path="/thiep/:slug" element={<Invitation />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/:tab" element={<Admin />} />
          <Route path="/admin/:tab/:id" element={<Admin />} />
          <Route path="/tai-khoan" element={<UserPanel />} />
          <Route path="/tao-thiep/:templateSlug" element={<CreateInvitation />} />
          <Route path="/chinh-sua/:slug" element={<CreateInvitation />} />

          {/* Các trang marketing — dùng layout chung */}
          <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
          <Route path="/mau-thiep" element={<SiteLayout><Templates /></SiteLayout>} />
          <Route path="/mau-thiep/:slug" element={<SiteLayout><TemplateDetail /></SiteLayout>} />
          <Route path="/bang-gia" element={<SiteLayout><Pricing /></SiteLayout>} />
          <Route path="/lien-he" element={<SiteLayout><Contact /></SiteLayout>} />
          <Route path="*" element={<SiteLayout><Home /></SiteLayout>} />
        </Routes>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
