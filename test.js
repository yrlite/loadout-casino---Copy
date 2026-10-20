// Run with: node test.js
const assert = require('assert');
const AGENTS = require('./agents.js');
const WEAPONS = require('./weapons.js');
const { rollLoadout: roll, SHIELDS } = require('./roll.js');
const rollLoadout = (o) => roll(Object.assign({ weapons: WEAPONS }, o));

// Small seeded RNG so failures are reproducible.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 1) Data sanity
const names = new Set();
for (const a of AGENTS) {
  assert(!names.has(a.name), 'duplicate agent ' + a.name);
  names.add(a.name);
  assert(a.abilities.length > 0, a.name + ' has no abilities');
  for (const ab of a.abilities) {
    assert(Number.isInteger(ab.cost) && ab.cost >= 0, a.name + ' ' + ab.name + ' bad cost');
    assert(Number.isInteger(ab.max) && ab.max >= 1, a.name + ' ' + ab.name + ' bad max');
    assert(ab.free >= 0 && ab.free <= ab.max, a.name + ' ' + ab.name + ' bad free');
  }
}

assert(WEAPONS.some((w) => w.cost === 0), 'need a free weapon so a roll is always possible');
for (const w of WEAPONS) {
  assert(Number.isInteger(w.cost) && w.cost >= 0 && w.weight > 0, w.name + ' bad data');
}

// 2) Budget invariants over lots of random rolls
const weaponSeen = {};
const rng = mulberry32(12345);
const shieldSeen = {};
let rolls = 0;
for (let i = 0; i < 30000; i++) {
  const credits = Math.floor(rng() * 12000);
  const reserve = rng() < 0.5 ? 0 : Math.floor(rng() * 6000);
  const agentName = rng() < 0.5 ? AGENTS[Math.floor(rng() * AGENTS.length)].name : null;
  const r = rollLoadout({ agents: AGENTS, credits, reserve, agentName, rng });
  rolls++;

  const budget = Math.max(0, credits - reserve);
  assert(r.spent <= budget, `overspent: spent ${r.spent} > budget ${budget}`);
  assert(r.left === credits - r.spent, 'left mismatch');
  assert(r.left >= reserve || budget === 0 || credits < reserve, 'reserve was dipped into');
  if (agentName) assert.strictEqual(r.agent.name, agentName);
  assert(r.weapon.cost <= budget, 'unaffordable weapon');
  assert(r.weapon.cost + r.shield.cost <= budget, 'weapon + shield over budget');
  weaponSeen[r.weapon.name] = true;
  shieldSeen[r.shield.id] = true;

  let abilitySpend = 0;
  for (const a of r.abilities) {
    assert(a.bought >= 0 && a.free + a.bought <= a.max, `${a.name} over max`);
    if (a.cost === 0) assert.strictEqual(a.total, a.max, a.name + ' free ability missing');
    abilitySpend += a.bought * a.cost;
  }
  assert.strictEqual(abilitySpend + r.shield.cost + r.weapon.cost, r.spent, 'spend does not add up');
}

// 3) Edge cases
const broke = rollLoadout({ agents: AGENTS, credits: 0, rng });
assert.strictEqual(broke.spent, 0);
assert.strictEqual(broke.shield.id, 'none');
assert.strictEqual(broke.weapon.name, 'Classic');

const junk = rollLoadout({ agents: AGENTS, credits: 'abc', reserve: -50, rng });
assert.strictEqual(junk.spent, 0);

const allReserved = rollLoadout({ agents: AGENTS, credits: 3000, reserve: 5000, rng });
assert.strictEqual(allReserved.spent, 0);

assert.throws(() => rollLoadout({ agents: AGENTS, credits: 1000, agentName: 'Nobody' }), /Unknown agent/);

// Same seed => same roll
const a1 = rollLoadout({ agents: AGENTS, credits: 3900, agentName: 'Jett', rng: mulberry32(7) });
const a2 = rollLoadout({ agents: AGENTS, credits: 3900, agentName: 'Jett', rng: mulberry32(7) });
assert.deepStrictEqual(a1, a2);

// Every shield type should show up with a big budget
for (const s of SHIELDS) assert(shieldSeen[s.id], 'never rolled ' + s.id);
for (const w of WEAPONS) assert(weaponSeen[w.name], 'never rolled ' + w.name);

console.log(`OK - ${AGENTS.length} agents, ${rolls} random rolls, no budget violations`);
