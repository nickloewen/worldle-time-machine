// ==UserScript==

// @name            Worldle - Time Machine - 3.1
// @author          n loewen
// @description     Play the Worldle puzzle for any day you like, past or future

// @match           https://*.worldle.teuteuf.fr/*
// @updateURL       https://raw.githubusercontent.com/nickloewen/worldle-time-machine/main/worldle-time-machine.js
// @version         2022-02-24.1

// ==/UserScript==

// CREATE AND INSERT UI

let UIContainer = Object.assign(document.createElement('div'), {id: 'time-machine'});
let UI = {
  prevBtn: Object.assign(document.createElement('button'), {innerText: '−'}),
  datePicker: Object.assign(document.createElement('input'), {id: 'date', type: 'date'}),
  nextBtn: Object.assign(document.createElement('button'), {innerText: '+'}),
  resetBtn: Object.assign(document.createElement('button'), {id: 'clear-btn', innerText: 'today'}),
  reloadBtn:  Object.assign(document.createElement('button'), {id: 'reload-btn', innerText: 'time travel !'})
}
Object.entries(UI).forEach( ([key, value]) => UIContainer.appendChild(value) );
document.body.prepend(UIContainer);


// STATE

let dateState = {
  set: function(d) {
    localStorage.setItem('selectedDate', dateToShortISOString(d));
    UI.datePicker.value = dateToShortISOString(d);
  },

  get: function() {
    let d = localStorage.getItem('selectedDate');
    // if no date is stored, use today's date -- TODO IFFY
    if (d === null) { return new Date(); }
    return shortISOStringToDate(d);
  },

  initialize: function() { dateState.set( dateState.get() ); },

  reset: function() { dateState.set(new Date()) },

  increment: function() { dateState.set(addToDate(dateState.get(), 1)) },

  decrement: function() { dateState.set(addToDate(dateState.get(), -1)) }
};


// INITIALIZE STATE
dateState.initialize();


// SETUP FAKE DATE
Date.now = function() { return dateState.get().getTime(); };


// CONNECT STATE TO UI

UI.datePicker.addEventListener('change', () => dateState.set(shortISOStringToDate(UI.datePicker.value)));
UI.prevBtn.addEventListener('click', dateState.decrement);
UI.nextBtn.addEventListener('click', dateState.increment);
UI.resetBtn.addEventListener('click', dateState.reset);
UI.reloadBtn.addEventListener('click', () => window.location.reload());


// PURE FUNCTIONS

function addToDate(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n) }

function dateToShortISOString(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function shortISOStringToDate(s) {
  let a = s.split('-')
  return new Date(Number(a[0]), (Number(a[1]) - 1), Number(a[2]));
}

// STYLE

let style = document.createElement('style');
document.body.prepend(style);
style.textContent = `
  #time-machine {
    background: #282828;
    color: #999;
    margin: 0;
    padding: 1.5em 0;
    text-align: center;
    font-size: .75rem;
  }

  #time-machine button {
    background: #666;
    color: #ddd;
    border: none;
    height: 2em;
    padding: 0 1.5em;
    font-weight: bold;
    border-radius: .5em;
    box-shadow: 0 .3em black;
    text-transform: uppercase;
    cursor: pointer;
    margin-left: .5em;
  }

  #time-machine button:active {
    background: #777;
    box-shadow: 0 .2em black;
    transform: translateY(.1em);
  }

  #time-machine input {
    height: 2em;
    border-radius: .5em;
    border: none;
    transform: translateY(.05em);
    box-shadow: inset 0 0.2em 0.1em #bbb;
    padding: 0 1em;
    margin-left: .5em;
    background: #eee;
    color: black;
  }

  #time-machine #clear-btn,
  #time-machine #reload-btn {
    margin-left: 2em;
  }

  #time-machine #reload-btn {
    background: #ddd;
    color: black;
  }
  #time-machine #reload-btn:active {
    background: #eee;
  }
`;
