# SEO Schemas Changelog

## 2026-03-16 — Live sync verification + repo cleanup

### Changes:
- Fetched all 7 live schemas and compared against local files — **100% match**, no discrepancies.
- Deleted `seo-schemas-from-19fb-old/` folder (no longer needed).
- Created `REQUIREMENTS.md` — standing rules from Yura for all future schema work.

---

## 2026-03-16 — Defense removal + FAQ schema cleanup

### Changes:
- `Home.json` — `"defense"` → `"government"` in FAQ answer. Full address restored (streetAddress, postalCode, addressLocality).
- `Customization.json` — removed `"defense,"` from service description. *(Local file ready — needs paste into Webflow Custom Code)*
- `Contact Us.json` — `"defense"` → `"government"` in FAQ answer. **Removed entire FAQPage block** (FAQ schema only stays on Homepage per SEO instruction). Fixed relative `url: "/"` → absolute URL.
- `About.json`, `Blog.json`, `Case Studies.json`, `Partner Program.json` — refreshed from live site (no structural changes).
- `Blog Article.json`, `Case Studies Template Page.json` — removed from repo (old pre-fix versions moved to `seo-schemas-from-19fb-old/`). Webflow templates on live site already have February fixes applied.

### Status of February feedback items (verified against live site 2026-03-16):
- ✅ #1 Case Studies Template — `about` block is now dynamic, `InStock` removed (fixed in Webflow directly)
- ✅ #2 Blog Article — `keywords` field removed (fixed in Webflow directly)
- ✅ #3 Customization — temperature `-35°C to +52°C` correct
- ✅ #4 About — `foundingDate: "2023"`, `numberOfEmployees: 120`
- ✅ #5 Relative URLs — all absolute on live site
- ✅ #6 Blog Article — `articleBody` field removed (fixed in Webflow directly)
- ✅ #7 About — `numberOfEmployees` present

### Applied to Webflow (verified live 2026-03-16):
- ✅ `Customization.json` — defense fix pasted and published
- ✅ `Contact Us.json` — defense fix + FAQ removed, pasted and published

---

## 2026-02-17 - Technical Specifications Update (Yuri's requirements)

### Changes Made:
**Updated technical specifications across all schema files:**
- Power capacity: `5–50 kW` → `5–150 kW per rack`
- Tier certification: `Tier III` → `Tier III/IV`

### Files Updated:
- ✅ `home.json` - 4 replacements
- ✅ `Customization.json` - 4 replacements
- ✅ `Contact Us.json` - 2 replacements
- ✅ `Partner Program.json` - 2 replacements
- ✅ `Blog.json` - 5 replacements
- ✅ `Case Studies.json` - 5 replacements

### Validation:
All JSON files passed validation ✓

---

## 2026-02-17 - Organization Schema Enhancement (Igor's SEO requirements)

### Changes Made:
**Added complete organization contact details to all schemas:**
- Logo: https://cdn.prod.website-files.com/.../ModulEdge%20Logo.png
- Email: info@moduledge.com
- Phone: +351937358084
- Full address: Vodní 52/3, 767 01 Kroměříž, CZ
- Social: LinkedIn

**Structural changes:**
- `Customization.json` - Changed primary entity from WebPage to Service (as primary entity)
- `Contact Us.json` - Enhanced Organization markup with logo and full contact details
- `Blog Article.json` & `Case Studies Template Page.json` - Updated publisher schema (CMS templates)

### Files Updated:
- ✅ `home.json`
- ✅ `Customization.json` (structure changed)
- ✅ `Contact Us.json`
- ✅ `About.json`
- ✅ `Partner Program.json`
- ✅ `Blog.json`
- ✅ `Case Studies.json`
- ✅ `Blog Article.json` (CMS template)
- ✅ `Case Studies Template Page.json` (CMS template)
