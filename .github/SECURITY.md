# Security

## Supported surface

Security fixes target the current `main` branch on Windows 11, Chrome Manifest V3 and Python 3.9+. Report vulnerabilities privately by email to theodore.oy2025@gmail.com, not in a public issue; do not include API keys, cookies, private article text or signed URLs in a report.

## Trust boundaries

- Bookmarks, URLs, rendered pages and extracted text are untrusted input.
- Browser capture requires a user click on the active tab. It stores visible article text only; it does not copy cookies, authorization headers, passwords or form fields.
- Anonymous fetching accepts public HTTP(S) only, rejects non-public DNS/IP results and revalidates redirects. Application checks do not replace a production egress firewall.
- 401/403 are authorization outcomes, not scraper errors. The system does not brute-force, rotate identities or bypass access controls.
- Extracted text is data, never model instructions. Login/challenge boilerplate and low-signal results are quarantined before the model call.
- Native Messaging only accepts the fixed extension origin. Captures are bounded to 1.5 MB and written under the current user's `.info-collector` directory.

## Secrets

Model API keys are stored with current-user DPAPI. `config.json` keeps only a credential reference. `INFO_COLLECTOR_API_KEY` is supported for short-lived CI use.

## Deployment responsibilities

Before a commercial deployment, add network-level egress controls, review source licenses/terms, define retention and deletion rules, restrict filesystem ACLs, and run the fault-injection checklist in [docs/OPERATIONS.md](../docs/OPERATIONS.md). The project does not claim universal source authorization or global privacy compliance.
