/**
 * Shared constants for the legal pages, kept in one place so the contact
 * address and the "last updated" date can't drift between Terms and Privacy.
 *
 * TODO (owner action): LEGAL_CONTACT_EMAIL must be an address that is
 * actually monitored. A privacy policy needs a working contact route for
 * access and erasure requests, so this cannot stay pointing at an inbox
 * nobody reads.
 *
 * TODO (owner action): LEGAL_JURISDICTION decides which country's law
 * governs the Terms. It is intentionally left as a placeholder rather than
 * guessed, because guessing it wrong is worse than leaving it obviously
 * unfinished.
 */
export const LEGAL_CONTACT_EMAIL = "hello@pitchstudy.com";

export const LEGAL_JURISDICTION = "[JURISDICTION TO BE SET]";

/** Bump whenever either document changes in substance. */
export const LEGAL_UPDATED = "8 August 2026";
