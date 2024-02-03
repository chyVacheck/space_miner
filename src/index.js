// ! modules
// ? classes
import { Game } from './classes/Game.js';
import { StatusBarEnergy } from './classes/StatusBarEnergy.js';
import { Notification } from './classes/Notification.js';
import { Space } from './classes/Space.js';

// ? utils
import { GAME_SETTING } from './utils/constants.js';

const mainButton = {
  htmlElement: document.getElementById('main-button'),
  methods: {
    setText(text) {
      mainButton.htmlElement.querySelector('p').innerText = text;
    },
    changeView(bool) {
      mainButton.htmlElement.style.display = bool ? 'block' : 'none';
    },
  },
};

//
//
// ? --- --- --- init all classes --- --- ---
//
//

// solar system
const space = new Space({
  idElement: 'game-field',
  idSun: 'sun',
});

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
  mainButton: mainButton,
  space: space,
  energy: {
    setValue: statusBarEnergy.setValue,
    changeView: statusBarEnergy.changeView,
    decrease: statusBarEnergy.decreaseEnergy,
    increase: statusBarEnergy.increaseEnergy,
    render: statusBarEnergy.renderAll,
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
const gameOverObj = {
  time: document.getElementById('game-over-time'),
  score: document.getElementById('game-over-score'),
};

const audio = {
  htmlElement: document.getElementById('audio'),
  htmlButtons: {
    play: document.getElementById('audio-play-button'),
    pause: document.getElementById('audio-pause-button'),
  },
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
  mainButton.htmlElement.removeEventListener('click', startPlay);
  window.location.href = '#main-game';
  mainButton.methods.changeView(false);
  // space.closeView();
  game.start();
}

function gameOver(time, score) {
  mainButton.htmlElement.addEventListener('click', startPlay);
  gameOverObj.time.innerText = time;
  gameOverObj.score.innerText = score;
}

//
//
// ? --- --- --- addEventListener --- --- ---
//
//

mainButton.htmlElement.addEventListener('click', startPlay);

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

audio.htmlButtons.play.addEventListener('click', () =>
  audio.htmlElement.play(),
);
audio.htmlButtons.pause.addEventListener('click', () =>
  audio.htmlElement.pause(),
);

//
//
// ? --- --- --- start --- --- ---
//
//
space.initStars();
