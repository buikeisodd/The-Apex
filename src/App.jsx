import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar    from './components/Navbar';
import AuthModal from './components/AuthModal';
import Toast     from './components/Toast';

// Client
import HomePage     from './pages/HomePage';
import BeatsPage    from './pages/BeatsPage';
import SessionsPage from './pages/SessionsPage';
import ContactPage  from './pages/ContactPage';
import CartPage     from './pages/CartPage';
import ProfilePage  from './pages/ProfilePage';
import ExplorePage  from './pages/ExplorePage';

// Producer
import UploadPage        from './pages/UploadPage';
import MyBeatsPage       from './pages/MyBeatsPage';
import ProducerDashboard from './pages/producer/ProducerDashboard';
import NotificationsPage from './pages/producer/NotificationsPage';

// Admin
import AdminOverview     from './pages/admin/AdminOverview';
import AdminBookings     from './pages/admin/AdminBookings';
import AdminBeats        from './pages/admin/AdminBeats';
import AdminProducers    from './pages/admin/AdminProducers';
import AdminUsers        from './pages/admin/AdminUsers';
import AdminTransactions from './pages/admin/AdminTransactions';

function AppInner() {
  const { user } = useApp();
  const [page,     setPage]     = useState('home');
  const [authOpen, setAuthOpen] = useState(false);

  const setActivePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    // Shared across roles
    if (page === 'profile') return <ProfilePage setActivePage={setActivePage} />;

    // ── Admin ──────────────────────────────────────────────────────────
    if (user?.role === 'admin') {
      switch (page) {
        case 'admin-bookings':    return <AdminBookings />;
        case 'admin-beats':       return <AdminBeats />;
        case 'admin-producers':   return <AdminProducers />;
        case 'admin-users':       return <AdminUsers />;
        case 'admin-transactions':return <AdminTransactions />;
        default:                  return <AdminOverview setActivePage={setActivePage} />;
      }
    }

    // ── Producer ────────────────────────────────────────────────────────
    if (user?.role === 'producer') {
      switch (page) {
        case 'upload':        return <UploadPage />;
        case 'mybeats':       return <MyBeatsPage />;
        case 'explore':       return <ExplorePage />;
        case 'notifications': return <NotificationsPage />;
        default:              return <ProducerDashboard setActivePage={setActivePage} />;
      }
    }

    // ── Client ──────────────────────────────────────────────────────────
    switch (page) {
      case 'beats':    return <BeatsPage />;
      case 'sessions': return <SessionsPage />;
      case 'explore':  return <ExplorePage />;
      case 'contact':  return <ContactPage />;
      case 'cart':     return <CartPage />;
      default:         return <HomePage setActivePage={setActivePage} />;
    }
  };

  const effectivePage =
    user?.role === 'admin'    && !page.startsWith('admin') && page !== 'profile' ? 'admin-overview' :
    user?.role === 'producer' && page === 'home'                                  ? 'dashboard'      : page;

  // Add profile link to navbar via user avatar click
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar
        activePage={effectivePage}
        setActivePage={setActivePage}
        onAuthOpen={() => setAuthOpen(true)}
        onProfileOpen={() => setActivePage('profile')}
      />
      <main>{renderPage()}</main>
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      <Toast />
    </div>
  );
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>;
}
