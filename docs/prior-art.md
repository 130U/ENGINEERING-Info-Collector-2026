# Prior art

Before building, I studied the products and open-source projects that already turn saved pages into something
readable. Each solves one part of the problem well. This page records what each establishes, where it stops, and
what this product takes from it or adds beyond it.

## The short version

| Work | What it establishes | Where it stops | What Info Collector does |
| --- | --- | --- | --- |
| Shi Wang's [Info Collector](https://github.com/aswrise/info-collector) (macOS) | The extension owns the queue; local scripts do the work through a file spool over Chrome native messaging | macOS scheduling, a key in a plain config file, one generic failure state | Builds the Windows product on the same bridge, with typed failures, sealed keys, hash-pinned flows and a reading front end |
| [Pocket](https://getpocket.com), [Omnivore](https://github.com/omnivore-app/omnivore) | Read-later as a mainstream habit; save once, read on any device | Hosted: Omnivore closed in November 2024, Pocket in July 2025 | Keeps the library as Markdown on the reader's disk |
| [wallabag](https://github.com/wallabag/wallabag), [Karakeep](https://github.com/karakeep-app/karakeep) | Self-hosted read-later; Karakeep adds AI tagging and full-text search | A server and a database to run; no translation | Needs neither; tags, summary and translation are part of each file |
| [Readability](https://github.com/mozilla/readability), [Defuddle](https://github.com/kepano/defuddle) | Reliable main-content extraction from arbitrary pages | Cannot tell an article from a login wall | Puts a quality gate and typed failures after extraction; Defuddle is an optional extractor |
| [Immersive Translate](https://github.com/immersive-translate/immersive-translate) | Bilingual reading in the browser, in place | The translation lives as long as the tab | Keeps the translation, with summary, tags and a link to the original |
| [Obsidian Web Clipper](https://github.com/obsidianmd/obsidian-clipper) | Clipping to Markdown files the user owns, with templates | One page at a time, inside the browser; no queue, retry or translation pipeline | Queues work, runs it outside the browser, and survives crashes and failures |

## Notes

### Shi Wang, Info Collector (macOS)

The project this product starts from, and the source of its best structural idea. Chrome bookmarks are only an
import source; the extension owns every article's processing state, keyed by a normalized URL and kept in 32 hashed
buckets of synced storage with a local archive. Work runs in ordinary scripts that never see Chrome: the extension
writes each processing type's pending list to an outbox through a native-messaging host and reads completion reports
from an inbox. Four short architecture decisions record the reasoning, and they hold up.

It is a personal macOS pipeline. Scheduling is `launchd`, setup is a bash script, the model key is pasted into a
plain configuration file, and a failed article carries one generic status and an exception message. I kept the
bridge, the queue and the bucketed storage, and built around them everything a product needs on Windows: a
PowerShell installer, credentials sealed with DPAPI, the native-messaging binary protocol tested on Windows, visible
text capture from the popup, a hash-pinned flow registry, a translation worker with 19 typed failures, checkpoints
and budgets, a reading desk with its generator, the weekly recap, and CI on Windows and Ubuntu.

### Pocket and Omnivore

Pocket made read-later a habit for millions of readers; Omnivore showed that an open-source read-later service with
highlights and newsletters could compete with it. Both were services. Omnivore's team joined ElevenLabs and its
hosted service shut down in November 2024; Mozilla closed Pocket in July 2025, leaving export as the only way to keep
a library. The lesson is about where a library lives, not about features: a reading library gains value with time,
so it has to outlast the company that hosts it. That is the reason every article here is a Markdown file on the
reader's own disk.

### wallabag and Karakeep

The self-hosted answer to the same lesson. wallabag saves and classifies articles on the user's own server.
Karakeep (formerly Hoarder) saves links, notes and images, tags them automatically with an OpenAI or local Ollama
model, and offers full-text search. Both keep the data with the user, and both require a server, a database and
someone to maintain them. Neither translates. Info Collector reaches the same ownership with plain files, and puts
the translation, summary and tags inside each file.

### Readability and Defuddle

Mozilla's Readability, the library behind Firefox Reader View, and kepano's Defuddle, behind Obsidian Web Clipper,
are the standard ways to pull the main content out of a page. They answer "what is the main block of this page?",
which is a different question from "is this the article?". Given a login wall, a consent page or a paywall stub, they
return its main block faithfully. Info Collector treats extraction as the start of a check, not its end: a quality
gate rejects login boilerplate and thin pages, and a source that needs authorization ends in a typed failure before
any model is called. Defuddle can be configured as an extractor at an audited absolute path.

### Immersive Translate

The leading bilingual web translation extension: it translates the page in front of the reader, paragraph beside
paragraph, and also handles PDFs, ebooks and subtitles. It proves how much a reader gains from reading in their own
language. It keeps nothing: the translation is gone when the tab closes, and there is no record of what was read.
Info Collector produces the translation once, files it with a summary and tags, and links it back to the original.

### Obsidian Web Clipper

The closest in spirit: it clips a page into Markdown inside a vault the user owns, through customizable templates,
and can fill template fields with a language model. It works one page at a time in the browser, synchronously. A
long article, a failed request or a closed tab ends the attempt, and nothing tracks what still needs processing.
Info Collector moves the slow work out of the browser into a queue that survives crashes, budgets every paid call
and names every failure.

## Where the product goes further

1. **A bridge with no command channel.** The browser names a processing type; the host alone decides what runs,
   from a registry pinned by SHA-256.
2. **A failure taxonomy for capture and translation.** 19 codes, each with a stage, a retryable flag and an operator
   action. Authorization outcomes are terminal, and no failure produces a placeholder translation.
3. **Exactly-once effects without a database.** Atomic writes, acknowledged reports, idempotent application by
   normalized URL and claims that lapse when a worker dies.
4. **Bounded cost.** Three attempts for retryable failures only, a per-article input budget, and segment
   checkpoints so that an interrupted article never pays twice.
5. **A library that is only files.** The reading desk and the weekly recap are generated from Markdown and open
   without a server.
