// ! modules
// ? utils
import { GAME_SETTING } from './../utils/constants.js';
import { createId } from '../utils/utils.js';
//
//
export class SpaceShip {
  constructor({
    type,
    idElement = `${type}-ship`,
    idEngine = `${type}-ship-engine`,
    shipSize = 3,
    speed = 0,
    coordinates,
  }) {
    this.type = type;
    this.size = shipSize;
    this.vector = {
      y: 0, // -1 (down) 1 (up)
      x: 0, // -1 (left) 1 (right)
    };
    this.speed = speed;

    // ? --- --- html --- ---
    this.htmlElement = document.getElementById(idElement); // <div id='thisOne' />
    this.htmlEngine = document.getElementById(idEngine); // <div id='thisOne' />

    this.htmlElement = document.createElement('div'); // (idElement); // <div id='thisOne' />
    this.htmlElement.appendChild(
      document.getElementById(`${idElement}-template`).content.cloneNode(true),
    );

    this.htmlElement.id = createId(idElement);
    this.htmlElement.name = idElement;
    this.htmlElement.classList.add('space-ship');

    //
    this.coordinates = {
      maxX: GAME_SETTING.FIELD.X, // ! must be the same like in field.css
      maxY: GAME_SETTING.FIELD.Y, // ! must be the same like in field.css
      x: coordinates.x, // number of rows
      y: coordinates.y, // number of column
    };

    console.log('miner is ready:', this);
    this.htmlElement.style.gridColumn = this.coordinates.x;
    this.htmlElement.style.gridRow = this.coordinates.y;

    // ? --- --- --- methods --- --- ---
    this.render = this.render.bind(this);
    this.generate = this.generate.bind(this);
    this.setVector = this.setVector.bind(this);
    this.setCoordinate = this.setCoordinate.bind(this);
    this.changeVectorView = this.changeVectorView.bind(this);
    this.checkEnginePower = this.checkEnginePower.bind(this); // todo
  }

  render() {
    this.changeVectorView();
    // render in html
    this.htmlElement.style.gridColumn = this.coordinates.x;
    this.htmlElement.style.gridRow = this.coordinates.y;
  }

  setCoordinate(coordinate) {
    this.coordinates = coordinate;
  }

  // for
  setVector(vector) {
    this.vector = vector;
  }

  // create a new miner - ship
  generate() {
    this.coordinates.x = 115;
    this.coordinates.y = 85;
    this.render();
    this.htmlElement.hidden = false;
  }

  remove() {
    this.htmlElement.remove();
    return null;
  }

  checkEnginePower = () => {
    if (Math.abs(this.vector.x) + Math.abs(this.vector.y) > 1) {
      console.log('powerful engine mode');

      this.htmlEngine.classList.add('miner-ship__engine_work_overload');
    } else if (Math.abs(this.vector.x) + Math.abs(this.vector.y) === 1) {
      // console.log("usual engine mode");
      this.htmlEngine.classList.remove('miner-ship__engine_work_overload');
    }
  };

  // change vector view
  changeVectorView() {
    if (this.vector.x === 0 && this.vector.y !== 0) {
      if (this.vector.y > 0) {
        this.htmlElement.style.rotate = '-180deg';
      } else {
        this.htmlElement.style.rotate = '0deg';
      }
    } else if (this.vector.x !== 0) {
      if (this.vector.x > 0) {
        this.htmlElement.style.rotate = '90deg';
      } else {
        this.htmlElement.style.rotate = '-90deg';
      }
    }
  }
}
