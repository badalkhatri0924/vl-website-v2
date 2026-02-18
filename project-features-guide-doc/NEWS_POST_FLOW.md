# News Post Flow – Sort & Understand

This document explains how the **News Post** feature works: from picking a category to saving LinkedIn posts.

---

## 1. Overview

- **What it does:** Fetches latest news for a category, sends it to Gemini, and generates 3–4 LinkedIn post options. User can copy/save them.
- **Your Gemini API key:** Used only when generating post text (Step 3). RSS fetch (Step 2) does **not** use any API key.

---

## 2. Flow (Step by Step)

| Step | What Happens | Uses Gemini API Key? |
|------|--------------|----------------------|
| 1 | User selects a category (AI News, Tech India, Tech Global, Latest Trend Worldwide) and clicks generate. | No |
| 2 | App fetches **latest news** from **Google News RSS** for that category (up to 15 articles). | No |
| 3 | App sends the **top 4 news items** from that feed as context to **Gemini**; Gemini returns 3–4 LinkedIn post options. | **Yes** |
| 4 | User can copy posts or save the batch (posts + source articles) to Firestore. | No |

---

## 3. RSS (Really Simple Syndication)

- **Meaning:** A standard way for sites to publish a **feed** of latest items (e.g. news) as XML at a URL.
- **In this flow:** Google News exposes RSS feed URLs per search/category. The app calls that URL, gets XML, and parses it into titles, links, and dates.
- **Result:** Every time you generate, you get the **current** latest news for that category (no caching). No API key is used for the RSS fetch.

---

## 4. Where Things Live in Code

| Part | Location |
|------|----------|
| News feed (RSS fetch + parse) | `app/api/news/feed/route.ts` |
| LinkedIn post generation (Gemini) | `app/api/linkedin/news-generate/route.ts` |
| Gemini prompt / news context | `lib/linkedinPrompt.ts` |
| Admin UI (category, generate, saved batches) | `app/admin/news-post/page.tsx` |
| Save/list batches | `app/api/news-posts/save/route.ts`, `app/api/news-posts/list/route.ts`, `lib/newPosts.ts` |

---

## 5. Categories

- **No "all" category.** User picks one at a time: `ai-news`, `tech-india`, `tech-global`, `trend-worldwide`.
- Saved posts are shown **per category** (all saved batches for that category, newest first).

---

## 6. Summary

- **RSS** = fetch latest news from Google (no API key).
- **Gemini** = generate LinkedIn post text from that news (**uses your API key**, e.g. `API_KEY` env var).
- Each run uses the **latest** feed for the chosen category and generates a new set of posts.
