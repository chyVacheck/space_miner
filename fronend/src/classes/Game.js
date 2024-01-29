// ! module
import { SpaceShip } from './SpaceShip.js';
//
//
export class Game {
  // ! --- --- --- constructor --- --- ---÷
  constructor({
    field = { x: 126, y: 96 },
    coordinates = { x: 65, y: 47 },
    energy,
    notification,
  }) {
    this.score = 0;
    this.time = 0;
    this.tick = 100;
    this.globalInterval;
    this.energy = {
      isCharged: true,
      max: 20,
      current: 20,
      min: 0,
    };
    this.spaceShip;
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
      current: 0,
      max: 2,
    };
    this.vector = {
      x: 0,
      y: 0,
    };
    this.statusBars = {
      energy: {
        increase: energy.increaseEnergy,
        decrease: energy.decreaseEnergy,
        render: energy.renderEnergy,
      },
    };
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

    // ? --- --- --- methods --- --- ---
    this.move = this.move.bind(this);
    this.start = this.start.bind(this);
    this.render = this.render.bind(this);
    this.manageSpeed = this.manageSpeed.bind(this);
    this.manageEnergy = this.manageEnergy.bind(this);
    this.increaseEnergy = this.increaseEnergy.bind(this);
    this.decreaseEnergy = this.decreaseEnergy.bind(this);
    this.handlerKeyPress = this.handlerKeyPress.bind(this);
    this.handlerClickPilot = this.handlerClickPilot.bind(this);
    this._closeNotification = this._closeNotification.bind(this);
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
    document.addEventListener('keyup', this.handlerKeyPress);
    this.notification.html.icon.addEventListener(
      'click',
      this.handlerClickPilot,
    );

    this._sayHello();

    //
    this.globalInterval = setInterval(() => {
      // do I really need this comment here ? :)
      this.move();

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
    }, this.tick);
  }

  // ! --- --- --- function --- --- ---
  // ? render method
  render() {
    this.statusBars.energy.render(); // energy status bar
    this.spaceShip.render(); // spaceShip (user)
  }

  // manage notification
  manageNotification() {
    if (this.notification.canBeClosed && this.notification.isShowing) {
      this._closeNotification();
    }
  }

  // show in notification all stats
  handlerClickPilot() {
    this.notification.canBeClosed = false;
    this.notification.isShowing = true;
    this.notification.setText(`I am okay, thanks`, 25);
    this.notification.show();
    setTimeout(() => {
      this.notification.canBeClosed = true;
    }, 1_500);
  }

  // close notification
  _closeNotification() {
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

  // manage to speed
  manageSpeed() {
    const _value =
      this.speed.current * (Math.abs(this.vector.x) + Math.abs(this.vector.y));

    // manage in or de crease energy we need
    switch (_value) {
      case 2:
        this.decreaseEnergy();
        break;

      case 1:
        break;

      case 0:
        this.increaseEnergy();
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
    }
    // min
    else if (this.energy.current === this.energy.min) {
      this.speed.current = 1;

      if (!this.notification.isShowing && this.energy.isCharged) {
        this.alert(`Low energy\nNow speed is ${this.speed.current}`, 50);
        this.energy.isCharged = false;
      }
    }
  }

  // * here are no render
  move() {
    if (
      this.speed.current * (Math.abs(this.vector.x) + Math.abs(this.vector.y)) >
      0
    ) {
      // ? X
      if (
        this.coordinates.x +
          this.speed.current * this.vector.x +
          (this.spaceShipSize - 1) <=
          this.field.x &&
        this.coordinates.x + this.speed.current * this.vector.x > 0
      )
        this.coordinates.x += this.speed.current * this.vector.x;

      // ? Y
      if (
        this.coordinates.y +
          this.speed.current * this.vector.y +
          (this.spaceShipSize - 1) <=
          this.field.y &&
        this.coordinates.y + this.speed.current * this.vector.y > 0
      )
        this.coordinates.y += this.speed.current * this.vector.y;
    }
  }

  // ? key pressed
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

  // * here are no render
  increaseEnergy() {
    if (this.energy.current < this.energy.max)
      this.energy.current = this.statusBars.energy.increase();
  }

  // * here are no render
  decreaseEnergy() {
    if (this.energy.current > this.energy.min) {
      this.energy.current = this.statusBars.energy.decrease();
    }
  }
}
