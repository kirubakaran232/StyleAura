import { SiPinterest } from 'react-icons/si';

export default function PinItButton({ imageUrl, description, url }) {
  const pageUrl = url || window.location.href;
  const pinUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(description || '')}`;

  return (
    <a
      href={pinUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-pinterest gap-2 text-sm"
      onClick={e => e.stopPropagation()}
      aria-label="Save to Pinterest"
    >
      <SiPinterest size={16} />
      Save
    </a>
  );
}
