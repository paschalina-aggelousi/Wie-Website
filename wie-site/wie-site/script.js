/* ==========================================================================
   IEEE WIE – University of Macedonia
   Scripts

   1. Events tabs (Upcoming / Past)
   2. Join us form (opens an email)
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
   2. JOIN US FORM
   The site has no server, so the form does not send data anywhere.
   On submit it opens the visitor's email app with a pre-filled message
   addressed to the group, and shows a confirmation text.
   -------------------------------------------------------------------------- */

// Settings: change these to update the email that is opened
const CONTACT_EMAIL = 'wie@example.org';
const EMAIL_SUBJECT = 'Membership application';

const joinForm = document.getElementById('join-form');
const joinSuccessMessage = document.getElementById('join-success');

joinForm.addEventListener('submit', function (event) {
  event.preventDefault();   // stops the page from reloading

  // Body of the email, built from what the visitor typed
  const emailBody =
    'Full name: ' + joinForm.fullName.value + '\n' +
    'Email: ' + joinForm.email.value + '\n' +
    'Department/year: ' + joinForm.department.value;

  joinSuccessMessage.hidden = false;

  // Opens the email app
  location.href =
    'mailto:' + CONTACT_EMAIL +
    '?subject=' + encodeURIComponent(EMAIL_SUBJECT) +
    '&body=' + encodeURIComponent(emailBody);
});
