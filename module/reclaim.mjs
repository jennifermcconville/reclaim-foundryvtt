/* eslint-disable no-undef */

// Import document classes.
import { ReclaimToken } from "./documents/token.mjs";
import { ReclaimConnectedCards } from "./documents/connected-cards.mjs";
import { ReclaimCard } from "./documents/card.mjs";

// Import sheet classes.
import { ReclaimCardsHandSheet } from "./sheets/cards-hand-sheet.mjs";
import { ReclaimCardConfig } from "./sheets/card-config-sheet.mjs";
import { RelcaimTokenConfig } from "./placables/reclaim-token-config.mjs";

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
    RelcaimTokenConfig,
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
  DocumentSheetConfig.unregisterSheet( TokenDocument, `core`, TokenConfig );

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
  DocumentSheetConfig.registerSheet( TokenDocument, `reclaim`, RelcaimTokenConfig, {
    label: `RECLAIM.Token`,
    makeDefault: true
  } );


  // Propagate init to other js modules

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
} );

Hooks.once( `ready`, async function() {
  game.canvas.hud.token = new ReclaimTokenHUD();
  UserCardsManager.onReady();

  setupOwnership();

  // Disable default pause when starting module
  if ( game.paused ) {
    game.togglePause( false );
  }
} ); // End hook ready

/**
 * Sets the ownership for all tokens, actors, cards and journals to Owner for all players
 */
function setupOwnership() {
  console.debug( `Setting up permissions.` );

  for ( let cards of game.cards ) {
    correctDefaultOwnership( cards );

    // For ( let child of cards.collections.cards ) {
    //   if ( child.ownership ) {
    //     child.ownership.default = CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;
    //   }
    // }
  }

  for ( let actor of game.actors ) {
    correctDefaultOwnership( actor );
  }

  for ( let journal of game.journal ) {
    correctDefaultOwnership( journal );
    for ( let entry of journal.collection ) {
      correctDefaultOwnership( entry );
    }
  }

  // For ( let scene of game.scenes ) {
  //   for ( let token of scene.tokens ) {
  //     correctDefaultOwnership( token );
  //   }
  // }
}

/**
 *
 * If default ownership not set to CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER, sets to CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER.
 *
 * @param {Document} document
 */
function correctDefaultOwnership( document ) {
  if ( !document.ownership ) {
    return;
  }

  if ( document.ownership.default !== CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER ) {

    let newOwnership = document.ownership;
    newOwnership.default = CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;
    document.update( {
      ownership: newOwnership
    } );
  }
}

