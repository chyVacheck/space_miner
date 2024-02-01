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
    this.setValue = this.setValue.bind(this);
    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
  }

  setValue(value) {
    this.value.current = value;
  }

  increase(value) {
    if (this.value.current + value <= this.value.max)
      this.value.current += value;
  }

  decrease(value) {
    if (this.value.current - value >= this.value.min)
      this.value.current -= value;
  }
}
