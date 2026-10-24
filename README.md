# IEEE WIE – University of Macedonia

Official website of the **IEEE Women in Engineering (WIE) Student Branch Affinity Group** at the University of Macedonia, Thessaloniki.

The site presents the group, its events and news, its subteams and members, and lets visitors apply to join. It is a static website built with plain HTML, CSS and JavaScript, with no frameworks, no build step and no dependencies to install.

---

## Table of contents

- [Features](#features)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Updating the content](#updating-the-content)
- [Design system](#design-system)
- [Accessibility and performance](#accessibility-and-performance)
- [Deployment](#deployment)
- [Browser support](#browser-support)
- [Brand guidelines](#brand-guidelines)
- [License](#license)

---

## Features

- **Responsive layout** for phones, tablets, laptops and large desktop screens (sizes scale smoothly on wide displays).
- **Hero section** with the group title, introduction and call-to-action buttons.
- **Events** with *Upcoming* / *Past* tabs, a horizontally scrolling card row and an "All events" grid view.
- **News** with cards, an "All news" grid view and a **"Read more" pop-up** that shows the full article.
- **About us**: what the group does, the subteams (alternating timeline), the benefits of joining, the vision, and the team (executive committee and members, with LinkedIn links).
- **Join us** form embedded from Google Forms.
- **FAQ** accordion built on native `<details>` elements.
- **Email menu** on the footer email icon: Gmail, the visitor's email app, or copy the address.
- **Scroll animations**: subtle reveal effects as the visitor scrolls, chosen automatically per element type.
- **Mobile navigation** with a collapsible menu.
- **Graceful fallbacks**: missing member photos are replaced by a frame with the person's name, and animations are disabled for visitors who prefer reduced motion.

## Project structure

```
.
├── index.html      # Page structure and all content
├── styles.css      # All styles (design tokens, layout, components, responsive rules)
├── script.js       # Interactivity (tabs, carousels, pop-up, menus, animations)
├── README.md
└── assets/
    ├── favicon.png                 # Browser tab icon
    ├── wie-logo.png                # WIE logo (light backgrounds)
    ├── wie-logo-white.png          # WIE logo (dark purple footer)
    ├── uom-logo.jpg                # University of Macedonia logo
    ├── ieee_logo.png               # IEEE logo
    ├── homepage_temp.png           # Hero illustration
    ├── icon-*.png                  # "What We Do" illustrations
    ├── pattern-hero.svg            # Background pattern (hero)
    ├── pattern-section.svg         # Background pattern (tinted sections)
    └── <Firstname_Lastname>.jpg    # Team member photos
```

### What each script section does

| Section in `script.js` | Purpose |
| --- | --- |
| Scroll animations | Reveals elements as they enter the viewport |
| "All ..." links | Switches a scrolling row to a full grid and back |
| "Read more" pop-up | Shows the full news article in a dialog |
| Email icon menu | Opens the Gmail / email app / copy menu |
| Events tabs | Switches between upcoming and past events |
| Mobile menu | Opens and closes the navigation on small screens |
| Scroll rows | Arrow buttons and keyboard control for the card rows |
| Avatar fallback | Replaces a broken member photo with a name frame |

## Getting started

No installation is needed.

**Option 1: open the file**

Open `index.html` in a browser.

**Option 2: run a local server** (recommended, closer to production)

```bash
# Python 3
python -m http.server 8000
```

Then visit `http://localhost:8000`.

Any static server works (for example the *Live Server* extension in VS Code).

> An internet connection is required while developing, because the fonts (Google Fonts) and the join form (Google Forms) are loaded from external services.

## Updating the content

All content lives in `index.html`. Each task below is a copy-and-edit of an existing block.

### Add a news article

In the `#news` section, copy an existing `<article class="card">` inside `.carousel-track` and change:

- `card-date`: the date
- `h3`: the title
- the first `<p>`: the short summary shown on the card (about 4 lines)
- the `<div class="card-full" hidden>`: the full article, shown in the pop-up (one `<p>` per paragraph)

Replace the `placeholder-img` block with a real image if you have one. Newest articles go first.

### Add an event

In the `#events` section, inside the `.carousel-track` of `events-upcoming` (or `events-past`):

1. Delete the `<p class="empty-message">` line.
2. Add an `<article class="card">` with a date, title, description and an optional link.

### Add or edit a team member

In the `.team` block, copy a `<div class="person">` and update the photo, the name, the role (only for the executive committee) and the LinkedIn link. Photos are stored in `assets/` and are displayed as a circle, so a square image works best.

### Change the contact email

In the footer, edit the address in:

```html
<a href="mailto:wie@uom.edu.gr" aria-label="Email">
```

The email menu reads the address from this link, so nothing else needs to change.

To remove an option from the email menu, delete its line in the `openMenu` function of `script.js`.

### Change the join form

Replace the `src` of the `<iframe>` inside `.google-form-container` with the new Google Forms link (use the *Embed HTML* option in Google Forms).

### Update the social links

The Instagram and LinkedIn links are in the footer, inside `.social-links`.

### Update the FAQ

Each question is a `<details>` block with a `<summary>` (question) and a `<p>` (answer).

### Update the favicon

Replace `assets/favicon.png` (a square PNG, at least 192×192 px, ideally with a transparent background).

## Design system

Colors are defined as CSS variables at the top of `styles.css`:

| Variable | Value | Use |
| --- | --- | --- |
| `--purple` | `#772583` | Primary color (headings, buttons, footer) |
| `--blue` | `#00629B` | Accent color (links, highlights) |
| `--lightpurple` | `#a441b3` | Secondary accent |
| `--tint` | `#F1E9F3` | Light purple section backgrounds |
| `--gray` | `#75787B` | Secondary text |
| `--ink` | `#2b2b2e` | Body text |
| `--line` | `#E3D6E6` | Borders and dividers |

**Fonts** (Google Fonts): Open Sans (body), Purple Purse (hero title and footer tagline).

**Responsive scaling:** on screens wider than 760 px, sizes are written as `calc(N * var(--u))`, where `--u` grows smoothly on large screens. This keeps text, images and spacing proportional on big monitors.

**Scroll animations:** the list of animated elements and their effect (`up`, `left`, `right`, `zoom`, `pop`) is in the `groups` array at the top of `script.js`. The motion itself is defined at the end of `styles.css`.

## Accessibility and performance

- Semantic HTML: landmarks (`header`, `nav`, `main`, `footer`), headings in order, and `details`/`summary` for the FAQ.
- ARIA attributes on tabs, the mobile menu, expandable links and icon-only buttons.
- Visible keyboard focus, keyboard control of the card rows (left and right arrow keys) and Esc to close menus and the pop-up.
- `prefers-reduced-motion` is respected: all animations are disabled.
- Images below the fold and the embedded form use `loading="lazy"`.
- No JavaScript framework and no build step, so the pages load quickly and are easy to maintain.

## Deployment

Because the site is fully static, it can be hosted on any static hosting service, for example **GitHub Pages**, **Netlify**, **Cloudflare Pages** or the university's own web space. Upload the project files (`index.html`, `styles.css`, `script.js` and the `assets/` folder) to the root of the hosting.

**Cache busting:** browsers cache CSS and JavaScript. After changing `styles.css` or `script.js`, increase the version number in `index.html` so that visitors get the new files:

```html
<link rel="stylesheet" href="styles.css?v=14">
<script src="script.js?v=14"></script>
```

## Browser support

The latest versions of Chrome, Edge, Firefox and Safari (desktop and mobile). The site uses modern CSS features (CSS variables, grid, `clip-path`, `:has()`) and the native `<dialog>` element. Where a feature is missing, the content remains readable.

## Brand guidelines

The IEEE, IEEE Women in Engineering and University of Macedonia logos are trademarks of their respective owners and are used here to identify the group. Follow the [IEEE brand guidelines](https://brand-experience.ieee.org/) when using or modifying them (for example, the WIE logo must be placed on a light background, or the white version used on dark ones).

IEEE Women in Engineering is a sub-brand of IEEE. More information: [wie.ieee.org](https://wie.ieee.org).

## Contact

IEEE WIE – University of Macedonia
Email: wie@uom.edu.gr
Instagram: [@wie.uom](https://www.instagram.com/wie.uom/)

## License

The license has not been decided yet. Until one is added, all rights are reserved by the IEEE WIE University of Macedonia Student Branch Affinity Group. Logos and brand assets remain the property of IEEE and the University of Macedonia.
