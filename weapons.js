/*
 * Weapon prices, in credits. Edit any that are out of date after a patch.
 * weight = how likely it is to be picked when you can afford it
 * (the free Classic is weighted lower so it isn't the answer every time).
 *
 * Sources disagreed on several of these (older guides list Operator at 4,500
 * or 5,000, Judge at 1,500 or 1,600, etc.), so these are the current in-game
 * values as best I know them. Please check them against your buy menu.
 */
(function (root, factory) {
  var data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.WEAPONS = data;
})(this, function () {
  var w = function (name, type, cost, weight) {
    return { name: name, type: type, cost: cost, weight: weight || 2 };
  };

  return [
    w('Classic', 'Sidearm', 0, 1),
    w('Shorty', 'Sidearm', 300),
    w('Frenzy', 'Sidearm', 450),
    w('Ghost', 'Sidearm', 500),
    w('Bandit', 'Sidearm', 600),
    w('Sheriff', 'Sidearm', 800),
    w('Stinger', 'SMG', 1100),
    w('Spectre', 'SMG', 1600),
    w('Bucky', 'Shotgun', 850),
    w('Judge', 'Shotgun', 1850),
    w('Bulldog', 'Rifle', 2050),
    w('Guardian', 'Rifle', 2250),
    w('Warden', 'Rifle', 2900),
    w('Phantom', 'Rifle', 2900),
    w('Vandal', 'Rifle', 2900),
    w('Marshal', 'Sniper', 950),
    w('Outlaw', 'Sniper', 2400),
    w('Operator', 'Sniper', 4700),
    w('Ares', 'Machine gun', 1600),
    w('Odin', 'Machine gun', 3200)
  ];
});
