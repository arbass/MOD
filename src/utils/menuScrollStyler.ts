export const menuScrollStyler = () => {
  const menuNav = document.querySelector('[el-menu-nav]');
  const menuDarkSections = document.querySelectorAll('[menu-dark]');
  const menuLightSections = document.querySelectorAll('[menu-light]');
  const logoDark = document.querySelector('[el-menu-logo-dark]');
  const logoLight = document.querySelector('[el-menu-logo-light]');

  // Check if key elements exist on the page
  if (!menuNav || (menuDarkSections.length === 0 && menuLightSections.length === 0)) {
    return;
  }

  // Add transition style for smooth background color change
  const menuNavElement = menuNav as HTMLElement;
  menuNavElement.style.transition = 'background-color 100ms ease';

  // Add transition for logos if they exist
  if (logoDark) {
    (logoDark as HTMLElement).style.transition = 'opacity 100ms ease';
  }
  if (logoLight) {
    (logoLight as HTMLElement).style.transition = 'opacity 100ms ease';
  }

  let isInDarkZone = false;
  let currentLogoState: 'light' | 'default' = 'default';

  const updateMenuStyle = () => {
    // Only run on screens >= 768px
    if (window.innerWidth < 768) {
      // Reset styles on smaller screens
      menuNavElement.style.backgroundColor = '';
      if (logoDark) {
        (logoDark as HTMLElement).style.opacity = '';
      }
      if (logoLight) {
        (logoLight as HTMLElement).style.opacity = '';
      }
      return;
    }

    const menuRect = menuNav.getBoundingClientRect();
    const menuTop = menuRect.top + window.scrollY;
    const menuBottom = menuTop + menuRect.height;

    let shouldBeDark = false;
    let shouldShowLightLogo = false;

    // Check if menu intersects with any dark section
    for (const darkSection of menuDarkSections) {
      const darkRect = darkSection.getBoundingClientRect();
      const darkTop = darkRect.top + window.scrollY;
      const darkBottom = darkTop + darkRect.height;

      // Check intersection
      if (menuTop < darkBottom && menuBottom > darkTop) {
        shouldBeDark = true;

        // Check if this section has logo-light value
        const attrValue = darkSection.getAttribute('menu-dark');
        if (attrValue === 'logo-light') {
          shouldShowLightLogo = true;
        }
        break;
      }
    }

    // Check if menu intersects with any light section (if not already in dark zone)
    if (!shouldBeDark) {
      for (const lightSection of menuLightSections) {
        const lightRect = lightSection.getBoundingClientRect();
        const lightTop = lightRect.top + window.scrollY;
        const lightBottom = lightTop + lightRect.height;

        // Check intersection
        if (menuTop < lightBottom && menuBottom > lightTop) {
          // Check if this section has logo-light value
          const attrValue = lightSection.getAttribute('menu-light');
          if (attrValue === 'logo-light') {
            shouldShowLightLogo = true;
          }
          break;
        }
      }
    }

    // Update background style only if state changed
    if (shouldBeDark !== isInDarkZone) {
      isInDarkZone = shouldBeDark;

      if (isInDarkZone) {
        menuNavElement.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
      } else {
        menuNavElement.style.backgroundColor = '';
      }
    }

    // Update logo visibility based on logo-light attribute
    const newLogoState = shouldShowLightLogo ? 'light' : 'default';

    if (newLogoState !== currentLogoState) {
      currentLogoState = newLogoState;

      if (logoDark && logoLight) {
        if (currentLogoState === 'light') {
          (logoDark as HTMLElement).style.opacity = '0';
          (logoLight as HTMLElement).style.opacity = '1';
        } else {
          (logoDark as HTMLElement).style.opacity = '';
          (logoLight as HTMLElement).style.opacity = '';
        }
      }
    }
  };

  // Initial check
  updateMenuStyle();

  // Listen for scroll events
  window.addEventListener('scroll', updateMenuStyle);

  // Listen for resize events
  window.addEventListener('resize', updateMenuStyle);

  // Cleanup function
  return () => {
    window.removeEventListener('scroll', updateMenuStyle);
    window.removeEventListener('resize', updateMenuStyle);
  };
};
