// ==UserScript==

// @name            Worldle – Time Machine
// @author          n loewen
// @description     Play the Worldle puzzle for any day you like, past or future

// @match           https://*.worldle.teuteuf.fr/*
// @updateURL       TODO
// @version         2022-02-21.2

// ==/UserScript==


// Time machine UI
const DATE_PICKER = document.createElement('input');
DATE_PICKER.type = "date";

const RELOAD_BUTTON = document.createElement('button');
RELOAD_BUTTON.innerHTML = "go to puzzle";

const CLEAR_SELECTED_DATE_BUTTON = document.createElement('button');
CLEAR_SELECTED_DATE_BUTTON.innerHTML = "clear selection";

const CONTAINER = document.createElement('div');
CONTAINER.id = "time-machine";

CONTAINER.appendChild(DATE_PICKER);
CONTAINER.appendChild(RELOAD_BUTTON);
CONTAINER.appendChild(CLEAR_SELECTED_DATE_BUTTON);
document.body.prepend(CONTAINER);

const STYLE = document.createElement('style');
STYLE.textContent = `
  #time-machine {
    background: #111;
    color: white;
    margin: 0;
    padding: 1em;
  }

  #time-machine div {
     margin-left: auto;
      margin-right: auto;
      text-align: center;
  }

  #time-machine button {
    height: 2em;
    background: cadetblue;
    border: none;
    border-radius: .25em;
    padding: 0 1em;
      margin-left: .5em;
  }

  #time-machine button + button {
    background: rosybrown;
  }

  input {
    border-radius: .25em;
    border: none;
    height: 2em;
    padding: 0 1em;
    color: initial;
  }
  `;

document.body.prepend(STYLE);

// Event listeners
DATE_PICKER.addEventListener('change', () => handleDateSelection(DATE_PICKER.valueAsDate) ); 
RELOAD_BUTTON.addEventListener('click', () => window.location.reload());
CLEAR_SELECTED_DATE_BUTTON.addEventListener('click', clearSelectedDate);

// Set initial UI state
updateSelectedDateDisplay();
setFakeDate();


// FUNCTIONS

function handleDateSelection(d) {
  localStorage.setItem('selectedDate', d);
  updateSelectedDateDisplay();
}

// returns null OR a Date object
function getStoredDate() {
  let storedDate = localStorage.getItem('selectedDate');
  if (storedDate === null) {
    return null;
  }
  return new Date(Date.parse(storedDate));
}

function updateSelectedDateDisplay() {
  let d = getStoredDate()
  if (d !== null) {
    let isoDate = d.toISOString().substring(0,10);
    DATE_PICKER.value = isoDate;
  } else {
    DATE_PICKER.value = null;
  }
}

function clearSelectedDate() {
  localStorage.clear();
  updateSelectedDateDisplay();
}

function setFakeDate() {
  let fakeDate = getStoredDate();
  if (fakeDate !== null) {
      Date.now = function() { return fakeDate.getTime(); };
  }
}
