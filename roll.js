/*
 * Roll logic. No DOM in here so it can be tested in Node.
 *
 * rollLoadout() picks an agent (or uses the one you chose), then a weapon and
 * a shield you can afford, then randomly buys ability charges with whatever
 * credits are left. It can never spend more than (credits - reserve).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Roller = api;
})(this, function () {
  var SHIELDS = [
    { id: 'none', name: 'No Shield', cost: 0, weight: 1 },
    { id: 'light', name: 'Light Shield', cost: 400, weight: 2 },
    { id: 'regen', name: 'Regen Shield', cost: 650, weight: 2 },
    { id: 'heavy', name: 'Heavy Shield', cost: 1000, weight: 2 }
  ];

  // Rarity is just based on how much the roll spent.
  var RARITIES = [
    { id: 'common', name: 'Common', min: 0 },
    { id: 'rare', name: 'Rare', min: 900 },
    { id: 'epic', name: 'Epic', min: 1900 },
    { id: 'legendary', name: 'Legendary', min: 3200 }
  ];

  function toInt(v) {
    var n = Math.floor(Number(v));
    return isFinite(n) && n > 0 ? n : 0;
  }

  function randInt(rng, lo, hi) {
    return lo + Math.floor(rng() * (hi - lo + 1)); // inclusive
  }

  function weightedPick(items, rng) {
    var total = 0;
    items.forEach(function (i) { total += i.weight; });
    var r = rng() * total;
    for (var k = 0; k < items.length; k++) {
      r -= items[k].weight;
      if (r < 0) return items[k];
    }
    return items[items.length - 1];
  }

  function shuffle(arr, rng) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function rarityFor(spent) {
    var out = RARITIES[0];
    RARITIES.forEach(function (r) { if (spent >= r.min) out = r; });
    return out;
  }

  function rollLoadout(opts) {
    var rng = opts.rng || Math.random;
    var agents = opts.agents;
    var credits = toInt(opts.credits);
    var reserve = toInt(opts.reserve);
    var budget = Math.max(0, credits - reserve);

    var agent;
    if (opts.agentName) {
      agent = agents.find(function (a) { return a.name === opts.agentName; });
      if (!agent) throw new Error('Unknown agent: ' + opts.agentName);
    } else {
      agent = agents[Math.floor(rng() * agents.length)];
    }

    // 1) Weapon: only the ones you can actually afford (Classic is free, so
    //    there is always at least one).
    var weapons = opts.weapons;
    var weapon = weightedPick(weapons.filter(function (x) { return x.cost <= budget; }), rng);
    var remaining = budget - weapon.cost;

    // 2) Shield: whatever you can still afford.
    var shield = weightedPick(SHIELDS.filter(function (s) { return s.cost <= remaining; }), rng);
    remaining -= shield.cost;

    // 3) Abilities: free ones are always owned, paid ones are bought at random.
    var abilities = agent.abilities.map(function (a) {
      var free = a.cost === 0 ? a.max : Math.min(a.free || 0, a.max);
      return { name: a.name, cost: a.cost, max: a.max, free: free, bought: 0 };
    });

    var paid = [];
    abilities.forEach(function (a, i) {
      if (a.cost > 0 && a.max - a.free > 0) paid.push(i);
    });
    shuffle(paid, rng).forEach(function (i) {
      var a = abilities[i];
      var limit = Math.min(a.max - a.free, Math.floor(remaining / a.cost));
      a.bought = randInt(rng, 0, limit);
      remaining -= a.bought * a.cost;
    });

    abilities.forEach(function (a) { a.total = a.free + a.bought; });

    var spent = budget - remaining;
    return {
      agent: agent,
      weapon: weapon,
      shield: shield,
      abilities: abilities,
      credits: credits,
      reserve: reserve,
      spent: spent,
      left: credits - spent,
      rarity: rarityFor(spent)
    };
  }

  return { rollLoadout: rollLoadout, SHIELDS: SHIELDS, RARITIES: RARITIES };
});
