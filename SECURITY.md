# Security Rules

These rules apply to all code in this project. Claude must follow them without exception.

> **Context:** PitchStudy v1 is a static, account-free content site (no database, no auth, no user input beyond client-side UI interaction). The Authentication/Authorization and Injection sections below are forward-looking for Phase 3 (accounts, progress tracking) — apply them once a backend/accounts exist, but don't build auth/DB scaffolding before it's needed.

## Input Validation
- Validate and sanitize all user input at system boundaries (API routes, CLI args, form handlers)
- Use allowlists, not blocklists
- Reject unexpected fields; don't silently ignore them
- Validate type, length, format, and range

## Authentication & Authorization
- Never store plaintext passwords — use bcrypt (cost ≥ 12) or argon2id
- Use short-lived access tokens; store refresh tokens in httpOnly, Secure, SameSite=Strict cookies
- Enforce authorization on every request, not just in the UI
- Re-verify ownership on every resource access (prevent IDOR)
- Implement rate limiting on auth and sensitive endpoints

## Secrets & Configuration
- Store all secrets in environment variables — never in source code or config files
- Add `.env` to `.gitignore` before the first commit
- Rotate any secret that was accidentally committed, even briefly
- Never log secrets, tokens, session IDs, or PII
- Use `.env.example` with placeholder values for documentation

## Dependencies
- Pin exact versions in lockfiles (`package-lock.json`, `uv.lock`, `go.sum`)
- Run `npm audit` / `pip-audit` / `govulncheck` before each deploy
- Review changelogs when upgrading for security-relevant changes
- Remove unused dependencies

## OWASP Top 10 Mitigations
| Vulnerability | Mitigation |
|---|---|
| Injection (SQL, NoSQL, shell) | Parameterized queries or ORM; never interpolate user input |
| XSS | Escape all output; set `Content-Security-Policy` header |
| CSRF | Use `SameSite=Strict` cookies or per-request CSRF tokens |
| Insecure Direct Object References | Verify resource ownership on every request |
| Security Misconfiguration | Disable debug endpoints in production; remove default credentials |
| Sensitive Data Exposure | HTTPS everywhere; set HSTS; never return more data than needed |
| Broken Access Control | Default-deny; explicit grants only |
| Using Components with Known Vulnerabilities | See Dependencies section above |

## Code Review Checklist
Before any PR is merged, verify:
- [ ] No hardcoded secrets, tokens, or credentials
- [ ] All user input validated before use
- [ ] SQL / NoSQL queries use parameterized form
- [ ] Error messages do not expose stack traces or internal paths to users
- [ ] No new dependencies with known high/critical CVEs
- [ ] Sensitive operations are logged (audit trail), but without PII or secrets
