# SEO Schema Requirements (Yura)

Standing requirements for all JSON-LD structured data on moduledge.com. Apply these to any future schema edits.

---

## 1. No "defense" mentions

Replace with "government" where contextually appropriate, or remove entirely. Defense branding is reserved for a separate brand.

## 2. FAQ schema placement

| Page | Visual FAQ (Webflow) | JSON-LD FAQPage schema |
|------|----------------------|------------------------|
| Homepage | ✅ Keep | ✅ Keep |
| All other pages (except Blog) | ✅ Keep | ❌ Remove |
| Blog | ❌ Remove | ❌ Remove |

## 3. Technical specs — use these values everywhere

- Power density: **5–150 kW per rack** (not 5–50 kW)
- Tier: **Tier III/IV** (not Tier III alone)

## 4. Full company address in all schemas

Always include the complete PostalAddress block:

```json
"address": {
  "@type": "PostalAddress",
  "streetAddress": "Vodní 52/3",
  "postalCode": "767 01",
  "addressLocality": "Kroměříž",
  "addressCountry": "CZ"
}
```

Never shorten to just `"addressCountry": "CZ"`.

## 5. Absolute URLs only

No relative paths like `"url": "/"`. Always full URLs: `"url": "https://www.moduledge.com"`.

---

## Notes

- JSON-LD schemas are placed in Webflow Custom Code (per-page, before `</body>`). They are **not** auto-synced — always verify live vs local before editing.
- After pasting in Webflow, always **Publish** (not just Save).
- llms.txt is a static file served at `/llms.txt` — needs manual upload to Webflow to update.
