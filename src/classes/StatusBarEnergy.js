// ! modules
import { GAME_SETTING } from '../utils/constants.js';
import { StatusBar } from './StatusBar.js';
//
//
export class StatusBarEnergy extends StatusBar {
  constructor({
    id,
    selectorsEnergy,
    classListEnergy,
    classActive,
    initialValue = GAME_SETTING.ENERGY.VALUE.INIT,
    maxValue = GAME_SETTING.ENERGY.VALUE.MAX,
  }) {
    super({
      id,
      minValue: 0,
      initialValue: initialValue,
      maxValue: maxValue,
    });
    this.classActive = classActive;
    this.classListEnergy = {
      0: classListEnergy.empty,
      1: classListEnergy.half,
      2: classListEnergy.full,
    };
    this.arrayEnergy = Array.from(
      document.querySelectorAll(selectorsEnergy),
    ).map((element, index, array) => {
      return {
        html: element,
        charge: initialValue / array.length,
      };
    });
    this.energyByOneElement = initialValue / this.arrayEnergy.length;

    // ? --- --- --- methods --- --- ---
    this.renderAll = this.renderAll.bind(this);
    this.changeView = this.changeView.bind(this);
    this.increaseEnergy = this.increaseEnergy.bind(this);
    this.decreaseEnergy = this.decreaseEnergy.bind(this);
    this.calculateEnergy = this.calculateEnergy.bind(this);
  }

  calculateEnergy = () => {
    let _energy = this.value.current;

    this.arrayEnergy.forEach((en) => {
      for (let i = this.energyByOneElement; i >= 0; i--) {
        if (_energy >= i) {
          en.charge = i;
          _energy -= i;
          break;
        }
      }
    });
  };

  changeView(boolean = this.htmlElement.style.display === 'none') {
    this.htmlElement.style.display = boolean ? '' : 'none';
  }

  increaseEnergy(value) {
    this.increase(value);
    this.calculateEnergy();
    return this.value.current;
  }

  decreaseEnergy(value) {
    this.decrease(value);
    this.calculateEnergy();
    return this.value.current;
  }

  renderAll() {
    this.arrayEnergy.forEach((en) => {
      Object.values(this.classListEnergy).forEach((className) => {
        en.html.classList.remove(className);
      });

      en.html.classList.add(this.classListEnergy[en.charge]);
      en.html.setAttribute('data-charge', en.charge);
    });
  }
}
