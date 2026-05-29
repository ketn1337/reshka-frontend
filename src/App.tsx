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
import Rooms from './components/Rooms';
import SearchResultsPage from './components/SearchResultsPage';

const resultsPaths = new Set(['/rooms', '/search']);
const bookingPaths = new Set(['/booking', '/booking/confirmation']);

function readLocation() {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
  };
}

function App() {
  const [location, setLocation] = useState(readLocation);
  const isResultsPage = resultsPaths.has(location.pathname);
  const isBookingPage = location.pathname === '/booking';
  const isBookingConfirmationPage = location.pathname === '/booking/confirmation';
  const isFlowPage = isResultsPage || bookingPaths.has(location.pathname);

  useEffect(() => {
    const handleLocationChange = () => setLocation(readLocation());
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden text-reshka-black">
      {!isFlowPage && <Header />}
      {isResultsPage ? (
        <SearchResultsPage key={location.search} search={location.search} />
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
