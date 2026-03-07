import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import LinksPage from './pages/LinksPage';
import UsesPage from './pages/UsesPage';
import BlogsPage from './pages/BlogsPage';
import LabsPage from './pages/LabsPage';
import GuestbookPage from './pages/GuestbookPage';
import BookCallPage from './pages/BookCallPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import { Analytics } from '@vercel/analytics/react';

function ScrollHandler() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const location = useLocation();

  return (
    <div className="bg-background min-h-screen text-gray-200 font-sans selection:bg-primary/30">
      <ScrollHandler />
      <Navbar />
      <CommandPalette />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/links" element={<LinksPage />} />
          <Route path="/uses" element={<UsesPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/labs" element={<LabsPage />} />
          <Route path="/guestbook" element={<GuestbookPage />} />
          <Route path="/book" element={<BookCallPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-use" element={<TermsOfUsePage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <Analytics />
    </div>
  );
}

export default App;
