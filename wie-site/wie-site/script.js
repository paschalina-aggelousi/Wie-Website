/* ==========================================================================
   IEEE WIE – University of Macedonia
   Scripts

   1. Events tabs (Upcoming / Past)
   ========================================================================== */

/* --------------------------------------------------------------------------
   SCROLL ANIMATIONS
   Elements fade / slide in when they come into view while the visitor scrolls.
   The list below says which elements move and how:
     up    = rises a little      left / right = slides in from the side
     zoom  = rises and grows     pop = small bounce (icons)
   Elements of the same row (e.g. the cards) appear one after the other.
   Nothing here needs changes in index.html. If JavaScript fails or the visitor
   prefers reduced motion, everything is simply shown.
   -------------------------------------------------------------------------- */

(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const groups = [
    ['section h2', 'up'],
    ['.tabs', 'up'],
    ['.carousel-track > .card', 'up'],
    ['.empty-message', 'up'],
    ['.about-heading', 'up'],
    ['.about-heading-icon svg', 'pop'],
    ['.about-intro', 'up'],
    ['.feature', 'up'],
    ['.tl-item:nth-child(odd)', 'left'],
    ['.tl-item:nth-child(even)', 'right'],
    ['.tl-icon', 'pop'],
    ['.why-panel', 'up'],
    ['.perk', 'up'],
    ['.vision', 'left'],
    ['.team-title', 'up'],
    ['.team-subtitle', 'up'],
    ['.person', 'zoom'],
    ['.join-grid > div:first-child', 'left'],
    ['.google-form-container', 'right'],
    ['details', 'up'],
    ['.footer-inner > *', 'up']
  ];

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible');
      observer.unobserve(el);

      // When the animation is over, remove the helper classes so that the
      // element goes back to being completely normal (hover effects etc.)
      setTimeout(function () {
        el.classList.remove('reveal', 'is-visible');
        el.removeAttribute('data-reveal');
        el.style.removeProperty('--reveal-delay');
      }, 1600);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  document.documentElement.classList.add('has-reveal');

  groups.forEach(function (group) {
    const counts = new Map();   // how many elements of this group came before, per parent
    document.querySelectorAll(group[0]).forEach(function (el) {
      if (el.classList.contains('reveal')) return;
      const index = counts.get(el.parentElement) || 0;
      counts.set(el.parentElement, index + 1);

      el.classList.add('reveal');
      el.dataset.reveal = group[1];
      el.style.setProperty('--reveal-delay', Math.min(index, 5) * 90 + 'ms');
      observer.observe(el);
    });
  });
})();

/* --------------------------------------------------------------------------
   0. "ALL ..." LINKS (All events, All news)
   A link with data-expand="<id of a scroll row>" switches that row between
   the scrolling row and a grid that shows every item at once (the
   .is-expanded class, see styles.css). It is at the top of the file so that
   it works on its own.
   -------------------------------------------------------------------------- */

document.querySelectorAll('.expand-link').forEach(function (link) {
  const row = document.getElementById(link.dataset.expand);
  if (!row) return;
  const label = link.textContent;

  link.addEventListener('click', function (event) {
    event.preventDefault();
    const isExpanded = row.classList.toggle('is-expanded');
    link.setAttribute('aria-expanded', isExpanded);
    link.textContent = isExpanded ? 'Show less' : label;
  });
});


/* --------------------------------------------------------------------------
   0b. "READ MORE" POP-UP (News)
   Clicking "Read more" on a news card shows the whole article in a pop-up.
   The pop-up shows the text inside the card's hidden .card-full block; if the
   card has none, it shows all the paragraphs of the card. The pop-up is
   created here, so nothing extra is needed in index.html.
   Esc, the X button or a click outside the pop-up closes it.
   -------------------------------------------------------------------------- */

(function () {
  const dialog = document.createElement('dialog');
  dialog.className = 'article-dialog';
  dialog.setAttribute('aria-labelledby', 'article-dialog-title');
  dialog.innerHTML =
    '<button class="article-close" type="button" aria-label="Close">&times;</button>' +
    '<span class="card-date" id="article-dialog-date"></span>' +
    '<h3 id="article-dialog-title"></h3>' +
    '<div class="article-body" id="article-dialog-body"></div>';
  document.body.appendChild(dialog);

  dialog.querySelector('.article-close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();   // click on the dark background
  });

  // One listener for every "Read more" link of the News section
  document.addEventListener('click', function (event) {
    const link = event.target.closest('#news .card-link');
    if (!link) return;
    const card = link.closest('.card');
    event.preventDefault();

    const full = card.querySelector('.card-full');
    const dateEl = card.querySelector('.card-date');
    document.getElementById('article-dialog-title').textContent = card.querySelector('h3').textContent;
    document.getElementById('article-dialog-date').textContent = dateEl ? dateEl.textContent : '';
    document.getElementById('article-dialog-body').innerHTML = full
      ? full.innerHTML
      : Array.from(card.querySelectorAll(':scope > p')).map(function (p) {
          return '<p>' + p.innerHTML + '</p>';
        }).join('');

    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    dialog.scrollTop = 0;
  });
})();


/* --------------------------------------------------------------------------
   0c. EMAIL ICON MENU
   A plain mailto: link does nothing for visitors without an email program.
   Clicking the email icon (any link starting with mailto:) opens a small menu:
   Gmail, Outlook, the visitor's email program, or copy the address. The address
   is taken from the link's href, so it is never written out as text on the page.
   -------------------------------------------------------------------------- */

(function () {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  if (!emailLinks.length) return;

  const menu = document.createElement('div');
  menu.className = 'email-menu';
  menu.hidden = true;
  document.body.appendChild(menu);

  function closeMenu() { menu.hidden = true; }

  function copyText(text, button) {
    function done() {
      button.textContent = 'Copied!';
      setTimeout(closeMenu, 900);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else {
      fallback();
    }
    function fallback() {
      const box = document.createElement('textarea');
      box.value = text;
      box.style.position = 'fixed';
      box.style.opacity = '0';
      document.body.appendChild(box);
      box.select();
      try { document.execCommand('copy'); done(); } catch (e) { button.textContent = 'Could not copy'; }
      box.remove();
    }
  }

  function openMenu(link) {
    const address = link.getAttribute('href').replace('mailto:', '').split('?')[0];
    const to = encodeURIComponent(address);

    menu.innerHTML =
      '<a href="https://mail.google.com/mail/?view=cm&fs=1&to=' + to + '" target="_blank" rel="noopener">Open in Gmail</a>' +
      '<a href="mailto:' + address + '">Open email app</a>' +
      '<button type="button">Copy email address</button>';
    menu.querySelector('button').addEventListener('click', function (event) {
      copyText(address, event.currentTarget);
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });

    // Show it above the icon, kept inside the screen
    menu.hidden = false;
    const rect = link.getBoundingClientRect();
    const left = Math.min(Math.max(8, rect.left + window.scrollX + rect.width / 2 - menu.offsetWidth / 2),
                          document.documentElement.clientWidth - menu.offsetWidth - 8);
    menu.style.left = left + 'px';
    menu.style.top = (rect.top + window.scrollY - menu.offsetHeight - 10) + 'px';
  }

  emailLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      if (menu.hidden) openMenu(link); else closeMenu();
    });
  });

  document.addEventListener('click', function (event) {
    if (!menu.hidden && !menu.contains(event.target) && !event.target.closest('a[href^="mailto:"]')) closeMenu();
  });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', closeMenu);
})();


/* --------------------------------------------------------------------------
   1. EVENTS TABS
   Each tab button has a data-tab attribute with the id of the list it shows
   (see the Events section in index.html). Clicking a tab marks it as
   selected and shows only its list.
   -------------------------------------------------------------------------- */

const tabButtons = document.querySelectorAll('.tabs button');
const upcomingList = document.getElementById('events-upcoming');
const pastList = document.getElementById('events-past');

tabButtons.forEach(function (clickedButton) {
  clickedButton.addEventListener('click', function () {

    // Only the clicked tab is marked as selected (this also styles it, see styles.css)
    tabButtons.forEach(function (button) {
      button.setAttribute('aria-selected', button === clickedButton);
    });

    // Show the list of the clicked tab and hide the other one
    upcomingList.hidden = clickedButton.dataset.tab !== 'events-upcoming';
    pastList.hidden = clickedButton.dataset.tab !== 'events-past';
  });
});

/* --------------------------------------------------------------------------
   2. MOBILE MENU
   On mobile the links are hidden. The three-line button adds or removes the
   "is-open" class on the menu (see styles.css) and updates aria-expanded,
   which also turns the three lines into an X.
   -------------------------------------------------------------------------- */

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');

function setMenuOpen(isOpen) {
  navMenu.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

navToggle.addEventListener('click', function () {
  setMenuOpen(!navMenu.classList.contains('is-open'));
});

// Close the menu after the visitor picks a link
navMenu.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    setMenuOpen(false);
  });
});


/* --------------------------------------------------------------------------
   3. SCROLL ROWS (Events, News)
   Each .carousel has a sideways-scrolling .carousel-track and two arrow
   buttons. The arrows scroll the row by almost one screen-width and are
   disabled (hidden) when there is nothing more to show in that direction.
   -------------------------------------------------------------------------- */

document.querySelectorAll('.carousel').forEach(function (carousel) {
  const track = carousel.querySelector('.carousel-track');
  const prevButton = carousel.querySelector('.carousel-prev');
  const nextButton = carousel.querySelector('.carousel-next');

  function updateArrows() {
    const maxScroll = track.scrollWidth - track.clientWidth;

    // Arrows are shown only when there is something to scroll
    carousel.classList.toggle('is-scrollable', maxScroll > 1);

    // "All ..." link: only useful when some items are out of view (or to collapse again)
    const expandLink = document.querySelector('.expand-link[data-expand="' + carousel.id + '"]');
    if (expandLink) {
      expandLink.parentElement.hidden = !(maxScroll > 1 || carousel.classList.contains('is-expanded'));
    }
    prevButton.disabled = track.scrollLeft <= 1;
    nextButton.disabled = track.scrollLeft >= maxScroll - 1;
  }

  function scrollByPage(direction) {
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: 'smooth' });
  }

  prevButton.addEventListener('click', function () { scrollByPage(-1); });
  nextButton.addEventListener('click', function () { scrollByPage(1); });
  track.addEventListener('scroll', updateArrows, { passive: true });

  // Keyboard: left / right arrow keys scroll the focused row
  track.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') { scrollByPage(1); event.preventDefault(); }
    if (event.key === 'ArrowLeft') { scrollByPage(-1); event.preventDefault(); }
  });

  // Re-check when the size changes (window resize, or the Past tab being shown)
  if ('ResizeObserver' in window) {
    new ResizeObserver(updateArrows).observe(track);
  } else {
    window.addEventListener('resize', updateArrows);
  }
  updateArrows();
});

(function () {
  function showAlt(img) {
    if (img.dataset.altShown) return;
    img.dataset.altShown = "1";
    var box = document.createElement("div");
    box.className = "avatar avatar-fallback";
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", img.alt);
    var text = document.createElement("span");
    text.textContent = img.alt;
    box.appendChild(text);
    img.replaceWith(box);
  }
  document.querySelectorAll("img.avatar").forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) showAlt(img);
    else img.addEventListener("error", function () { showAlt(img); });
  });
})();

/* --------------------------------------------------------------------------
   4. SUBTEAMS MIND MAP
   Clicking the name of a subteam opens or closes its description.
   The "is-collapsible" class makes the descriptions start closed (without
   JavaScript they all stay visible). Each box opens on its own.
   -------------------------------------------------------------------------- */

(function () {
  const map = document.getElementById('subteams-map');
  if (!map) return;

  map.classList.add('is-collapsible');

  map.querySelectorAll('.sm-toggle').forEach(function (button) {
    button.addEventListener('click', function () {
      const node = button.closest('.sm-node');
      const isOpen = node.classList.toggle('is-open');
      button.setAttribute('aria-expanded', isOpen);
    });
  });
})();