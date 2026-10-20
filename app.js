(function () {
  var Roller = window.Roller;
  var agents = window.AGENTS;
  var weapons = window.WEAPONS;

  var agentSel = document.getElementById('agent');
  var creditsIn = document.getElementById('credits');
  var reserveIn = document.getElementById('reserve');
  var rollBtn = document.getElementById('roll');
  var reelAgent = document.getElementById('reel-agent');
  var reelWeapon = document.getElementById('reel-weapon');
  var reelShield = document.getElementById('reel-shield');
  var abilitiesEl = document.getElementById('abilities');
  var summaryEl = document.getElementById('summary');
  var historyPanel = document.getElementById('history-panel');
  var historyEl = document.getElementById('history');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var busy = false;
  var history = [];

  function fmt(n) { return n.toLocaleString('en-US'); }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, reduceMotion ? 0 : ms); }); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // Agent dropdown
  var randomOpt = el('option', '', 'Random agent');
  randomOpt.value = '';
  agentSel.appendChild(randomOpt);
  agents.forEach(function (a) {
    var o = el('option', '', a.name + ' (' + a.role + ')');
    o.value = a.name;
    agentSel.appendChild(o);
  });

  // Quick credit chips
  document.querySelectorAll('.chips button').forEach(function (b) {
    b.addEventListener('click', function () { creditsIn.value = b.dataset.credits; });
  });

  function spin(slot, pool, finalText, ms) {
    slot.classList.remove('locked');
    slot.classList.add('spinning');
    if (reduceMotion) {
      slot.textContent = finalText;
      slot.classList.remove('spinning');
      slot.classList.add('locked');
      return Promise.resolve();
    }
    return new Promise(function (resolve) {
      var timer = setInterval(function () {
        slot.textContent = pool[Math.floor(Math.random() * pool.length)];
      }, 70);
      setTimeout(function () {
        clearInterval(timer);
        slot.textContent = finalText;
        slot.classList.remove('spinning');
        slot.classList.add('locked');
        resolve();
      }, ms);
    });
  }

  function buildCard(a) {
    var card = el('div', 'card facedown');
    var body = el('div', 'body');
    body.appendChild(el('div', 'name', a.name));
    if (a.total === 0) {
      card.classList.add('skipped');
      body.appendChild(el('div', 'count', 'Skipped'));
      body.appendChild(el('div', 'note', 'Not bought (' + fmt(a.cost) + ' each)'));
    } else {
      body.appendChild(el('div', 'count', '×' + a.total));
      var note;
      if (a.cost === 0) note = 'Free, recharges';
      else if (a.free > 0 && a.bought > 0) note = a.free + ' free + ' + a.bought + ' bought, -' + fmt(a.bought * a.cost);
      else if (a.free > 0) note = 'Free charge only';
      else note = 'Bought, -' + fmt(a.bought * a.cost);
      body.appendChild(el('div', 'note', note));
    }
    card.appendChild(body);
    return card;
  }

  function renderSummary(res) {
    summaryEl.textContent = '';
    summaryEl.appendChild(el('span', 'badge ' + res.rarity.id, res.rarity.name));
    var spent = el('span', 'stat');
    spent.append('Spent ');
    spent.appendChild(el('b', '', fmt(res.spent)));
    summaryEl.appendChild(spent);
    var left = el('span', 'stat');
    left.append('Left over ');
    left.appendChild(el('b', '', fmt(res.left)));
    summaryEl.appendChild(left);
  }

  function addHistory(res) {
    var bits = res.abilities
      .filter(function (a) { return a.bought > 0; })
      .map(function (a) { return a.bought + '× ' + a.name; });
    var line = res.agent.name + ': ' + res.weapon.name + ', ' + res.shield.name +
      (bits.length ? ', ' + bits.join(', ') : ', no bought abilities') +
      ' (' + fmt(res.spent) + ' cr)';
    history.unshift({ line: line, rarity: res.rarity.name });
    history = history.slice(0, 8);
    historyEl.textContent = '';
    history.forEach(function (h) {
      var li = el('li');
      li.appendChild(el('b', '', h.rarity + ' '));
      li.append(h.line);
      historyEl.appendChild(li);
    });
    historyPanel.hidden = false;
  }

  async function onRoll() {
    if (busy) return;
    busy = true;
    rollBtn.disabled = true;
    abilitiesEl.textContent = '';
    summaryEl.textContent = '';

    var res = Roller.rollLoadout({
      agents: agents,
      weapons: weapons,
      credits: creditsIn.value,
      reserve: reserveIn.value,
      agentName: agentSel.value || null
    });

    // The result is already decided; the rest is just show.
    var agentNames = agents.map(function (a) { return a.name; });
    var weaponNames = weapons.map(function (w) { return w.name; });
    var shieldNames = Roller.SHIELDS.map(function (s) { return s.name; });
    await Promise.all([
      spin(reelAgent, agentNames, res.agent.name, agentSel.value ? 500 : 1000),
      spin(reelWeapon, weaponNames, res.weapon.name, 1400),
      spin(reelShield, shieldNames, res.shield.name, 1800)
    ]);

    var cards = res.abilities.map(buildCard);
    cards.forEach(function (c) { abilitiesEl.appendChild(c); });
    for (var i = 0; i < cards.length; i++) {
      await sleep(260);
      cards[i].classList.remove('facedown');
      cards[i].classList.add('reveal');
    }

    await sleep(150);
    renderSummary(res);
    addHistory(res);
    busy = false;
    rollBtn.disabled = false;
  }

  rollBtn.addEventListener('click', onRoll);
})();
