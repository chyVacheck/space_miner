//
//
export class StatusBar {
  constructor({ id, minValue = 0, initialValue, maxValue }) {
    this.htmlElement = document.getElementById(id); // <div id='thisOne' />
    this.value = {
      min: minValue,
      current: initialValue,
      max: maxValue,
    };

    // ? --- --- --- methods --- --- ---
    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
  }

  increase() {
    if (this.value.current < this.value.max) this.value.current++;
  }

  decrease() {
    if (this.value.current > this.value.min) this.value.current--;
  }
}
