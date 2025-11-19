import intlTelInput from 'intl-tel-input';

export const phoneCountrySelector = () => {
  const phoneInput = document.querySelector('#phone') as HTMLInputElement;
  
  // Check if key element exists on the page
  if (!phoneInput) {
    return;
  }

  // Ensure required styles are available
  ensureIntlTelInputAssets();

  // Initialize intl-tel-input
  const iti = intlTelInput(phoneInput, {
    // Use full country data (includes country names, dial codes, and flags)
    utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@25.12.5/build/js/utils.js',
    
    // Preferred countries at the top
    preferredCountries: ['ua', 'us', 'gb', 'de'],
    
    // Allow to type the dial code
    nationalMode: false,
    
    // Format as user types
    autoPlaceholder: 'aggressive',
    
    // Separate dial code in the dropdown
    separateDialCode: true,
    
    // Show flags
    showFlags: true,
    
    // Search placeholder
    i18n: {
      searchPlaceholder: 'Search country',
    },
  });

  // Optional: Add validation on blur
  phoneInput.addEventListener('blur', () => {
    if (phoneInput.value.trim()) {
      if (iti.isValidNumber()) {
        phoneInput.classList.remove('error');
        phoneInput.classList.add('valid');
      } else {
        phoneInput.classList.remove('valid');
        phoneInput.classList.add('error');
      }
    }
  });

  // Optional: Clear validation on focus
  phoneInput.addEventListener('focus', () => {
    phoneInput.classList.remove('error', 'valid');
  });

  // Optional: Store the full international number in a hidden field or data attribute
  const form = phoneInput.closest('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      // Get the full international number
      const fullNumber = iti.getNumber();
      
      // Store it in data attribute or update the input value
      phoneInput.dataset.fullNumber = fullNumber;
      
      // Optional: Validate before submit
      if (!iti.isValidNumber()) {
        e.preventDefault();
        phoneInput.classList.add('error');
        console.warn('Invalid phone number');
      }
    });
  }

  // Return cleanup function
  return () => {
    iti.destroy();
  };
};

const CSS_CDN_URL = 'https://cdn.jsdelivr.net/npm/intl-tel-input@25.12.5/build/css/intlTelInput.min.css';

/**
 * Ensure that the intl-tel-input styles are available on the page.
 */
function ensureIntlTelInputAssets() {
  if (!document.getElementById('intl-tel-input-css')) {
    const link = document.createElement('link');
    link.id = 'intl-tel-input-css';
    link.rel = 'stylesheet';
    link.href = CSS_CDN_URL;
    link.media = 'all';
    document.head.appendChild(link);
  }

  if (!document.getElementById('phone-country-custom-style')) {
    const style = document.createElement('style');
    style.id = 'phone-country-custom-style';
    style.textContent = `
      .iti {
        width: 100%;
      }

      .iti__tel-input {
        width: 100%;
      }

      .iti--allow-dropdown .iti__country-container {
        inset-inline-start: 8px;
      }

      .iti__selected-country {
        border-radius: 6px 0 0 6px;
      }
    `;
    document.head.appendChild(style);
  }
}

