# Localization

## Feature Overview

Customer-facing language selection and Store-authored translated copy. Platform chrome i18n is separate (DeliTip product strings). Spec §24.

**Roles:** Customer uses switcher; Owner/Manager edits translations  
**Prisma:** `Language` enum; `Store.primary_language`, `Store.supported_languages`; Json maps on `welcome_message`, `thank_you_message`, `ReviewCategory.name`, `FeedbackQuestion.question`  
**Dependencies:** Settings, Customer tip flow, Reviews config  
**Status:** **Missing**

---

## Hierarchy

```text
Localization
├── Customer language switcher                  [control on tip flow — missing]
├── Settings → Localization tab                 [missing]
│   ├── Primary language
│   ├── Supported languages
│   └── Translation editors for Store strings
└── Platform UI i18n                            [unclear — not Store-authored]
```

---

## UI surfaces

### Customer language switcher

**Location:** Customer tip flow chrome  
**Behavior:** Auto-detect; allow switch among `supported_languages`; fallback to `primary_language` (spec)  
**Disclose:** Possible machine translation (spec §29)

### Localization settings

**Fields:**  
- primary_language (`Language`)  
- supported_languages (`Language[]`)  
- Editors for welcome / thank-you per language  
- Review category & feedback question translations (or deep-link to those editors)  

**Actions:** Add language; Auto-translate (**unclear** API); Human edit; Save  
**Permission:** Owner, Store Manager  

---

## Language enum (schema — do not invent)

`EN`, `EL`, `ES`, `FR`, `DE`, `IT`, `PT`, `TR`, `RU`, `AR`, `ZH`

Labels → `config/constants/dropdowns/shared/` (or `stores/`) language options.

---

## Data shapes

Json message maps: `{ "EN": "…", "EL": "…" }` (inferred shape from “maps `{lang: text}`” in spec — confirm with API).

---

## User flows

```text
Enable Greek
  Settings → Localization → Add EL → Auto-translate welcome → Edit → Save
Customer in Greece
  → Tip flow detects EL → Shows Greek welcome → Can switch to EN
Missing key
  → Fallback to primary_language string
```

---

## Open questions

1. Who provides auto-translate?  
2. Are employee names/positions translated? (Spec only calls out Store-authored messages)  
3. RTL layout for `AR`?
