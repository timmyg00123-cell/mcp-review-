/**
 * Institutional Launchpad & OpenAthens / EZProxy Resolver
 * Provides deep-link search URLs for clinical references (Lexicomp, AccessPharmacy)
 * and institutional SSO authentication (OpenAthens, EZProxy, or Direct).
 */

export type LaunchpadAuthType = 'openathens' | 'ezproxy' | 'direct';

export interface LaunchpadConfig {
  institutionName: string;
  authType?: LaunchpadAuthType;
  openAthensAuthUrl: string;
  ezproxyPrefix?: string;
  showBadges?: boolean;
}

export const DEFAULT_LAUNCHPAD_CONFIG: LaunchpadConfig = {
  institutionName: 'Xavier University of Louisiana (XULA)',
  authType: 'openathens',
  openAthensAuthUrl: 'https://login.openathens.net/auth/xula.edu/o/71625811',
  ezproxyPrefix: '',
  showBadges: true,
};

export const XULA_OPENATHENS_CONFIG: LaunchpadConfig = DEFAULT_LAUNCHPAD_CONFIG;

const STORAGE_KEY = 'launchpad_config';

/**
 * Loads launchpad configuration from localStorage with error recovery
 */
export function loadLaunchpadConfig(): LaunchpadConfig {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return { ...DEFAULT_LAUNCHPAD_CONFIG };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_LAUNCHPAD_CONFIG };
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { ...DEFAULT_LAUNCHPAD_CONFIG };
    }

    const authType: LaunchpadAuthType =
      parsed.authType === 'ezproxy' || parsed.authType === 'direct' || parsed.authType === 'openathens'
        ? parsed.authType
        : DEFAULT_LAUNCHPAD_CONFIG.authType;

    return {
      institutionName: typeof parsed.institutionName === 'string' ? parsed.institutionName : DEFAULT_LAUNCHPAD_CONFIG.institutionName,
      authType,
      openAthensAuthUrl: typeof parsed.openAthensAuthUrl === 'string' ? parsed.openAthensAuthUrl : DEFAULT_LAUNCHPAD_CONFIG.openAthensAuthUrl,
      ezproxyPrefix: typeof parsed.ezproxyPrefix === 'string' ? parsed.ezproxyPrefix : DEFAULT_LAUNCHPAD_CONFIG.ezproxyPrefix,
      showBadges: typeof parsed.showBadges === 'boolean' ? parsed.showBadges : DEFAULT_LAUNCHPAD_CONFIG.showBadges,
    };
  } catch {
    return { ...DEFAULT_LAUNCHPAD_CONFIG };
  }
}

/**
 * Saves launchpad configuration to localStorage and notifies listeners
 */
export function saveLaunchpadConfig(config: LaunchpadConfig): void {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Ignore localStorage write failures (e.g. quota, private mode)
    }
  }

  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    try {
      const event =
        typeof CustomEvent === 'function'
          ? new CustomEvent('launchpad-config-changed', { detail: config })
          : new Event('launchpad-config-changed');
      window.dispatchEvent(event);
    } catch {
      // Ignore event dispatch failures in mock environments
    }
  }
}

/**
 * Formats an EZProxy prefix to cleanly append a target URL
 */
function formatEzproxyPrefix(prefix: string): string {
  let cleaned = (prefix || '').trim();
  if (!cleaned) return '';

  if (cleaned.endsWith('=')) {
    return cleaned;
  }
  if (cleaned.endsWith('url')) {
    return `${cleaned}=`;
  }
  if (cleaned.endsWith('url/')) {
    return `${cleaned.slice(0, -1)}=`;
  }
  if (!cleaned.includes('?') && !cleaned.includes('=')) {
    if (cleaned.endsWith('/')) {
      return `${cleaned.slice(0, -1)}?url=`;
    }
    return `${cleaned}?url=`;
  }
  return cleaned;
}

/**
 * Resolves a clinical reference URL using the configured auth method
 */
function resolveLaunchpadUrl(targetUrl: string, config?: LaunchpadConfig): string {
  const activeConfig = config ?? loadLaunchpadConfig();

  if (activeConfig.authType === 'ezproxy' && activeConfig.ezproxyPrefix?.trim()) {
    const formattedPrefix = formatEzproxyPrefix(activeConfig.ezproxyPrefix);
    return `${formattedPrefix}${encodeURIComponent(targetUrl)}`;
  }

  return targetUrl;
}

/**
 * Returns deep-link search URL for Lexicomp Online
 */
export function getLexicompSearchUrl(drugName: string, config?: LaunchpadConfig): string {
  const query = encodeURIComponent((drugName || '').trim());
  const targetUrl = `https://online.lexi.com/lco/action/search?q=${query}`;
  return resolveLaunchpadUrl(targetUrl, config);
}

/**
 * Returns deep-link search URL for AccessPharmacy (McGraw Hill Medical)
 */
export function getAccessPharmacySearchUrl(drugName: string, config?: LaunchpadConfig): string {
  const query = encodeURIComponent((drugName || '').trim());
  const targetUrl = `https://accesspharmacy.mhmedical.com/SearchResults.aspx?q=${query}`;
  return resolveLaunchpadUrl(targetUrl, config);
}

/**
 * Resolves the institutional OpenAthens authentication URL (defaults to XULA)
 */
export function getOpenAthensAuthUrl(config?: LaunchpadConfig): string {
  const active = config ?? loadLaunchpadConfig();
  return active.openAthensAuthUrl || DEFAULT_LAUNCHPAD_CONFIG.openAthensAuthUrl;
}
