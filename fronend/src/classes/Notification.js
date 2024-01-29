// ! modules
//
//
export class Notification {
  constructor({ idIcon, idElement, classList }) {
    this.htmlIcon = document.getElementById(idIcon);
    this.htmlElement = document.getElementById(idElement);
    this.classList = {
      rotate: {
        name: classList.rotate.name,
      },
      jump: {
        name: classList.jump.name,
      },
    };

    // ? --- --- --- methods --- --- ---
    this.showNotification = this.showNotification.bind(this);
    this.enabledAnimation = this.enabledAnimation.bind(this);
    this.disabledAnimation = this.disabledAnimation.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
    this.setTextNotification = this.setTextNotification.bind(this);

    this.showNotification();
  }

  // open view
  showNotification() {
    this.htmlElement.style.opacity = 1;
  }

  // close view
  closeNotification() {
    this.htmlElement.style.opacity = 0;
  }

  // like say hi i will help you
  _firstClick() {
    this.htmlIcon.removeEventListener("click", this._firstClick);
    this.htmlIcon.classList.remove(this.classList.jump.name);
    this.showNotification();
    this.setTextNotification("Here I will show you info about current game.");

    setTimeout(() => {
      setTimeout(() => {
        this.htmlIcon.classList.add(this.classList.jump.name);
      }, this.classList.rotate.duration);
      this.htmlIcon.addEventListener("click", this._secondClick);
    }, 5_000);
  }

  _secondClick() {
    this.htmlIcon.removeEventListener("click", this._secondClick);
    this.htmlIcon.classList.remove(this.classList.jump.name);
    this.showNotification();
    this.setTextNotification("Start play when will be ready.");
  }

  // turn on animation
  enabledAnimation(animation) {
    this.htmlIcon.classList.add(this.classList[animation].name);
  }

  // turn off animation
  disabledAnimation(animation) {
    this.htmlIcon.classList.remove(this.classList[animation].name);
  }

  // set a new text
  setTextNotification(text, speed = 35) {
    this.htmlElement.innerText = "";

    const array = Array.from(text);
    let i = 0;
    const timer = setInterval(() => {
      let letter = "";
      if (array[i - 1] === " ") {
        letter = ` ${array[i]}`;
      } else {
        letter = array[i];
      }

      this.htmlElement.innerText += letter;

      if (i < array.length) i++;
      if (i === array.length) clearInterval(timer);
    }, speed);
  }
}
