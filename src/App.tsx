import { useEffect, useState } from 'react';
import About from './components/About';
import Benefits from './components/Benefits';
import BookingConfirmationPage from './components/BookingConfirmationPage';
import BookingPage from './components/BookingPage';
import Contacts from './components/Contacts';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import Reviews from './components/Reviews';
import RoomViewPage from './components/RoomViewPage';
import Rooms from './components/Rooms';
import SearchResultsPage from './components/SearchResultsPage';

import AdminLayout, { AdminForbidden } from './admin/AdminLayout';
import LoginPage from './admin/LoginPage';
import ChessboardPage from './admin/ChessboardPage';
import BookingsListPage from './admin/BookingsListPage';
import BookingDetailPage from './admin/BookingDetailPage';
import RoomsPage from './admin/RoomsPage';
import GuestsPage from './admin/GuestsPage';
import RatesPage from './admin/RatesPage';
import UsersPage from './admin/UsersPage';

const resultsPaths = new Set(['/rooms', '/search']);
const bookingPaths = new Set(['/booking', '/booking/confirmation']);
const roomViewPaths = new Set(['/room-view', '/rooms/view']);

function readLocation() {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
  };
}

function AdminRouter({ pathname, search }: { pathname: string; search: string }) {
  if (pathname === '/admin/login' || pathname === '/admin') {
    if (pathname === '/admin') {
      window.history.replaceState({}, '', '/admin/chessboard');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return null;
    }
    return <LoginPage />;
  }
  // /admin/users защищён role-проверкой внутри
  return (
    <AdminLayout pathname={pathname}>
      {pathname === '/admin/chessboard' && <ChessboardPage />}
      {pathname.startsWith('/admin/bookings') && pathname === '/admin/bookings' && (
        <BookingsListPage />
      )}
      {pathname.startsWith('/admin/bookings/') && <BookingDetailPage pathname={pathname} />}
      {pathname === '/admin/rooms' && <RoomsPage />}
      {pathname === '/admin/guests' && <GuestsPage />}
      {pathname === '/admin/rates' && <RatesPage />}
      {pathname === '/admin/users' && <UsersPage />}
      {![
        '/admin/chessboard',
        '/admin/bookings',
        '/admin/rooms',
        '/admin/guests',
        '/admin/rates',
        '/admin/users',
      ].some((p) => pathname === p || (p !== '/admin' && pathname.startsWith(p + '/'))) &&
        !pathname.startsWith('/admin/bookings/') && <AdminForbidden />}
    </AdminLayout>
  );
}

function App() {
  const [location, setLocation] = useState(readLocation);
  const isAdmin = location.pathname.startsWith('/admin');
  const isResultsPage = resultsPaths.has(location.pathname);
  const isRoomViewPage = roomViewPaths.has(location.pathname);
  const isBookingPage = location.pathname === '/booking';
  const isBookingConfirmationPage = location.pathname === '/booking/confirmation';
  const isFlowPage = isResultsPage || bookingPaths.has(location.pathname);

  useEffect(() => {
    const handleLocationChange = () => setLocation(readLocation());
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (isAdmin) {
    return <AdminRouter pathname={location.pathname} search={location.search} />;
  }

  return (
    <div className="min-h-screen overflow-hidden text-reshka-black">
      {!isFlowPage && <Header />}
      {isResultsPage ? (
        <SearchResultsPage key={location.search} search={location.search} />
      ) : isRoomViewPage ? (
        <RoomViewPage search={location.search} />
      ) : isBookingPage ? (
        <BookingPage key={location.search} search={location.search} />
      ) : isBookingConfirmationPage ? (
        <BookingConfirmationPage key={location.search} search={location.search} />
      ) : (
        <main>
          <Hero />
          <Rooms />
          <Benefits />
          <About />
          <Reviews />
          <Contacts />
        </main>
      )}
      {!isBookingPage && !isBookingConfirmationPage && <Footer />}
    </div>
  );
}

export default App;
