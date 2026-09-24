// Brand configuration
// Set REACT_APP_BRAND=samuk in .env to build the SAMUK version
// Set REACT_APP_BRAND=maximal (or leave unset) for the Maximal Forklifts UK version

export const isSAMUK = process.env.REACT_APP_BRAND === 'samuk';

export const brandConfig = {
  name: isSAMUK ? 'SAMUK' : 'Maximal Forklifts UK',
  shortName: isSAMUK ? 'SAMUK' : 'Maximal UK',
  logo: isSAMUK ? '/img/samuk-logo.png' : '/img/logo-black.png',
  mainSiteUrl: isSAMUK ? 'https://www.samuk.com' : 'https://maximalforklift.co.uk',
  mainSiteLabel: isSAMUK ? 'samuk.com' : 'maximalforklift.co.uk',
  footerText: isSAMUK ? 'SAMUK' : 'Maximal UK - Dealer Portal',
  copyrightYear: new Date().getFullYear(),
};
