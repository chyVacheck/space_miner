// ! modules
// ? classes
import { Game } from './classes/Game.js';
import { StatusBarEnergy } from './classes/StatusBarEnergy.js';
import { Notification } from './classes/Notification.js';

// ? utils
import { GAME_SETTING } from './utils/constants.js';

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
  initialValue: GAME_SETTING.ENERGY.VALUE.INIT,
  maxValue: GAME_SETTING.ENERGY.VALUE.MAX,
});

// create game
const game = new Game({
  gameOver: gameOver,
  field: { x: GAME_SETTING.FIELD.X, y: GAME_SETTING.FIELD.Y },
  energy: {
    changeView: statusBarEnergy.changeView,
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
const gameOverObj = {
  time: document.getElementById('game-over-time'),
  score: document.getElementById('game-over-score'),
};

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

function startPlay() {
  startPlayButton.removeEventListener('click', startPlay);
  window.location.href = '#main-game';
  startPlayButton.style.display = 'none';
  game.start();
}

function gameOver(time, score) {
  startPlayButton.style.display = 'block';
  startPlayButton.addEventListener('click', startPlay);
  startPlayButton.querySelector('p').innerText = 'Try again';
  window.location.href = '#game-over';
  gameOverObj.time.innerText = time;
  gameOverObj.score.innerText = score;
}

//
//
// ? --- --- --- addEventListener --- --- ---
//
//

startPlayButton.addEventListener('click', startPlay);

window.addEventListener('hashchange', () => {
  const hash = window.location.hash;

  if (hash === '#main-game') {
    game.pause(false);
  } else {
    console.log('pause');
    game.pause(true);
  }
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
