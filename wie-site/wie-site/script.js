/* ==========================================================================
   IEEE WIE – University of Macedonia
   Scripts

   1. Events tabs (Upcoming / Past)
   ========================================================================== */


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