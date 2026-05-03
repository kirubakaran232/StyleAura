import { Link } from 'react-router-dom';
import { SiInstagram, SiPinterest } from 'react-icons/si';
import { FiMail, FiHeart, FiShoppingBag } from 'react-icons/fi';

const CATEGORIES = ['Fashion', 'Beauty'];
const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Sitemap', to: '/sitemap' },
  { label: 'Admin Login', to: '/admin/login' },
];
const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Disclaimer', to: '/disclaimer' },
  { label: 'Affiliate Disclosure', to: '/affiliate-disclosure' },
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800 mt-20">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-2 mb-4">
              <img src="/sa_logo.png" alt="StyleAura" className="w-10 h-10 rounded-xl object-cover" />
              <span className="font-display font-bold text-2xl gradient-text">StyleAura</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              Clothing and cosmetics inspiration with practical outfit ideas, makeup picks, skincare basics, and value-focused product recommendations.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <SiPinterest size={18}/>, href: 'https://in.pinterest.com/jkstyleaura/', label: 'Pinterest', color: 'hover:text-[#E60023]', external: true },
                { icon: <SiInstagram size={18}/>, href: 'https://www.instagram.com/jkstyleaura/', label: 'Instagram', color: 'hover:text-orange-500', external: true },
                { icon: <FiMail size={18}/>, href: 'mailto:jkstyleaura@gmail.com', label: 'Email', color: 'hover:text-primary-500', external: false },
              ].map(({ icon, href, label, color, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center
                              text-gray-500 dark:text-gray-400 ${color} transition-all duration-200 hover:scale-110`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <Link
                    to={`/category/${cat.toLowerCase()}`}
                    onClick={scrollToTop}
                    className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} onClick={scrollToTop} className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} onClick={scrollToTop} className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 dark:text-gray-600 leading-relaxed mt-6">
              StyleAura participates in affiliate programs including Amazon, Flipkart, Myntra, Nykaa, and Meesho. We may earn a commission on qualifying purchases at no extra cost to you.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-neutral-800 py-6">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400 dark:text-gray-600">
          <p>Copyright {new Date().getFullYear()} StyleAura. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <FiHeart size={14} className="text-primary-500" /> for style lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
