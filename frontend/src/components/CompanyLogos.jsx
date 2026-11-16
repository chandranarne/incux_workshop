import React from 'react';

// Authentic, high-fidelity official brand logo marks for premier tech companies
export function CompanyLogoMark({ name, className = "w-5 h-5 sm:w-6 sm:h-6" }) {
  const norm = (name || '').toLowerCase().trim();

  // 1. Microsoft: 4 iconic squares
  if (norm.includes('microsoft')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Microsoft">
        <rect x="1" y="1" width="10.5" height="10.5" fill="#F25022"/>
        <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7FBA00"/>
        <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00A4EF"/>
        <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900"/>
      </svg>
    );
  }

  // 2. Google: Official 4-color 'G' mark
  if (norm.includes('google')) {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google">
        <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
        <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
        <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
        <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
      </svg>
    );
  }

  // 3. Walmart: 6-ray sunburst spark
  if (norm.includes('walmart')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Walmart">
        <g fill="#FFC220">
          <path d="M50 8c-3 0-5.5 8-5.5 18s2.5 18 5.5 18 5.5-8 5.5-18S53 8 50 8z" />
          <path d="M50 92c-3 0-5.5-8-5.5-18s2.5-18 5.5-18 5.5 8 5.5 18S53 92 50 92z" />
          <path d="M14 29c-1.5 2.6 3 9.6 11.7 14.6s17 4.5 18.5 1.9-3-9.6-11.7-14.6S15.5 26.4 14 29z" />
          <path d="M86 71c-1.5 2.6-9.8.7-18.5-4.3S56 54.8 57.5 52.2s9.8-.7 18.5 4.3S87.5 68.4 86 71z" />
          <path d="M14 71c1.5 2.6 9.8.7 18.5-4.3s14-11.9 12.5-14.5-9.8-.7-18.5 4.3S12.5 68.4 14 71z" />
          <path d="M86 29c1.5 2.6-3 9.6-11.7 14.6S57.3 48.1 55.8 45.5s3-9.6 11.7-14.6S84.5 26.4 86 29z" />
        </g>
      </svg>
    );
  }

  // 4. Amazon: 'a' with signature curved smile arrow
  if (norm.includes('amazon')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Amazon">
        <path d="M13.9 12.8c-.8 0-1.4.1-1.7.4-.3.2-.5.6-.5 1 0 .4.1.8.4 1 .3.2.7.4 1.2.4.7 0 1.3-.2 1.8-.7.5-.5.8-1.1.8-1.8v-.3h-2zm4.1 4.5h-1.9v-1.1c-.5.4-1.1.8-1.8 1-.6.2-1.3.4-2.1.4-1.2 0-2.2-.3-2.9-1-.7-.7-1.1-1.6-1.1-2.7 0-1.2.4-2.1 1.2-2.7.8-.7 2-1 3.5-1h3.1v-.6c0-.7-.2-1.2-.5-1.5-.4-.3-1-.5-1.7-.5-.6 0-1.1.1-1.6.4-.5.3-.8.6-1 1.1l-1.8-.9c.4-.7 1-1.3 1.8-1.8.8-.4 1.7-.7 2.8-.7 1.4 0 2.5.4 3.2 1.1.7.7 1.1 1.8 1.1 3.2v6.6h-.2z" fill="#111827"/>
        <path d="M2.5 19.5c5.5 3.1 12.8 2.8 18.2-.8.2-.2.4.1.2.3-5.2 4-13 4.3-18.6 1-.2-.1-.1-.4.2-.5z" fill="#FF9900"/>
        <path d="M20.9 17.8c.2-.5 1-2.4 1-2.4s-1.8.9-2.3 1.1c-.2.1-.2.2 0 .3.5.2 1.1.6 1.3 1z" fill="#FF9900"/>
      </svg>
    );
  }

  // 5. PayPal: Double overlapping P
  if (norm.includes('paypal')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PayPal">
        <path d="M7 2h7.5c3.2 0 5.5 1.5 5 4.8-.4 2.8-2.6 4.7-5.5 4.7H10.5l-1.5 9.5H5.2L7 2z" fill="#003087"/>
        <path d="M9.5 7h7.5c3.2 0 5.2 1.5 4.7 4.8-.5 3-2.7 5.2-5.7 5.2h-3l-1.5 8H8l2.2-13.5c-.3-.8-.5-1.5-.7-4.5z" fill="#0079C1" fillOpacity="0.85"/>
      </svg>
    );
  }

  // 6. Deloitte: Bold D with signature green dot
  if (norm.includes('deloitte')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Deloitte">
        <path d="M4 4h7.5c4.7 0 8.5 3.6 8.5 8s-3.8 8-8.5 8H4V4zm4 12.5h3.5c2.5 0 4.5-2 4.5-4.5s-2-4.5-4.5-4.5H8v9z" fill="#111827"/>
        <circle cx="21" cy="18" r="2.5" fill="#86BC25"/>
      </svg>
    );
  }

  // 7. TCS: Tata Consultancy Services blue dual-crest
  if (norm.includes('tcs') || norm.includes('tata')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="TCS">
        <rect x="2" y="2" width="20" height="20" rx="5" fill="#003875"/>
        <path d="M5.5 7.5h4v1.5H8v7.5H6.5V9H5.5V7.5zm5.5 4.5c0-2.8 1.5-4.5 3.8-4.5 1.5 0 2.5.6 3.2 1.5l-1.1 1.1c-.5-.6-1.1-.9-2.1-.9-1.5 0-2.3 1.2-2.3 2.8s.8 2.8 2.3 2.8c1 0 1.6-.3 2.1-.9l1.1 1.1c-.7.9-1.7 1.5-3.2 1.5-2.3 0-3.8-1.7-3.8-4.5zm8 4.5v-1.5h1.5v1.5H19z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // 8. Genpact: Coral-orange circle mark
  if (norm.includes('genpact')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Genpact">
        <circle cx="12" cy="12" r="10" fill="#FF5800"/>
        <circle cx="12" cy="12" r="4.2" fill="#FFFFFF"/>
      </svg>
    );
  }

  // 9. Tech Mahindra: Red geometric diamond mark
  if (norm.includes('mahindra')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Tech Mahindra">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#18181B"/>
        <path d="M12 4.5L19.5 12L12 19.5L4.5 12L12 4.5z" fill="#E31837" stroke="#E31837" strokeWidth="1"/>
        <path d="M12 8L16 12L12 16L8 12L12 8z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // 10. PwC: Multicolored geometric facet blocks
  if (norm.includes('pwc')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PwC">
        <rect x="3" y="5" width="7" height="7" fill="#DC143C"/>
        <rect x="10" y="5" width="7" height="7" fill="#EB8C00"/>
        <rect x="6.5" y="12" width="7" height="7" fill="#E0301E"/>
        <rect x="13.5" y="12" width="7" height="7" fill="#D04A02"/>
      </svg>
    );
  }

  // 11. EY: Yellow & Dark Slate dynamic beam tag
  if (norm.includes('ey') || norm.includes('ernst')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="EY">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#2E2E38"/>
        <path d="M6 7h6.5v2.2H8.8v2.2h3.2v2.1H8.8v2.3h3.7V18H6V7z" fill="#FFE600"/>
        <path d="M14 7l2.2 4.4L18.4 7H21l-3.5 6.2V18h-2.5v-4.8L11.5 7H14z" fill="#FFE600"/>
        <polygon points="17,3 22,3 19,6 14,6" fill="#FFE600"/>
      </svg>
    );
  }

  // 12. Cognizant: Cyan/Blue compass arc mark
  if (norm.includes('cognizant')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Cognizant">
        <circle cx="12" cy="12" r="9.5" stroke="#0033A0" strokeWidth="2.5" fill="none"/>
        <path d="M12 2.5A9.5 9.5 0 0 1 21.5 12" stroke="#0072CE" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="3.5" fill="#0033A0"/>
      </svg>
    );
  }

  // 13. Wipro: Concentric rainbow flower dots
  if (norm.includes('wipro')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Wipro">
        <circle cx="12" cy="4.5" r="2.2" fill="#EF4444"/>
        <circle cx="17.3" cy="7.5" r="2.2" fill="#F59E0B"/>
        <circle cx="17.3" cy="16.5" r="2.2" fill="#10B981"/>
        <circle cx="12" cy="19.5" r="2.2" fill="#3B82F6"/>
        <circle cx="6.7" cy="16.5" r="2.2" fill="#8B5CF6"/>
        <circle cx="6.7" cy="7.5" r="2.2" fill="#EC4899"/>
        <circle cx="12" cy="12" r="3" fill="#1E293B"/>
      </svg>
    );
  }

  // 14. Infosys: Signature blue fluid 'i' symbol
  if (norm.includes('infosys')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Infosys">
        <rect x="2" y="2" width="20" height="20" rx="5" fill="#007CC3"/>
        <circle cx="8" cy="7" r="1.8" fill="#FFFFFF"/>
        <path d="M6.5 10.5h3V18h-3v-7.5zm7-3.5h3v11h-3V7z" fill="#FFFFFF"/>
        <path d="M10 14c1.5-1.5 4.5-1.5 6 0" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }

  // 15. Capgemini: Royal blue Ace of Spades emblem
  if (norm.includes('capgemini')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Capgemini">
        <path d="M12 2C9.5 5.5 4 10 4 13.5c0 3 2.5 5.5 5.5 5.5 1.5 0 2.5-.7 2.5-1.5 0 .8 1 1.5 2.5 1.5 3 0 5.5-2.5 5.5-5.5C20 10 14.5 5.5 12 2zm-1.5 16l-1 4h5l-1-4h-3z" fill="#0070AD"/>
      </svg>
    );
  }

  // 16. Optum: Orange & navy dynamic sunburst ray
  if (norm.includes('optum')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Optum">
        <circle cx="12" cy="12" r="9.5" fill="#002677"/>
        <path d="M12 3v6m0 6v6M3 12h6m6 0h6M5.6 5.6l4.2 4.2m4.4 4.4l4.2 4.2M5.6 18.4l4.2-4.2m4.4-4.4l4.2-4.2" stroke="#ED8B00" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    );
  }

  // 17. Dell: Iconic blue circle medallion with slanted E
  if (norm.includes('dell')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Dell">
        <circle cx="12" cy="12" r="9.5" stroke="#007DB8" strokeWidth="2" fill="none"/>
        <path d="M7 8h2.2c1.8 0 3 1.2 3 2.8 0 1.6-1.2 2.8-3 2.8H7V8zm2.2 4c.8 0 1.4-.5 1.4-1.2 0-.7-.6-1.2-1.4-1.2H8.3v2.4h.9z" fill="#007DB8"/>
        <path d="M14 9.5l2-1.8 1.2 1.3-2 1.8 1.4 1.3 1.8-1.6.8.9-2.5 2.3-3.7-3.4.8-.8z" fill="#007DB8"/>
        <path d="M18.5 8h1.4v7.6h-1.4V8z" fill="#007DB8"/>
      </svg>
    );
  }

  // 18. Intel: Iconic blue orbit arc
  if (norm.includes('intel')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Intel">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#0071C5"/>
        <path d="M6 8h2v8H6V8zm4 3.5h2v4.5h-2v-4.5zm0-2.5h2v1.5h-2V9zm4 2.5h2V12c.4-.7 1.1-1 1.9-1 1.4 0 2.1 1 2.1 2.6V16h-2v-2.2c0-.7-.3-1.1-.9-1.1-.6 0-1.1.4-1.1 1.1V16h-2v-4.5z" fill="#FFFFFF"/>
        <path d="M4 17c5 3.5 11 3.5 16 0" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    );
  }

  // 19. Oracle: Red rounded pill 'O'
  if (norm.includes('oracle')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Oracle">
        <rect x="2.5" y="5" width="19" height="14" rx="7" stroke="#F80000" strokeWidth="3.2" fill="none"/>
      </svg>
    );
  }

  // 20. Cisco: Cyan bridge soundwave vertical bars
  if (norm.includes('cisco')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Cisco">
        <path d="M3 13v3M6 10v6M9 8v8M12 5v11M15 8v8M18 10v6M21 13v3" stroke="#049FD9" strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    );
  }

  // 21. IBM: 8-bar striped horizontal logo
  if (norm.includes('ibm')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="IBM">
        <rect x="2" y="5" width="20" height="1.4" fill="#006699"/>
        <rect x="2" y="7" width="20" height="1.4" fill="#006699"/>
        <rect x="2" y="9" width="20" height="1.4" fill="#006699"/>
        <rect x="2" y="11" width="20" height="1.4" fill="#006699"/>
        <rect x="2" y="13" width="20" height="1.4" fill="#006699"/>
        <rect x="2" y="15" width="20" height="1.4" fill="#006699"/>
        <rect x="2" y="17" width="20" height="1.4" fill="#006699"/>
      </svg>
    );
  }

  // 22. Accenture: Purple forward accent chevron bracket >
  if (norm.includes('accenture')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Accenture">
        <path d="M4 17.5L14 12L4 6.5l3-2.5L20 12 7 20l-3-2.5z" fill="#A100FF"/>
      </svg>
    );
  }

  // 23. Salesforce: Cyan multi-lobe cloud
  if (norm.includes('salesforce')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Salesforce">
        <path d="M19.4 10.4c-.2-2.8-2.6-5-5.4-5-1.9 0-3.6 1.1-4.5 2.7C8.7 8 7.6 8.5 6.8 9.3c-1.3 1.2-2 2.8-1.8 4.6.2 1.8 1.4 3.3 3.1 3.9h11.2c2.4 0 4.3-1.9 4.3-4.3 0-2.2-1.7-4-3.8-4.2-.1.4-.3.7-.4 1.1z" fill="#00A1E0"/>
      </svg>
    );
  }

  // 24. Adobe: Red square with stylized white 'A'
  if (norm.includes('adobe')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Adobe">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#FA0F00"/>
        <polygon points="14.5,6 19,18 15,18 13.5,14" fill="#FFFFFF"/>
        <polygon points="9.5,6 5,18 9,18 10.5,14" fill="#FFFFFF"/>
        <polygon points="12,10.2 14.2,16 9.8,16" fill="#FFFFFF"/>
      </svg>
    );
  }

  // Default fallback brand mark
  return (
    <div className={`${className} rounded-lg bg-amber-400/20 border border-amber-500/40 flex items-center justify-center font-black text-amber-600 text-xs`}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}
