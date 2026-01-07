export const coloredCardsStyler = () => {
  const coloredCardsGrid = document.querySelector('.colored-cards-grid');
  
  if (!coloredCardsGrid) return;

  const items = coloredCardsGrid.querySelectorAll('.colored-cards-grid_item');
  
  if (!items.length) return;

  // Try to get colors from data attribute
  const dataAttribute = coloredCardsGrid.getAttribute('colored-cards-grid-data');
  
  let colorPattern: string[];
  
  if (dataAttribute && dataAttribute.trim()) {
    // Parse colors from attribute (comma-separated hex values without #)
    colorPattern = dataAttribute.split(',').map(color => {
      const trimmedColor = color.trim();
      // Add # prefix if not present
      return trimmedColor.startsWith('#') ? trimmedColor : `#${trimmedColor}`;
    });
  } else {
    // Fallback: default pattern of background colors from design
    colorPattern = [
      '#E8E9EA', // Light gray (Engineered integrity)
      '#FEFCE8', // Light yellow (Customization as a standard)
      '#E0F2FE', // Light blue (Proof before promise)
      '#FCE7F3', // Light pink (Partnership first)
      '#E0F2E9', // Light green (Transparency)
      '#D1D5DB', // Medium gray (Global service assurance)
    ];
  }

  // Apply colors cyclically to each item
  items.forEach((item, index) => {
    const colorIndex = index % colorPattern.length;
    (item as HTMLElement).style.backgroundColor = colorPattern[colorIndex];
  });
};

