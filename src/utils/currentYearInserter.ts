export const currentYearInserter = () => {
  const currentYearElement = document.getElementById('current-year');
  
  // Check if key element exists on the page
  if (!currentYearElement) {
    return;
  }

  // Insert current year into the element
  const currentYear = new Date().getFullYear();
  currentYearElement.textContent = currentYear.toString();
};

