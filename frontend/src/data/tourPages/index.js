import chardhamTours from './chardhamTours.js';
import goaTours from './goaTours.js';
import gujaratTours from './gujaratTours.js';
import mumbaiTours from './mumbaiTours.js';
import upTours from './upTours.js';
import maharashtraTours from './maharashtraTours.js';
import keralaTours from './keralaTours.js';

export {
  chardhamTours,
  goaTours,
  gujaratTours,
  mumbaiTours,
  upTours,
  maharashtraTours,
  keralaTours,
};

// Also export a flattened array of all tours if needed
export const allTourPages = [
  ...chardhamTours,
  ...goaTours,
  ...gujaratTours,
  ...mumbaiTours,
  ...upTours,
  ...maharashtraTours,
  ...keralaTours,
];
