// ! modules
// ? classes
import { Game } from './classes/Game.js';
import { StatusBarEnergy } from './classes/StatusBarEnergy.js';
import { Notification } from './classes/Notification.js';

//
//
// ? --- --- --- init all classes --- --- ---
//
//

// notification
const notification = new Notification({
  idIcon: 'header-logo',
  idElement: 'header-notification-text',
  classList: {
    rotate: {
      name: 'logo_animation_rotate',
    },
    jump: {
      name: 'logo_animation_jump',
    },
  },
});

// create status energy bar
const statusBarEnergy = new StatusBarEnergy({
  id: 'footer-energy-status-bar',
  idBar: 'footer-energy-status-bar-bar',
  selectorsEnergy: '.status-bar__energy',
  classActive: 'status-bar_visible_active',
  classListEnergy: {
    empty: 'status-bar__energy_charge_empty',
    half: 'status-bar__energy_charge_half',
    full: 'status-bar__energy_charge_full',
  },
  initialValue: 20,
  maxValue: 20,
});

// create game
const game = new Game({
  field: { x: 126, y: 96 },
  energy: {
    decreaseEnergy: statusBarEnergy.decreaseEnergy,
    increaseEnergy: statusBarEnergy.increaseEnergy,
    renderEnergy: statusBarEnergy.renderAll,
  },
  notification: {
    html: {
      icon: notification.htmlIcon,
    },
    showNotification: notification.showNotification,
    enabledAnimation: notification.enabledAnimation,
    disabledAnimation: notification.disabledAnimation,
    closeNotification: notification.closeNotification,
    setTextNotification: notification.setTextNotification,
  },
});

//
//
// ? --- --- --- find html elements --- --- ---
//
//

const keyButtons = document.getElementsByName('how-to-play-key-button');
const startPlayButton = document.getElementById('button-start-play');

//
//
// ? --- --- --- function --- --- ---
//
//

function addWaveByClickOrPress(element, functionToDoInEnd = () => {}) {
  var waveAnimation = document.createElement('div');
  waveAnimation.classList.add('wave');

  element.appendChild(waveAnimation);

  waveAnimation.addEventListener('animationend', function () {
    element.removeChild(waveAnimation);
    functionToDoInEnd();
  });
}

function changeViewOfElement(element, activeHash, active = 'block') {
  const _currentHash = window.location.hash;

  if (_currentHash === activeHash) {
    element.style.display = active;
  } else {
    element.style.display = 'none';
  }
}

function startPlay() {
  window.location.href = '#game';
  game.start();
}

//
//
// ? --- --- --- addEventListener --- --- ---
//
//

startPlayButton.addEventListener('click', startPlay);

window.addEventListener('hashchange', () => {
  changeViewOfElement(startPlayButton, '#how-to-play');
  changeViewOfElement(statusBarEnergy.htmlElement, '#game', 'flex');
});

keyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    addWaveByClickOrPress(button);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key.toLocaleLowerCase() === button.getAttribute('data-key')) {
      button.classList.add('key-button_state_pressed');
      addWaveByClickOrPress(button, () => {
        button.classList.remove('key-button_state_pressed');
      });
    }
  });
});

//
//
// ? --- --- --- start --- --- ---
//
//
