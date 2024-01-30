//
//
//
export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createId(prefix) {
  return `${prefix}_${Math.floor(Math.random() * Date.now())}`;
}

// if less 300 then from 2 to 4
// if more 300 then from 3 to 5
// if more 500 then from 4 to 6
export function getRandomNumberByTickTime(time, mul = 1) {
  const min = time >= 500 ? 4 : time >= 300 ? 3 : 2;
  const max = time >= 500 ? 6 : time >= 300 ? 5 : 4;

  return getRandomNumber(min, max) * mul;
}
