import { menuScrollStyler } from './utils/menuScrollStyler';
import { currentYearInserter } from './utils/currentYearInserter';
import { coloredCardsStyler } from './utils/coloredCardsStyler';
import { phoneCountrySelector } from './utils/phoneCountrySelector';

window.Webflow ||= [];
window.Webflow.push(() => {
  menuScrollStyler();
  currentYearInserter();
  coloredCardsStyler();
  phoneCountrySelector();
});
