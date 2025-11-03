import { menuScrollStyler } from './utils/menuScrollStyler';
import { currentYearInserter } from './utils/currentYearInserter';

window.Webflow ||= [];
window.Webflow.push(() => {
  menuScrollStyler();
  currentYearInserter();
});
