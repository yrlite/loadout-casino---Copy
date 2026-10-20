/*
 * Agent ability prices, in credits.
 *
 * Each ability is: ab(name, cost, max, free)
 *   cost = credits per charge (0 = free signature ability that recharges)
 *   max  = most charges you can hold
 *   free = charges you get for free each round (these don't cost credits)
 *
 * These are a community-sourced snapshot (Valorant Fandom wiki + older guides)
 * and Riot changes prices in balance patches, so double-check them in-game and
 * edit this file whenever something is off. Nothing else needs to change.
 *
 * Missing agents: Waylay, Tejo, Miks and Veto had no reliable price data when
 * this was built. To add one, copy a block below, e.g.:
 *   { name: 'Tejo', role: 'Initiator', abilities: [ ab('Ability name', 200, 1) ] },
 */
(function (root, factory) {
  var data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.AGENTS = data;
})(this, function () {
  var ab = function (name, cost, max, free) {
    return { name: name, cost: cost || 0, max: max || 1, free: free || 0 };
  };

  return [
    { name: 'Astra', role: 'Controller', abilities: [ab('Stars', 150, 5, 1)] },
    { name: 'Breach', role: 'Initiator', abilities: [ab('Aftershock', 200, 1), ab('Flashpoint', 250, 2), ab('Fault Line')] },
    { name: 'Brimstone', role: 'Controller', abilities: [ab('Stim Beacon', 200, 1), ab('Incendiary', 250, 1), ab('Sky Smoke', 100, 3, 1)] },
    { name: 'Chamber', role: 'Sentinel', abilities: [ab('Trademark', 200, 1), ab('Headhunter', 100, 1), ab('Rendezvous')] },
    { name: 'Clove', role: 'Controller', abilities: [ab('Pick-me-up', 200, 1), ab('Meddle', 250, 1), ab('Ruse', 150, 2)] },
    { name: 'Cypher', role: 'Sentinel', abilities: [ab('Trapwire', 200, 2), ab('Cyber Cage', 100, 2), ab('Spycam')] },
    { name: 'Deadlock', role: 'Sentinel', abilities: [ab('GravNet', 200, 1), ab('Sonic Sensor', 200, 2), ab('Barrier Mesh')] },
    { name: 'Fade', role: 'Initiator', abilities: [ab('Prowler', 250, 2), ab('Seize', 200, 1), ab('Haunt')] },
    { name: 'Gekko', role: 'Initiator', abilities: [ab('Mosh Pit', 250, 1), ab('Wingman', 300, 1), ab('Dizzy')] },
    { name: 'Harbor', role: 'Controller', abilities: [ab('Cascade', 150, 2), ab('Cove', 350, 1), ab('High Tide')] },
    { name: 'Iso', role: 'Duelist', abilities: [ab('Contingency', 200, 1), ab('Undercut', 200, 2), ab('Double Tap')] },
    { name: 'Jett', role: 'Duelist', abilities: [ab('Cloudburst', 200, 2), ab('Updraft', 150, 1), ab('Tailwind')] },
    { name: 'KAY/O', role: 'Initiator', abilities: [ab('FRAG/ment', 200, 1), ab('FLASH/drive', 250, 2), ab('ZERO/point')] },
    { name: 'Killjoy', role: 'Sentinel', abilities: [ab('Nanoswarm', 200, 2), ab('Alarmbot', 200, 1), ab('Turret')] },
    { name: 'Miks', role: 'Controller', abilities: [ab('M-pulse', 250, 2), ab('Harmonize', 200, 1), ab('Waveform', 100, 2, 1)] },
    { name: 'Neon', role: 'Duelist', abilities: [ab('Fast Lane', 300, 1), ab('Relay Bolt', 200, 1), ab('High Gear')] },
    { name: 'Omen', role: 'Controller', abilities: [ab('Shrouded Step', 100, 2), ab('Paranoia', 250, 1), ab('Dark Cover', 150, 2, 1)] },
    { name: 'Phoenix', role: 'Duelist', abilities: [ab('Blaze', 150, 1), ab('Curveball', 250, 2), ab('Hot Hands')] },
    { name: 'Raze', role: 'Duelist', abilities: [ab('Boom Bot', 300, 1), ab('Blast Pack', 200, 2), ab('Paint Shells')] },
    { name: 'Reyna', role: 'Duelist', abilities: [ab('Leer', 250, 2), ab('Devour / Dismiss', 200, 2, 1)] },
    { name: 'Sage', role: 'Sentinel', abilities: [ab('Barrier Orb', 400, 1), ab('Slow Orb', 200, 2), ab('Healing Orb')] },
    { name: 'Skye', role: 'Initiator', abilities: [ab('Regrowth', 150, 1), ab('Trailblazer', 300, 1), ab('Guiding Light', 250, 2, 1)] },
    { name: 'Sova', role: 'Initiator', abilities: [ab('Owl Drone', 400, 1), ab('Shock Bolt', 150, 2), ab('Recon Bolt')] },
    { name: 'Tejo', role: 'Initiator', abilities: [ab('Stealth Drone', 400, 1), ab('Special Delivery', 200, 1), ab('Guided Salvo', 150, 2, 1)] },
    { name: 'Viper', role: 'Controller', abilities: [ab('Snake Bite', 300, 1), ab('Poison Cloud', 200, 1), ab('Toxic Screen')] },
    { name: 'Vyse', role: 'Sentinel', abilities: [ab('Razorvine', 150, 2), ab('Shear', 200, 1), ab('Arc Rose')] },
    { name: 'Veto', role: 'Sentinel', abilities: [ab('Crosscut', 200, 2), ab('Chokehold', 200, 1), ab('Interceptor')] },
    { name: 'Waylay', role: 'Duelist', abilities: [ab('Saturate', 300, 1), ab('Lightspeed', 300, 1), ab('Refract')] },
    { name: 'Yoru', role: 'Duelist', abilities: [ab('Fakeout', 100, 1), ab('Blindside', 250, 2), ab('Gatecrash')] } 
  ];
});
