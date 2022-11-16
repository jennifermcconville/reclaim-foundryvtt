// Import document classes.
import { ReclaimToken } from "./documents/token.mjs";
// Import sheet classes.

// Import placable classes.
import { ReclaimTokenHUD } from "./placables/reclaim-token-hud.mjs";

// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { RECLAIM } from "./helpers/config.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once(`init`, async function() {

  console.debug(`Initialising Reclaim System.`);

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.reclaim = {
    ReclaimToken,
    ReclaimTokenHUD
  };

  // Add custom constants for configuration.
  CONFIG.RECLAIM = RECLAIM;

  // Define custom Document classes
  CONFIG.Token.objectClass = ReclaimToken;


  // Register sheet application classes


  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once(`ready`, async function() {
  game.canvas.hud.token = new ReclaimTokenHUD();
});
