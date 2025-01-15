//
//
//
export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createId(prefix) {
  return `${prefix}_${Math.floor(Math.random() * Date.now())}`;
}

// if less 10s then from 4 to 6
// if more 30s then from 8 to 10
// if more 60s then from 12 to 20
export function getRandomNumberByTickTime(time, mul = 1) {
  const min = time < 10 ? 4 : time > 30 ? 8 : 12;
  const max = time < 10 ? 6 : time > 30 ? 10 : 20;

  return getRandomNumber(min, max) * mul;
}

export function formatMilliseconds(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds %= 60;
  minutes %= 60;

  const formattedTime = `${hours ? hours + 'h ' : ''}${
    minutes ? minutes + ' min ' : ''
  }${seconds ? seconds + ' sec' : ''}`;
  return formattedTime.trim();
}
