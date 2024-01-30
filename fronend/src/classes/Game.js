// ! module
import { Asteroid } from './Asteroid.js';
import { SpaceShip } from './SpaceShip.js';

// ? utils
import { getRandomNumberByTickTime, getRandomNumber } from '../utils/utils.js';

//
//
export class Game {
  // ! --- --- --- constructor --- --- ---÷
  constructor({
    fieldId = 'game-field',
    field = { x: 126, y: 96 },
    coordinates = { x: 65, y: 70 },
    energy,
    notification,
  }) {
    this.score = 0;
    this.time = 1;
    this.tick = 10;
    this.globalInterval;
    this.energy = {
      isCharged: true,
      max: 20,
      current: 20,
      min: 0,
    };
    this.spaceShip;
    this.moveForSpaceShip = { lastTick: 0 };
    this.spaceShipSize = 3;
    this.allowedKeys = [
      'shift',
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
      x: field.x,
      y: field.y,
    };
    this.coordinates = {
      x: coordinates.x,
      y: coordinates.y,
    };
    this.speed = {
      min: 0,
      possibleOptions: [0, 1, 2, 4, 5, 10, 15],
      current: 1,
      max: 10,
    };
    this.vector = {
      x: 0,
      y: 0,
    };
    this.isSpaceShipMoving = false;
    this.statusBars = {
      energy: {
        increase: energy.increaseEnergy,
        decrease: energy.decreaseEnergy,
        render: energy.renderEnergy,
      },
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

    // ? --- --- --- space ship --- --- ---
    // create
    this.spaceShip = new SpaceShip({
      idElement: 'space-ship',
      idEngine: 'space-ship-engine',
      field: this.field,
      shipSize: this.spaceShipSize,
      speed: this.speed,
      coordinates: this.coordinates,
    });

    // ? --- --- --- asteroids --- --- ---
    // create
    this.asteroids = [];

    // ? --- --- --- methods --- --- ---
    this.start = this.start.bind(this);
    this.render = this.render.bind(this);
    this.manageSpeed = this.manageSpeed.bind(this);
    this.manageEnergy = this.manageEnergy.bind(this);
    this.moveSpaceShip = this.moveSpaceShip.bind(this);
    this.increaseEnergy = this.increaseEnergy.bind(this);
    this.decreaseEnergy = this.decreaseEnergy.bind(this);
    this.createAsteroid = this.createAsteroid.bind(this);
    this.manageCollision = this.manageCollision.bind(this);
    this.handlerKeyPress = this.handlerKeyPress.bind(this);
    this.handlerClickPilot = this.handlerClickPilot.bind(this);
    this._closeNotification = this.closeNotification.bind(this);

    // ! dev
    window.createAsteroid = this.createAsteroid; // todo delete in release
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

  // ! --- --- --- main function --- --- ---
  start() {
    this.createAsteroid();

    document.addEventListener('keyup', this.handlerKeyPress);
    this.notification.html.icon.addEventListener(
      'click',
      this.handlerClickPilot,
    );

    this._sayHello();

    //
    this.globalInterval = setInterval(() => {
      this.isSpaceShipMoving = false;

      // TODO
      if (this.asteroids.length < 25 && this.time % 20 === 0)
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

      // manager speed
      this.manageSpeed();

      // manage energy
      this.manageEnergy();

      // manage notification
      this.manageNotification();

      // ? render
      this.render();
      this.time++;
    }, this.tick);
  }

  // ! --- --- --- function --- --- ---
  // ? render method
  render() {
    this.statusBars.energy.render(); // energy status bar
    this.spaceShip.render(); // spaceShip (user)
    this.asteroids.forEach((ast) => ast.render());
  }

  // --- --- --- handlers --- --- ---

  // key pressed
  handlerKeyPress(event) {
    const button = event.key.toLowerCase();
    // if not allowed just do nothing
    if (!this.allowedKeys.includes(button)) return;

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
      `speed: ${this.speed.current}\nvector: x:${this.vector.x} y:${this.vector.y}`,
    );
  }

  // show in notification all stats
  handlerClickPilot() {
    this.notification.canBeClosed = false;
    this.notification.isShowing = true;
    // todo make a random phrases
    this.notification.setText(`I am okay, thanks`, 25);
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
  manageSpeed() {
    const _value =
      this.speed.current * (Math.abs(this.vector.x) + Math.abs(this.vector.y));

    // manage in or de crease energy we need
    switch (_value) {
      case 2:
        if (this.isSpaceShipMoving) {
          this.decreaseEnergy(_value - 1);
        }
        break;

      case 1:
        break;

      case 0:
        break;

      default:
        break;
    }
  }

  // manage to set speed 1 because of low energy
  manageEnergy() {
    // max
    if (this.energy.current === this.energy.max) {
      // todo more then 30%
      this.energy.isCharged = true;
    } else {
      if (!this.isSpaceShipMoving) this.increaseEnergy();

      // min
      if (this.energy.current === this.energy.min) {
        this.speed.current = 1;

        if (!this.notification.isShowing && this.energy.isCharged) {
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

  // todo make function to calculate collision
  manageCollision() {}

  // ? --- --- --- space ship --- --- ---

  // * here are no render
  moveSpaceShip() {
    // calculate time

    if (
      Math.round(this.time / (1000 / this.tick / this.speed.current)) >
      Math.round(
        this.moveForSpaceShip.lastTick /
          (1000 / this.tick / this.speed.current),
      )
    ) {
      this.moveForSpaceShip.lastTick = this.time;

      // ? X
      if (
        this.coordinates.x + 1 * this.vector.x + (this.spaceShipSize - 1) <=
          this.field.x &&
        this.coordinates.x + 1 * this.vector.x > 0 &&
        Math.abs(this.vector.x) > 0
      ) {
        this.isSpaceShipMoving = true;
        this.coordinates.x += 1 * this.vector.x;
      }

      // ? Y
      if (
        this.coordinates.y + 1 * this.vector.y + (this.spaceShipSize - 1) <=
          this.field.y &&
        this.coordinates.y + 1 * this.vector.y > 0 &&
        Math.abs(this.vector.y) > 0
      ) {
        this.isSpaceShipMoving = true;
        this.coordinates.y += 1 * this.vector.y;
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
      console.log('try generate asteroid x');
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
      // if less 300 then from 1 to 3
      // if more 300 then from 2 to 4
      // if more 500 then from 3 to 4
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
          ast.destroy();
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
