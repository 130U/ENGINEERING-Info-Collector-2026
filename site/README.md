# Info Collector Reading Desk

This directory is the deployable, public-facing reading surface for Info Collector, served at
<https://www.theodoreoy.com/ENGINEERING-Info-Collector-2026/>.

- `public/` is generated from the user's translated Markdown library.
- The public snapshot contains no API keys, local filesystem paths, or browser screenshots.
- GitHub Pages deployment is manual: the `Deploy reading site to GitHub Pages (manual)` workflow publishes `public/`.
- All browser assets and article links are relative, so the snapshot works under any base path.

Run `npm.cmd test` from this directory to validate the deployable snapshot.
