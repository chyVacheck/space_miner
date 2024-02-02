//
//
export const GAME_SETTING = {
  FIELD: {
    X: 205,
    Y: 130,
  },
  ENERGY: {
    VALUE: {
      MIN: 0,
      INIT: 20,
      MAX: 20,
      RECOVERY: 5, // speed of increase // value that will increase per second // good to be half of speed space ship
    },
  },
  SPACE_SHIP: {
    COORDINATES: { X: 102, Y: 100 }, // start coordinates
    MINER: {
      SIZE: 4,
      SPEED: {
        MIN: 0,
        INIT: 0,
        MAX: 10,
      },
    },
  },
};
