/**
 * Institutional Launchpad & OpenAthens Resolver
 * Provides deep-link search URLs for clinical references (Lexicomp, AccessPharmacy)
 * and institutional SSO authentication (XULA OpenAthens).
 */

export interface LaunchpadConfig {
  institutionName: string;
  openAthensAuthUrl: string;
}

export const XULA_OPENATHENS_CONFIG: LaunchpadConfig = {
  institutionName: 'Xavier University of Louisiana (XULA)',
  openAthensAuthUrl: 'https://login.openathens.net/auth/xula.edu/o/71625811',
};

/**
 * Returns deep-link search URL for Lexicomp Online
 */
export function getLexicompSearchUrl(drugName: string): string {
  const query = encodeURIComponent((drugName || '').trim());
  return `https://online.lexi.com/lco/action/search?q=${query}`;
}

/**
 * Returns deep-link search URL for AccessPharmacy (McGraw Hill Medical)
 */
export function getAccessPharmacySearchUrl(drugName: string): string {
  const query = encodeURIComponent((drugName || '').trim());
  return `https://accesspharmacy.mhmedical.com/SearchResults.aspx?q=${query}`;
}

/**
 * Resolves the institutional OpenAthens authentication URL (defaults to XULA)
 */
export function getOpenAthensAuthUrl(config?: LaunchpadConfig): string {
  return config?.openAthensAuthUrl || XULA_OPENATHENS_CONFIG.openAthensAuthUrl;
}
