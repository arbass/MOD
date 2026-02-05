import { articleCtaCardEditor } from './utils/articleCtaCardEditor';
import { coloredCardsStyler } from './utils/coloredCardsStyler';
import { currentYearInserter } from './utils/currentYearInserter';
import { menuScrollStyler } from './utils/menuScrollStyler';
import { phoneCountrySelector } from './utils/phoneCountrySelector';

window.Webflow ||= [];
window.Webflow.push(() => {
  menuScrollStyler();
  currentYearInserter();
  coloredCardsStyler();
  phoneCountrySelector();
  articleCtaCardEditor();
});
