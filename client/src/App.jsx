import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CookieConsent from './components/common/CookieConsent';
import ScrollToTop from './components/common/ScrollToTop';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import SearchResults from './pages/SearchResults';
import Bookmarks from './pages/Bookmarks';
import {
  About,
  Contact,
  PrivacyPolicy,
  Disclaimer,
  AffiliateDisclosure,
  TermsAndConditions,
  Sitemap,
} from './pages/StaticPages';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ManageBlogs from './pages/admin/ManageBlogs';
import ManageProducts from './pages/admin/ManageProducts';
import Analytics from './pages/admin/Analytics';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { useTheme } from './context/ThemeContext';

function App() {
  const { isDark } = useTheme();

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 transition-colors duration-300">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/blogs" element={<ProtectedRoute><ManageBlogs /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><ManageProducts /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

          {/* Public Routes */}
          <Route path="/*" element={
            <>
              <ScrollToTop />
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/product/:slug" element={<ProductPage />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/bookmarks" element={<Bookmarks />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/disclaimer" element={<Disclaimer />} />
                  <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/sitemap" element={<Sitemap />} />
                </Routes>
              </main>
              <Footer />
              <CookieConsent />
            </>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;
