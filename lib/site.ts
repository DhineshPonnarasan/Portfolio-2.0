/**
 * Centralised site constants. Used by metadata, sitemap, robots, OG tags, etc.
 * Keep in sync with the canonical domain (do not hard-code elsewhere).
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://me.toinfinite.dev';

export const SITE_NAME = 'Dhinesh Portfolio';

export const SITE_DESCRIPTION =
    'Personal portfolio of Dhinesh Sadhu Subramaniam Ponnarasan — AI/ML engineer and software developer building intelligent systems, scalable applications, and research-driven solutions.';

export const SITE_AUTHOR = 'Dhinesh Ponnarasan';

export const SITE_TWITTER = '@DhineshPonnarasan';

export const SITE_LOCALE = 'en_US';

export const OG_IMAGE = '/logo/og-image.png';