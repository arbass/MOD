import type { Iti } from 'intl-tel-input';
import intlTelInput from 'intl-tel-input';

/**
 * Phone country selector utility.
 * Initializes intl-tel-input on all inputs with [intl-tel-input_inner] attribute.
 * Provides country code dropdown, number formatting and validation.
 */

const SELECTOR = '[intl-tel-input_inner]';
const CSS_CDN_URL =
  'https://cdn.jsdelivr.net/npm/intl-tel-input@25.12.5/build/css/intlTelInput.min.css';

// Store instances for cleanup
const instances: Map<HTMLInputElement, Iti> = new Map();

export const phoneCountrySelector = () => {
  const phoneInputs = document.querySelectorAll<HTMLInputElement>(SELECTOR);

  // Check if key elements exist on the page
  if (phoneInputs.length === 0) {
    return;
  }

  // Ensure required styles are available
  injectStyles();

  // Initialize each phone input
  phoneInputs.forEach((input) => initPhoneInput(input));

  // Return cleanup function
  return () => {
    instances.forEach((iti) => iti.destroy());
    instances.clear();
  };
};

/**
 * Initialize intl-tel-input on a single input element.
 */
function initPhoneInput(input: HTMLInputElement): void {
  // Skip if already initialized
  if (instances.has(input)) {
    return;
  }

  const iti = intlTelInput(input, {
    // Lazy load utils for validation and formatting
    loadUtils: () => import('intl-tel-input/utils'),

    // Auto-detect country via IP lookup (shows globe icon if detection fails)
    initialCountry: 'auto',
    geoIpLookup: (success, failure) => {
      fetch('https://ipapi.co/json')
        .then((res) => {
          if (!res.ok) throw new Error('GeoIP request failed');
          return res.json();
        })
        .then((data) => {
          if (data.country_code) {
            success(data.country_code);
          } else {
            // Show globe icon - no country selected
            failure();
          }
        })
        .catch(() => {
          // Show globe icon - no country selected
          failure();
        });
    },

    // Priority countries at the top of the list
    countryOrder: ['cz', 'de', 'gb', 'us', 'nl', 'at'],

    // Display options
    separateDialCode: true,
    showFlags: true,
    countrySearch: true,

    // Formatting - nationalMode true since dial code is shown separately
    nationalMode: true,
    formatAsYouType: true,
    autoPlaceholder: 'aggressive',
    strictMode: true,

    // Hidden input for form submission with full international number
    hiddenInput: () => ({
      phone: 'phone_full',
      country: 'phone_country',
    }),

    // i18n
    i18n: {
      searchPlaceholder: 'Search country',
    },
  });

  instances.set(input, iti);

  // Validation on blur
  input.addEventListener('blur', () => handleBlur(input, iti));

  // Clear validation state on focus
  input.addEventListener('focus', () => handleFocus(input));

  // Form submission handling
  const form = input.closest('form');
  if (form) {
    form.addEventListener('submit', (e) => handleSubmit(e, input, iti));
  }

  // Recalculate padding on window resize (debounced)
  let resizeTimeout: ReturnType<typeof setTimeout>;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Trigger recalculation by re-setting the country
      const countryData = iti.getSelectedCountryData();
      if (countryData.iso2) {
        iti.setCountry(countryData.iso2);
      }
    }, 150);
  };
  window.addEventListener('resize', handleResize);
}

/**
 * Handle input blur - validate number.
 */
function handleBlur(input: HTMLInputElement, iti: Iti): void {
  const value = input.value.trim();
  if (!value) {
    clearValidationState(input);
    return;
  }

  if (iti.isValidNumber()) {
    setValidState(input);
  } else {
    setErrorState(input);
  }
}

/**
 * Handle input focus - clear validation styling.
 */
function handleFocus(input: HTMLInputElement): void {
  clearValidationState(input);
}

/**
 * Handle form submission - validate and format number.
 */
function handleSubmit(e: SubmitEvent, input: HTMLInputElement, iti: Iti): void {
  const value = input.value.trim();

  // Allow empty if not required
  if (!value && !input.required) {
    return;
  }

  if (!iti.isValidNumber()) {
    e.preventDefault();
    e.stopPropagation();
    setErrorState(input);
    input.focus();
    return;
  }

  // Replace input value with full international number for Webflow form submission
  const fullNumber = iti.getNumber();
  input.value = fullNumber;
}

/**
 * Set valid state on input.
 */
function setValidState(input: HTMLInputElement): void {
  input.classList.remove('is-error');
  input.classList.add('is-valid');
  input.setCustomValidity('');
}

/**
 * Set error state on input.
 */
function setErrorState(input: HTMLInputElement): void {
  input.classList.remove('is-valid');
  input.classList.add('is-error');
  input.setCustomValidity('Please enter a valid phone number');
}

/**
 * Clear validation state from input.
 */
function clearValidationState(input: HTMLInputElement): void {
  input.classList.remove('is-error', 'is-valid');
  input.setCustomValidity('');
}

/**
 * Inject required CSS styles into the document.
 */
function injectStyles(): void {
  // Library CSS
  if (!document.getElementById('intl-tel-input-css')) {
    const link = document.createElement('link');
    link.id = 'intl-tel-input-css';
    link.rel = 'stylesheet';
    link.href = CSS_CDN_URL;
    link.media = 'all';
    document.head.appendChild(link);
  }

  // Custom overrides for Webflow integration
  if (!document.getElementById('intl-tel-input-custom-css')) {
    const style = document.createElement('style');
    style.id = 'intl-tel-input-custom-css';
    style.textContent = `
      /* Container takes full width */
      .iti {
        width: 100%;
        display: block;
      }

      /* Input takes full width */
      .iti__tel-input {
        width: 100%;
      }

      /* Align country selector inside input */
      .iti--allow-dropdown .iti__country-container {
        inset-inline-start: 0.5rem;
      }

      /* Round left corners on selector */
      .iti__selected-country {
        border-radius: 0.375rem 0 0 0.375rem;
      }

      /* Validation states */
      .iti .is-error {
        border-color: #dc3545 !important;
      }

      .iti .is-valid {
        border-color: #28a745 !important;
      }

      /* Dropdown z-index for Webflow */
      .iti__dropdown-content {
        z-index: 9999;
      }

      /* Taller search input with space for magnifier icon */
      .iti__search-input {
        height: 3rem !important;
        padding: 0.75rem 1rem 0.75rem 2.5rem !important;
        font-size: 1rem;
      }

      /* Add space between dial code and phone number input */
      .iti__selected-dial-code {
        margin-right: 0.5rem !important;
      }
    `;
    document.head.appendChild(style);
  }
}
