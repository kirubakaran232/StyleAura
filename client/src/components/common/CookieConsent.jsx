import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'styleaura_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(STORAGE_KEY) !== 'accepted');
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed left-4 right-4 bottom-4 z-50">
      <div className="container-custom px-0">
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 shadow-2xl rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
            StyleAura uses cookies to improve your browsing experience, remember preferences, and understand site performance.
            Read our <Link className="text-primary-600 hover:underline" to="/privacy-policy">Privacy Policy</Link>.
          </p>
          <button onClick={accept} className="btn-primary px-6 py-2.5">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
