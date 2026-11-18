import React from 'react';

// Authentic, single-color all-black monochrome logo marks for premier tech companies
export function CompanyLogoMark({ name, className = "w-5 h-5 sm:w-6 sm:h-6", color = "#0A0A0A" }) {
  const norm = (name || '').toLowerCase().trim();

  // 1. Microsoft: 4 squares in single black color
  if (norm.includes('microsoft')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Microsoft">
        <rect x="1" y="1" width="10" height="10" rx="0.5" fill={color}/>
        <rect x="13" y="1" width="10" height="10" rx="0.5" fill={color}/>
        <rect x="1" y="13" width="10" height="10" rx="0.5" fill={color}/>
        <rect x="13" y="13" width="10" height="10" rx="0.5" fill={color}/>
      </svg>
    );
  }

  // 2. Google: Official 'G' mark in single black color
  if (norm.includes('google')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill={color}/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill={color}/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill={color}/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill={color}/>
      </svg>
    );
  }

  // 3. Walmart: 6-ray sunburst spark in single black color
  if (norm.includes('walmart')) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Walmart">
        <g fill={color}>
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

  // 4. Amazon: 'a' with signature smile arrow in single black color
  if (norm.includes('amazon')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Amazon">
        <path d="M13.9 12.8c-.8 0-1.4.1-1.7.4-.3.2-.5.6-.5 1 0 .4.1.8.4 1 .3.2.7.4 1.2.4.7 0 1.3-.2 1.8-.7.5-.5.8-1.1.8-1.8v-.3h-2zm4.1 4.5h-1.9v-1.1c-.5.4-1.1.8-1.8 1-.6.2-1.3.4-2.1.4-1.2 0-2.2-.3-2.9-1-.7-.7-1.1-1.6-1.1-2.7 0-1.2.4-2.1 1.2-2.7.8-.7 2-1 3.5-1h3.1v-.6c0-.7-.2-1.2-.5-1.5-.4-.3-1-.5-1.7-.5-.6 0-1.1.1-1.6.4-.5.3-.8.6-1 1.1l-1.8-.9c.4-.7 1-1.3 1.8-1.8.8-.4 1.7-.7 2.8-.7 1.4 0 2.5.4 3.2 1.1.7.7 1.1 1.8 1.1 3.2v6.6h-.2z" fill={color}/>
        <path d="M2.5 19.5c5.5 3.1 12.8 2.8 18.2-.8.2-.2.4.1.2.3-5.2 4-13 4.3-18.6 1-.2-.1-.1-.4.2-.5z" fill={color}/>
        <path d="M20.9 17.8c.2-.5 1-2.4 1-2.4s-1.8.9-2.3 1.1c-.2.1-.2.2 0 .3.5.2 1.1.6 1.3 1z" fill={color}/>
      </svg>
    );
  }

  // 5. PayPal: Double overlapping P in single black color
  if (norm.includes('paypal')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PayPal">
        <path d="M6.5 2.5h7c2.8 0 4.8 1.3 4.3 4.2-.4 2.5-2.3 4.2-4.8 4.2h-3l-1.3 8.6H4.8l2.2-14.5a.7.7 0 0 1 .7-.5z" fill={color}/>
        <path d="M9.8 7.5h6.5c2.6 0 4.4 1.3 4 4-.4 2.6-2.4 4.5-5 4.5h-2.8l-1.3 7H7.4l2-13a.6.6 0 0 1 .4-.5z" fill={color} fillOpacity="0.75"/>
      </svg>
    );
  }

  // 6. Deloitte: Bold D with signature dot in single black color
  if (norm.includes('deloitte')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Deloitte">
        <path d="M4 4h7.5c4.7 0 8.5 3.6 8.5 8s-3.8 8-8.5 8H4V4zm4 12.5h3.5c2.5 0 4.5-2 4.5-4.5s-2-4.5-4.5-4.5H8v9z" fill={color}/>
        <circle cx="21" cy="18" r="2.5" fill={color}/>
      </svg>
    );
  }

  // 7. TCS: Tata Consultancy Services emblem in single black color
  if (norm.includes('tcs') || norm.includes('tata')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="TCS">
        <rect x="2" y="2" width="20" height="20" rx="5" fill={color}/>
        <path d="M5.5 7.5h4v1.5H8v7.5H6.5V9H5.5V7.5zm5.5 4.5c0-2.8 1.5-4.5 3.8-4.5 1.5 0 2.5.6 3.2 1.5l-1.1 1.1c-.5-.6-1.1-.9-2.1-.9-1.5 0-2.3 1.2-2.3 2.8s.8 2.8 2.3 2.8c1 0 1.6-.3 2.1-.9l1.1 1.1c-.7.9-1.7 1.5-3.2 1.5-2.3 0-3.8-1.7-3.8-4.5zm8 4.5v-1.5h1.5v1.5H19z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // 8. Genpact: Concentric circle disc in single black color
  if (norm.includes('genpact')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Genpact">
        <circle cx="12" cy="12" r="10" fill={color}/>
        <circle cx="12" cy="12" r="4.2" fill="#FFFFFF"/>
      </svg>
    );
  }

  // 9. Tech Mahindra: Geometric diamond mark in single black color
  if (norm.includes('mahindra')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Tech Mahindra">
        <rect x="2" y="2" width="20" height="20" rx="4" fill={color}/>
        <path d="M12 4.5L19.5 12L12 19.5L4.5 12L12 4.5z" fill="#FFFFFF"/>
        <path d="M12 8L16 12L12 16L8 12L12 8z" fill={color}/>
      </svg>
    );
  }

  // 10. PwC: Geometric facet blocks in single black color
  if (norm.includes('pwc')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PwC">
        <rect x="3" y="5" width="6.5" height="6.5" fill={color}/>
        <rect x="10.5" y="5" width="6.5" height="6.5" fill={color} fillOpacity="0.8"/>
        <rect x="6.5" y="12.5" width="6.5" height="6.5" fill={color} fillOpacity="0.9"/>
        <rect x="14" y="12.5" width="6.5" height="6.5" fill={color} fillOpacity="0.7"/>
      </svg>
    );
  }

  // 11. EY: EY tag & beam in single black color
  if (norm.includes('ey') || norm.includes('ernst')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="EY">
        <rect x="2" y="2" width="20" height="20" rx="4" fill={color}/>
        <path d="M6 7h6.5v2.2H8.8v2.2h3.2v2.1H8.8v2.3h3.7V18H6V7z" fill="#FFFFFF"/>
        <path d="M14 7l2.2 4.4L18.4 7H21l-3.5 6.2V18h-2.5v-4.8L11.5 7H14z" fill="#FFFFFF"/>
        <polygon points="17,3 22,3 19,6 14,6" fill="#FFFFFF"/>
      </svg>
    );
  }

  // 12. Cognizant: Compass arc mark in single black color
  if (norm.includes('cognizant')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Cognizant">
        <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="2.5" fill="none"/>
        <path d="M12 2.5A9.5 9.5 0 0 1 21.5 12" stroke={color} strokeWidth="3" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="3.5" fill={color}/>
      </svg>
    );
  }

  // 13. Wipro: Concentric flower dots in single black color
  if (norm.includes('wipro')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Wipro">
        <circle cx="12" cy="4.5" r="2.2" fill={color}/>
        <circle cx="17.3" cy="7.5" r="2.2" fill={color}/>
        <circle cx="17.3" cy="16.5" r="2.2" fill={color}/>
        <circle cx="12" cy="19.5" r="2.2" fill={color}/>
        <circle cx="6.7" cy="16.5" r="2.2" fill={color}/>
        <circle cx="6.7" cy="7.5" r="2.2" fill={color}/>
        <circle cx="12" cy="12" r="3" fill={color}/>
      </svg>
    );
  }

  // 14. Infosys: Signature 'i' symbol in single black color
  if (norm.includes('infosys')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Infosys">
        <rect x="2" y="2" width="20" height="20" rx="5" fill={color}/>
        <circle cx="8" cy="7" r="1.8" fill="#FFFFFF"/>
        <path d="M6.5 10.5h3V18h-3v-7.5zm7-3.5h3v11h-3V7z" fill="#FFFFFF"/>
        <path d="M10 14c1.5-1.5 4.5-1.5 6 0" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }

  // 15. Capgemini: Ace of Spades emblem in single black color
  if (norm.includes('capgemini')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Capgemini">
        <path d="M12 2C9.5 5.5 4 10 4 13.5c0 3 2.5 5.5 5.5 5.5 1.5 0 2.5-.7 2.5-1.5 0 .8 1 1.5 2.5 1.5 3 0 5.5-2.5 5.5-5.5C20 10 14.5 5.5 12 2zm-1.5 16l-1 4h5l-1-4h-3z" fill={color}/>
      </svg>
    );
  }

  // 16. Optum: Sunburst ray in single black color
  if (norm.includes('optum')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Optum">
        <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.5" fill="none"/>
        <path d="M12 3v6m0 6v6M3 12h6m6 0h6M5.6 5.6l4.2 4.2m4.4 4.4l4.2 4.2M5.6 18.4l4.2-4.2m4.4-4.4l4.2-4.2" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    );
  }

  // 17. Dell: Circle medallion with slanted E in single black color
  if (norm.includes('dell')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Dell">
        <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M7 8h2.2c1.8 0 3 1.2 3 2.8 0 1.6-1.2 2.8-3 2.8H7V8zm2.2 4c.8 0 1.4-.5 1.4-1.2 0-.7-.6-1.2-1.4-1.2H8.3v2.4h.9z" fill={color}/>
        <path d="M14 9.5l2-1.8 1.2 1.3-2 1.8 1.4 1.3 1.8-1.6.8.9-2.5 2.3-3.7-3.4.8-.8z" fill={color}/>
        <path d="M18.5 8h1.4v7.6h-1.4V8z" fill={color}/>
      </svg>
    );
  }

  // 18. Intel: Orbit arc & letters in single black color
  if (norm.includes('intel')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Intel">
        <rect x="2" y="2" width="20" height="20" rx="4" fill={color}/>
        <path d="M6 8h2v8H6V8zm4 3.5h2v4.5h-2v-4.5zm0-2.5h2v1.5h-2V9zm4 2.5h2V12c.4-.7 1.1-1 1.9-1 1.4 0 2.1 1 2.1 2.6V16h-2v-2.2c0-.7-.3-1.1-.9-1.1-.6 0-1.1.4-1.1 1.1V16h-2v-4.5z" fill="#FFFFFF"/>
        <path d="M4 17c5 3.5 11 3.5 16 0" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    );
  }

  // 19. Oracle: Rounded pill 'O' in single black color
  if (norm.includes('oracle')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Oracle">
        <rect x="2.5" y="5" width="19" height="14" rx="7" stroke={color} strokeWidth="3.2" fill="none"/>
      </svg>
    );
  }

  // 20. Cisco: Soundwave bridge bars in single black color
  if (norm.includes('cisco')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Cisco">
        <path d="M3 13v3M6 10v6M9 8v8M12 5v11M15 8v8M18 10v6M21 13v3" stroke={color} strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    );
  }

  // 21. IBM: 8-bar striped horizontal logo in single black color
  if (norm.includes('ibm')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="IBM">
        <rect x="2" y="5" width="20" height="1.4" fill={color}/>
        <rect x="2" y="7" width="20" height="1.4" fill={color}/>
        <rect x="2" y="9" width="20" height="1.4" fill={color}/>
        <rect x="2" y="11" width="20" height="1.4" fill={color}/>
        <rect x="2" y="13" width="20" height="1.4" fill={color}/>
        <rect x="2" y="15" width="20" height="1.4" fill={color}/>
        <rect x="2" y="17" width="20" height="1.4" fill={color}/>
      </svg>
    );
  }

  // 22. Accenture: Forward chevron bracket > in single black color
  if (norm.includes('accenture')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Accenture">
        <path d="M4 17.5L14 12L4 6.5l3-2.5L20 12 7 20l-3-2.5z" fill={color}/>
      </svg>
    );
  }

  // 23. Salesforce: Multi-lobe cloud in single black color
  if (norm.includes('salesforce')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Salesforce">
        <path d="M19.4 10.4c-.2-2.8-2.6-5-5.4-5-1.9 0-3.6 1.1-4.5 2.7C8.7 8 7.6 8.5 6.8 9.3c-1.3 1.2-2 2.8-1.8 4.6.2 1.8 1.4 3.3 3.1 3.9h11.2c2.4 0 4.3-1.9 4.3-4.3 0-2.2-1.7-4-3.8-4.2-.1.4-.3.7-.4 1.1z" fill={color}/>
      </svg>
    );
  }

  // 24. Adobe: Stylized 'A' in single black color
  if (norm.includes('adobe')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Adobe">
        <rect x="2" y="2" width="20" height="20" rx="4" fill={color}/>
        <polygon points="14.5,6 19,18 15,18 13.5,14" fill="#FFFFFF"/>
        <polygon points="9.5,6 5,18 9,18 10.5,14" fill="#FFFFFF"/>
        <polygon points="12,10.2 14.2,16 9.8,16" fill="#FFFFFF"/>
      </svg>
    );
  }

  // Default fallback brand mark
  return (
    <div className={`${className} rounded-lg bg-neutral-900 text-white flex items-center justify-center font-black text-xs`}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}
