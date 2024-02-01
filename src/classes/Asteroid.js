// ! modules
// ? utils
import { GAME_SETTING } from './../utils/constants.js';
import { createId } from '../utils/utils.js';
//
export class Asteroid {
  constructor({
    lastTick = 0,
    idElement = 'asteroid',
    size = 2,
    speed = 0,
    coordinates,
  }) {
    this.lastTick = lastTick;
    this.size = size;
    this.speed = speed;

    // ? --- --- --- html --- --- ---

    this.htmlElement = document.createElement('div'); // (idElement); // <div id='thisOne' />
    this.htmlElement.appendChild(
      document.getElementById(`${idElement}-template`).content.cloneNode(true),
    );

    this.htmlElement.id = createId('asteroid');
    this.htmlElement.name = 'asteroid';
    this.htmlElement.classList.add('asteroid');
    this.htmlElement.style.setProperty('--size-asteroid', this.size);
    this.htmlElement.style.setProperty('--time-rotate', `${this.size - 3}s`);

    //
    this.coordinates = {
      maxX: GAME_SETTING.FIELD.X, // ! must be the same like in field.css
      maxY: GAME_SETTING.FIELD.Y, // ! must be the same like in field.css
      x: coordinates.x, // number of rows
      y: coordinates.y, // number of column
    };

    // ! console.log('asteroid is ready:', this);

    // ? --- --- --- methods --- --- ---
    this.render = this.render.bind(this);
    this.generate = this.generate.bind(this);
    this.setCoordinate = this.setCoordinate.bind(this);
  }

  render() {
    // render in html
    this.htmlElement.style.gridColumn = this.coordinates.x;
    this.htmlElement.style.gridRow = this.coordinates.y;
  }

  remove() {
    this.htmlElement.remove();
    return null;
  }

  // create a new miner - ship
  generate(coordinates) {
    this.coordinates = coordinates;
    this.render();
  }

  setCoordinate(coordinate) {
    this.coordinates = coordinate;
  }
}