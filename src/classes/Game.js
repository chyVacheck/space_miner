// ! module
import { Asteroid } from './Asteroid.js';
import { SpaceShip } from './SpaceShip.js';

// ? utils
import {
  getRandomNumberByTickTime,
  getRandomNumber,
  formatMilliseconds,
} from '../utils/utils.js';
import { GAME_SETTING } from '../utils/constants.js';

//
//
export class Game {
  // ! --- --- --- constructor --- --- ---÷
  constructor({
    gameOver,
    mainButton,
    fieldId = 'game-field',
    energy,
    notification,
    typeOfSpaceShip = 'MINER',
  }) {
    this.typeOfSpaceShip = typeOfSpaceShip;
    this.functionWhenGameOver = gameOver;
    this.mainButton = mainButton;
    this.isPause = false;
    this.isGameOver = false;
    this.isGameStart = false;
    this.score = 0;
    this.time = 1;
    this.tick = 10;
    this.globalInterval;
    this.energy = {
      lastTick: 0,
      isCharged: true,
      recovery: GAME_SETTING.ENERGY.VALUE.RECOVERY,
      max: GAME_SETTING.ENERGY.VALUE.MAX,
      current: GAME_SETTING.ENERGY.VALUE.INIT,
      min: GAME_SETTING.ENERGY.VALUE.MIN,
    };
    this.spaceShip;
    this.moveForSpaceShip = { lastTick: 0 };
    this.spaceShipSize = GAME_SETTING.SPACE_SHIP[typeOfSpaceShip].SIZE;
    this.allowedKeys = [
      ' ', // space
      'q',
      'e',
      'arrowup',
      'w',
      'arrowleft',
      'a',
      'arrowdown',
      's',
      'arrowright',
      'd',
    ];
    this.field = {
      x: GAME_SETTING.FIELD.X,
      y: GAME_SETTING.FIELD.Y,
    };
    this.coordinates = {
      x: GAME_SETTING.SPACE_SHIP.COORDINATES.X,
      y: GAME_SETTING.SPACE_SHIP.COORDINATES.Y,
    };
    this.speed = {
      min: GAME_SETTING.SPACE_SHIP[typeOfSpaceShip].SPEED.MIN,
      current: GAME_SETTING.SPACE_SHIP[typeOfSpaceShip].SPEED.INIT,
      max: GAME_SETTING.SPACE_SHIP[typeOfSpaceShip].SPEED.MAX,
    };
    this.vector = {
      x: 0,
      y: 0,
    };
    this.isSpaceShipMoving = false;
    this.statusBars = {
      energy: energy,
    };

    this.htmlField = document.getElementById(fieldId);

    // ? --- --- --- notification --- --- ---
    this.notification = {
      isShowing: false,
      canBeClosed: false,
      html: {
        icon: notification.html.icon,
      },
      show: notification.showNotification,
      close: notification.closeNotification,
      setText: notification.setTextNotification,
      animation: {
        enabled: notification.enabledAnimation,
        disabled: notification.disabledAnimation,
      },
    };

    // ? --- --- --- asteroids --- --- ---
    // create
    this.asteroids = [];

    // ? --- --- --- methods --- --- ---
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.render = this.renderAll.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this._initAll = this._initAll.bind(this);
    this.manageSpeed = this.manageSpeed.bind(this);
    this.manageEnergy = this.manageEnergy.bind(this);
    this.moveSpaceShip = this.moveSpaceShip.bind(this);
    this.increaseEnergy = this.increaseEnergy.bind(this);
    this.decreaseEnergy = this.decreaseEnergy.bind(this);
    this.createAsteroid = this.createAsteroid.bind(this);
    this.createSpaceShip = this.createSpaceShip.bind(this);
    this.manageCollision = this.manageCollision.bind(this);
    this.handlerKeyPress = this.handlerKeyPress.bind(this);
    this.handlerClickPilot = this.handlerClickPilot.bind(this);
    this._closeNotification = this.closeNotification.bind(this);
    this.startGlobalInterval = this.startGlobalInterval.bind(this);
  }

  // ! --- --- --- private function --- --- ---

  //
  _sayHello() {
    this.notification.animation.enabled('rotate');
    this.notification.show();
    setTimeout(() => {
      this.notification.setText("Hello I'm pilot\nLet's go !", 50);
    }, 700);

    setTimeout(() => {
      this.notification.close();
    }, 3_500);
  }

  _initAll() {
    this.score = 0;
    this.time = 1;
    this.isGameOver = false;
    this.isPause = false;
    this.isGameStart = true;
    this.vector = {
      x: 0,
      y: 0,
    };
    this.coordinates = {
      x: GAME_SETTING.SPACE_SHIP.COORDINATES.X,
      y: GAME_SETTING.SPACE_SHIP.COORDINATES.Y,
    };
    this.energy.current = GAME_SETTING.ENERGY.VALUE.MAX;
    this.statusBars.energy.setValue(this.energy.current);
    this.statusBars.energy.changeView(true);
    this.speed.current =
      GAME_SETTING.SPACE_SHIP[this.spaceShip.type].SPEED.INIT;
    this.notification.html.icon.addEventListener(
      'click',
      this.handlerClickPilot,
    );
  }

  // ! --- --- --- main function --- --- ---
  start() {
    document.addEventListener('keyup', this.handlerKeyPress);

    this._sayHello();

    this.createSpaceShip();

    this._initAll();

    setTimeout(this.startGlobalInterval, 2_000);
  }

  startGlobalInterval() {
    this.globalInterval = setInterval(() => {
      // if pause enable, just skip this tick
      if (this.isPause) return;

      this.isSpaceShipMoving = false;

      if (
        this.asteroids.length < 15 + Math.round(this.time / 500) &&
        this.time % 20 === 0
      )
        this.createAsteroid();

      this.moveAsteroids();

      // do I really need this comment here ? :)
      this.moveSpaceShip();

      // for correct work function render (for visibility)
      this.spaceShip.setCoordinate({
        x: this.coordinates.x,
        y: this.coordinates.y,
      });

      // for correct work function change vector view
      this.spaceShip.setVector({
        x: this.vector.x,
        y: this.vector.y,
      });

      this.manageAll();

      // ? render
      if (!this.isGameOver) {
        this.renderAll();
        this.time++;
      }
    }, this.tick);
  }

  _check() {
    console.log(208, 'function check');
  }

  // just stop game for some time
  pause(bool = !this.isPause) {
    if (!this.isGameStart) return;

    this.statusBars.energy.changeView(!bool);
    this.mainButton.methods.setText('Return');
    this.mainButton.methods.changeView(bool);
    if (!bool) {
      setTimeout(() => {
        this.isPause = bool;
        this.asteroids.forEach((ast) => {
          ast.htmlElement.classList.toggle('asteroid_animation-state_stop');
        });
      }, 500);
      this.mainButton.htmlElement.removeEventListener('click', () => {
        this.pause();
      });
      window.location.href = '#main-game';
    } else {
      this.mainButton.htmlElement.addEventListener('click', () => {
        this.pause();
      });
      this.isPause = bool;
      this.asteroids.forEach((ast) => {
        ast.htmlElement.classList.toggle('asteroid_animation-state_stop');
      });
    }
  }

  clearAll() {
    this.spaceShip = this.spaceShip.remove();
    this.asteroids.map((ast) => {
      ast.remove();
    });
    this.asteroids = [];
    this.statusBars.energy.changeView();
  }

  // if u lose
  gameOver() {
    clearInterval(this.globalInterval);
    this.isGameOver = true;
    this.isPause = false;
    this.functionWhenGameOver(
      formatMilliseconds(this.time * this.tick),
      this.score,
    );
    window.location.href = '#game-over';
    this.mainButton.methods.changeView(true);
    this.mainButton.methods.setText('Try again');
    document.removeEventListener('keyup', this.handlerKeyPress);
    this.clearAll();
  }

  // ! --- --- --- function --- --- ---
  // ? render method
  renderAll() {
    this.statusBars.energy.render(); // energy status bar
    this.spaceShip.render(); // spaceShip (user)
    this.asteroids.forEach((ast) => ast.render());
  }

  // ? manage method
  manageAll() {
    // manager speed
    this.manageSpeed();

    // manage energy
    this.manageEnergy();

    // manage notification
    this.manageNotification();

    // manage
    this.manageCollision();
  }

  // --- --- --- handlers --- --- ---

  // key pressed
  handlerKeyPress(event) {
    const button = event.key.toLowerCase();

    // ? pause
    if (button === ' ') this.pause();

    // if not allowed just do nothing
    if (!this.allowedKeys.includes(button) || this.isPause) return;

    switch (button) {
      // ? change vector
      // key down
      case 's':
      case 'arrowdown':
        // change vector
        if (this.vector.y < 1) {
          this.vector.y += 1;
          this.vector.x = 0;
        }
        break;

      // key up
      case 'w':
      case 'arrowup':
        // change vector
        if (this.vector.y > -1) {
          this.vector.y += -1;
          this.vector.x = 0;
        }
        break;

      // key left
      case 'a':
      case 'arrowleft':
        // change vector
        if (this.vector.x > -1) {
          this.vector.x += -1;
          this.vector.y = 0;
        }
        break;

      // key right
      case 'd':
      case 'arrowright':
        // change vector
        if (this.vector.x < 1) {
          this.vector.x += 1;
          this.vector.y = 0;
        }
        break;

      // ? change speed
      // increase speed
      case 'e':
        if (this.speed.current < this.speed.max) {
          this.speed.current += 1;
        }
        break;

      // decrease speed
      case 'q':
        if (this.speed.current > this.speed.min) {
          this.speed.current -= 1;
        }
        break;

      default:
        break;
    }

    console.log(
      `speed: ${this.speed.current}\nvector: x:${this.vector.x} y:${this.vector.y}\nenergy: ${this.energy.current}`,
    );
  }

  // show in notification all stats
  handlerClickPilot() {
    this.notification.canBeClosed = false;
    this.notification.isShowing = true;

    // todo make a random phrases
    if (this.isGameOver) {
      this.notification.setText(`It was good, let's try one more time`, 45);
    } else if (this.isPause) {
      this.notification.setText(
        `When you will be ready, press space to return game`,
        45,
      );
    } else {
      this.notification.setText(`I am okay, thanks`, 25);
    }

    this.notification.show();
    setTimeout(() => {
      this.notification.canBeClosed = true;
    }, 1_500);
  }

  // ? --- --- --- notifications --- --- ---

  // close notification
  closeNotification() {
    this.notification.canBeClosed = false;
    this.notification.isShowing = false;
    this.notification.close();
  }

  // alert to user
  alert(text, speed) {
    this.notification.isShowing = true;
    this.notification.setText(text, speed);
    this.notification.show();
    setTimeout(() => {
      this.notification.canBeClosed = true;
    }, 3_000);
  }

  // ? --- --- --- managers --- --- ---

  // manage to speed
  manageSpeed() {}

  // manage energy
  manageEnergy() {
    //  increase energy
    if (
      Math.round(this.time / (1000 / this.tick / this.energy.recovery)) >
      Math.round(
        this.energy.lastTick / (1000 / this.tick / this.energy.recovery),
      )
    ) {
      this.energy.lastTick = this.time;
      this.increaseEnergy();
    }

    // max
    if (this.energy.current === this.energy.max) {
      // todo more then 30%
      this.energy.isCharged = true;
    } else {
      // min
      if (this.energy.current === this.energy.min) {
        this.speed.current = Math.round(
          GAME_SETTING.SPACE_SHIP[this.spaceShip.type].SPEED.MAX / 2 - 1,
        );

        // manage to set speed 1 because of low energy
        if (!this.notification.isShowing && this.energy.isCharged) {
          this.speed.current = Math.round(
            GAME_SETTING.SPACE_SHIP[this.spaceShip.type].SPEED.MAX / 2 - 1,
          );
          this.alert(`Low energy\nNow speed is ${this.speed.current}`, 50);
          this.energy.isCharged = false;
        }
      }
    }
  }

  // manage notification
  manageNotification() {
    if (this.notification.canBeClosed && this.notification.isShowing) {
      this.closeNotification();
    }
  }

  // manage collision
  manageCollision() {
    const { x, y } = this.spaceShip.coordinates;

    // collision for space ship
    for (let i = 0; i < this.asteroids.length; i++) {
      const ast = this.asteroids[i];
      if (
        // top Y(top) collision
        ((ast.coordinates.y <= y && y <= ast.coordinates.y + ast.size - 1) ||
          // top Y(bottom) collision
          (ast.coordinates.y <= y + this.spaceShip.size - 1 &&
            y + this.spaceShip.size - 1 <= ast.coordinates.y + ast.size - 1)) &&
        // top X(left) collision
        ((ast.coordinates.x <= x && x <= ast.coordinates.x + ast.size - 1) ||
          // top X(right) collision
          (ast.coordinates.x <= x + this.spaceShip.size - 1 &&
            x + this.spaceShip.size - 1 <= ast.coordinates.x + ast.size - 1))
      ) {
        this.gameOver();
        break;
      }
    }

    // todo collision for asteroids between other asteroids
  }

  // ? --- --- --- space ship --- --- ---

  // create a new one Space ship
  createSpaceShip() {
    this.spaceShip = new SpaceShip({
      type: this.typeOfSpaceShip,
      idElement: 'space-ship',
      idEngine: 'space-ship-engine',
      field: this.field,
      shipSize: this.spaceShipSize,
      speed: this.speed,
      // coordinates: this.coordinates,
      coordinates: { x: 65, y: 70 },
    });

    this.htmlField.appendChild(this.spaceShip.htmlElement);
  }

  // * here are no render
  moveSpaceShip() {
    // calculate time
    const { x, y } = this.vector;

    if (
      Math.round(this.time / (1000 / this.tick / this.speed.current)) >
      Math.round(
        this.moveForSpaceShip.lastTick /
          (1000 / this.tick / this.speed.current),
      )
    ) {
      this.moveForSpaceShip.lastTick = this.time;

      // is moving ?
      if (Math.abs(x) + Math.abs(y) * this.speed.current > 0) {
        // ? X
        if (
          this.coordinates.x + 1 * x + (this.spaceShipSize - 1) <=
            this.field.x &&
          this.coordinates.x + 1 * x > 0 &&
          Math.abs(x) > 0
        ) {
          this.coordinates.x += 1 * x;
          // remember that moving
          this.isSpaceShipMoving = true;
        }

        // ? Y
        if (
          this.coordinates.y + 1 * y + (this.spaceShipSize - 1) <=
            this.field.y &&
          this.coordinates.y + 1 * y > 0 &&
          Math.abs(y) > 0
        ) {
          this.coordinates.y += 1 * y;
          // remember that moving
          this.isSpaceShipMoving = true;
        }

        // spend energy
        if (this.isSpaceShipMoving) this.decreaseEnergy();
      }
    }
  }

  // ? --- --- --- asteroids --- --- ---

  // create a new one asteroid
  createAsteroid() {
    const size = Math.round(
      getRandomNumberByTickTime(this.time * this.tick, 1.5),
    );
    const coordinates = {
      x: null,
      y: 1,
    };

    // check coordinates
    while (!coordinates.x) {
      // console.log('try generate asteroid x');
      let uniq = true;
      let _x = getRandomNumber(2, this.field.x - size + 1);
      this.asteroids.forEach((asteroid) => {
        if (
          !(
            asteroid.coordinates.x + asteroid.size - 1 < _x ||
            _x + size - 1 < asteroid.coordinates.x
          ) &&
          size > asteroid.coordinates.y
        ) {
          uniq = false;
        }
      });

      if (uniq) {
        coordinates.x = _x;
      }
    }

    const index = this.asteroids.length;
    this.asteroids[index] = new Asteroid({
      time: this.time,
      idElement: 'asteroid',
      size: size,
      speed: getRandomNumberByTickTime(this.time * this.tick),
      field: this.field,
      coordinates: coordinates,
    });

    this.asteroids[index].render();

    // console.log(this.asteroids);
    this.htmlField.appendChild(this.asteroids[index].htmlElement);
  }

  // * here are no render
  moveAsteroids() {
    this.asteroids.forEach((ast, index) => {
      const _coordinates = {
        x: ast.coordinates.x,
        y: ast.coordinates.y,
      };

      if (
        Math.round(this.time / (1000 / this.tick / ast.speed)) >
        Math.round(ast.lastTick / (1000 / this.tick / ast.speed))
      ) {
        ast.lastTick = this.time;
        if (ast.coordinates.y + 1 <= this.field.y) {
          ast.setCoordinate(_coordinates);
          _coordinates.y += 1;
        } else {
          ast.remove();
          this.score++;
          this.asteroids.splice(index, 1);
        }
      }
    });
  }

  // ? --- --- --- energy --- --- ---

  // * here are no render
  increaseEnergy(value = 1) {
    if (this.energy.current < this.energy.max)
      this.energy.current = this.statusBars.energy.increase(value);
  }

  // * here are no render
  decreaseEnergy(value = 1) {
    if (this.energy.current > this.energy.min) {
      this.energy.current = this.statusBars.energy.decrease(value);
    }
  }
}
