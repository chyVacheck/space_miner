// ! modules
// ? utils
import { GAME_SETTING } from '../utils/constants.js';
import { getRandomNumber } from '../utils/utils.js';
//
//
export class Space {
  constructor({ idElement, idSun }) {
    this.htmlElement = document.getElementById(idElement);
    this.htmlSun = document.getElementById(idSun);
    this.numberOfStars = 120;
    this.field = { x: GAME_SETTING.FIELD.X, y: GAME_SETTING.FIELD.Y };
    this.classList = {
      sun: {
        inactive: 'sun_active_inactive',
      },
    };

    // ? --- --- --- methods --- --- ---
    this.showView = this.showView.bind(this);
    this.closeView = this.closeView.bind(this);
    this.initStars = this.initStars.bind(this);
  }

  // ? --- --- --- f --- --- ---
  initStars() {
    for (let i = 0; i < this.numberOfStars; i++) {
      // Создание элемента
      const starElement = document.createElement('span');
      starElement.className = 'star';

      // Генерация случайных значений для --row и --column
      const randomRow = getRandomNumber(1, this.field.y);
      const randomColumn = getRandomNumber(1, this.field.x);

      // Установка значений в стилях элемента
      starElement.style.setProperty('--row', randomRow);
      starElement.style.setProperty('--column', randomColumn);

      // Добавление элемента в сетку
      this.htmlElement.appendChild(starElement);
    }
  }

  // ? --- --- --- View --- --- ---

  // open view
  showView() {
    this.htmlSun.classList.remove(this.classList.sun.inactive);
  }

  // close view
  closeView() {
    this.htmlSun.classList.add(this.classList.sun.inactive);
  }
}
