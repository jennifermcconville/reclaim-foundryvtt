/* eslint-disable no-undef */

// Import document classes.
import { ReclaimToken } from "./documents/token.mjs";
import { ReclaimAutoCardHand } from "./documents/auto-card-hand.mjs";

// Import sheet classes.
import { ReclaimCardsHand } from "./sheets/reclaim-cards-hand.mjs";

// Import placable classes.
import { ReclaimTokenHUD } from "./placables/reclaim-token-hud.mjs";

// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { RECLAIM } from "./helpers/config.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once( `init`, async function() {

  console.debug( `Initialising Reclaim System.` );

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.reclaim = {
    ReclaimAutoCardHand,
    ReclaimCardsHand,
    ReclaimToken,
    ReclaimTokenHUD
  };

  // Add custom constants for configuration.
  CONFIG.RECLAIM = RECLAIM;

  // Define custom Document classes
  CONFIG.Token.objectClass = ReclaimToken;
  CONFIG.Cards.documentClass = ReclaimAutoCardHand;

  // Register sheet application classes
  DocumentSheetConfig.registerSheet( Cards, `reclaim`, ReclaimCardsHand, {
    label: `Reclaim Cards Hand`,
    types: [`hand`],
    makeDefault: true
  } );

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
} );

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once( `ready`, async function() {
  game.canvas.hud.token = new ReclaimTokenHUD();
} );
