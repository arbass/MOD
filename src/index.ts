import { menuScrollStyler } from './utils/menuScrollStyler';
import { currentYearInserter } from './utils/currentYearInserter';
import { coloredCardsStyler } from './utils/coloredCardsStyler';

window.Webflow ||= [];
window.Webflow.push(() => {
  menuScrollStyler();
  currentYearInserter();
  coloredCardsStyler();
});
