import { useEffect, useState } from 'react';
import { whatsappLink } from '@/lib/site';

// Floating "Chat on WhatsApp" button for public pages. It appears once the
// visitor scrolls past the hero (so it never competes with the main button)
// and renders nothing while NEXT_PUBLIC_WHATSAPP_NUMBER is unset.
// `message` pre-fills the chat, so each page can say where the family came from.

export default function WhatsAppButton({ message, showAfter = 400 }) {
  const href = whatsappLink(message);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!href) return undefined;
    const onScroll = () => setVisible(window.scrollY > showAfter);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [href, showAfter]);

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`fixed z-40 right-4 bottom-4 md:right-6 md:bottom-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white pl-3 pr-4 py-3 md:pl-4 md:pr-5 font-semibold shadow-lg shadow-slate-900/15 transition-all duration-300 hover:brightness-95 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <span className="text-sm md:text-base">WhatsApp us</span>
    </a>
  );
}
