# Loadout Casino

A tiny web app that rolls a random **weapon + shield + ability loadout** for a Valorant agent based on how many credits you have. Pick an agent (or let it pick one), enter your credits, hit ROLL.

- Never spends more than you have
- Rolls a gun first, then a shield, then abilities, each from what you can still afford
- "Keep unspent" box holds some credits back so they never get spent
- Free signature abilities are always included; paid ones are bought at random
- Rarity (Common to Legendary) is based on how much the roll spent
- Plain HTML/CSS/JS, no build step, no dependencies

## Put it on GitHub Pages (free hosting)

1. Create a new repo on GitHub (for example `loadout-casino`).
2. Upload everything in this folder (drag and drop works on the repo page: **Add file > Upload files**) and commit.
3. Go to **Settings > Pages**. Under **Build and deployment**, set Source to **Deploy from a branch**, pick `main` and `/ (root)`, then Save.
4. After a minute your site is live at `https://YOUR-USERNAME.github.io/loadout-casino/`.

To try it locally, just open `index.html` in your browser.

## Fixing prices

Ability prices live in `agents.js` and weapon prices in `weapons.js`. They're a community-sourced snapshot and Riot changes them in balance patches, so check them in-game and edit the numbers. Each ability looks like `ab('Name', cost, maxCharges, freeCharges)` and each weapon like `w('Name', 'Type', cost)`.

Waylay, Tejo, Miks and Veto are not included because I couldn't find reliable prices for them. See the comment at the top of `agents.js` for how to add them.

## Tests

```
node test.js
```

Runs 30,000 random rolls and checks that spending never goes over budget, free abilities are always included, and charge limits hold. It also checks that every weapon and shield can come up.

## Disclaimer

Unofficial fan project. Not endorsed by or affiliated with Riot Games. No real money is involved.
