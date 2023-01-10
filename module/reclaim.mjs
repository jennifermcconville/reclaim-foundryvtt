/* eslint-disable no-undef */

// Import document classes.
import { ReclaimToken } from "./documents/token.mjs";
import { ReclaimConnectedCards } from "./documents/connected-cards.mjs";
import { ReclaimCard } from "./documents/card.mjs";

// Import sheet classes.
import { ReclaimCardsHandSheet } from "./sheets/cards-hand-sheet.mjs";
import { ReclaimCardConfig } from "./sheets/card-config-sheet.mjs";

// Import placable classes.
import { ReclaimTokenHUD } from "./placables/reclaim-token-hud.mjs";

// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { RECLAIM } from "./helpers/config.mjs";
import { UserCardsManager } from "./helpers/user-cards-manager.mjs";

Hooks.once( `init`, async function() {

  console.debug( `Initialising Reclaim System.` );

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.reclaim = {
    ReclaimConnectedCards,
    ReclaimCard,
    ReclaimCardsHandSheet,
    ReclaimCardConfig,
    ReclaimToken,
    ReclaimTokenHUD
  };

  // Add custom constants for configuration.
  CONFIG.RECLAIM = RECLAIM;

  // Define custom Document classes
  CONFIG.Token.objectClass = ReclaimToken;
  CONFIG.Cards.documentClass = ReclaimConnectedCards;
  CONFIG.Card.documentClass = ReclaimCard;

  // Unregister default sheet
  DocumentSheetConfig.unregisterSheet( Cards, `core`, CardsHand, {
    label: `CARDS.CardsHand`,
    types: [`hand`]
  } );
  DocumentSheetConfig.unregisterSheet( Card, `core`, CardConfig, {
    label: `CARDS.Card`
  } );

  // Register sheet application classes
  DocumentSheetConfig.registerSheet( Cards, `reclaim`, ReclaimCardsHandSheet, {
    label: `RECLAIM.CardsHand`,
    types: [`hand`],
    makeDefault: true
  } );
  DocumentSheetConfig.registerSheet( Card, `reclaim`, ReclaimCardConfig, {
    label: `RECLAIM.Card`,
    makeDefault: true
  } );

  // Propagate init to other js modules

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
} );

Hooks.once( `ready`, async function() {
  game.canvas.hud.token = new ReclaimTokenHUD();
  UserCardsManager.onReady();

  // Disable default pause when starting module
  if ( game.paused ) {
    game.togglePause( false );
  }
} ); // End hook ready
