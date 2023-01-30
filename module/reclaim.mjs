/* eslint-disable no-undef */

// Import application classes
import { ReclaimSidebar } from "./apps/sidebar.mjs";
import { ReclaimPickRoleForm } from "./apps/pick-role-form.mjs";

// Import document classes.
import { ReclaimToken } from "./documents/token.mjs";
import { ReclaimConnectedCards } from "./documents/connected-cards.mjs";
import { ReclaimCard } from "./documents/card.mjs";
import { ReclaimChatMessage } from "./documents/chatt-message.mjs";
import { ReclaimUser } from "./documents/user.mjs";

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

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.reclaim = {
    ReclaimCard,
    ReclaimCardsHandSheet,
    ReclaimCardConfig,
    ReclaimChatMessage,
    ReclaimConnectedCards,
    ReclaimPickRoleForm,
    ReclaimSidebar,
    ReclaimToken,
    RelcaimTokenConfig,
    ReclaimTokenHUD,
    ReclaimUser
  };

  // Add custom constants for configuration.
  CONFIG.RECLAIM = RECLAIM;

  // Define custom Document classes
  CONFIG.Cards.documentClass = ReclaimConnectedCards;
  CONFIG.Card.documentClass = ReclaimCard;
  CONFIG.ChatMessage.documentClass = ReclaimChatMessage;
  CONFIG.User.documentClass = ReclaimUser;

  CONFIG.Token.objectClass = ReclaimToken;
  CONFIG.ui.sidebar = ReclaimSidebar;

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

  // Instantiate custom GUI elements
  window.PickRoleForm = ReclaimPickRoleForm;

  // Propagate init to other js modules

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
} );

Hooks.once( `ready`, async function() {
  game.canvas.hud.token = new ReclaimTokenHUD();

  UserCardsManager.onReady();
  setupHotbar();
  setupOwnership();
  checkGameState();

  // Disable default pause when starting module
  if ( game.paused ) {
    game.togglePause( false );
  }
} ); // End hook ready

/**
 * Sets the ownership for all actors, cards, journals and macros to Owner for all players
 */
function setupOwnership() {
  for ( let cards of game.cards ) {
    correctDefaultOwnership( cards );
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

  let hotbar = game.macros.apps.find( app => app.options.id === `hotbar` );
  for ( let slot of hotbar.macros ) {
    correctDefaultOwnership( slot.macro );
  }
}

/**
 *
 * If default ownership not set to CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER, sets to CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER.
 *
 * @param {Document} document
 */
function correctDefaultOwnership( document ) {
  if ( !document ) {
    return;
  }

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

/**
 * Adds all macros from the Reclaim Macros folder to all users hotbars.
 */
async function setupHotbar() {
  let hotbar = game.macros.apps.find( app => app.options.id === `hotbar` );
  let macrosDirectory = game.macros.apps.find( app => app.options.id === `macros` );
  let reclaimMacroFolder = macrosDirectory.folders.find( folder => folder.name === RECLAIM.FoundryFolderNames.Macros );
  let reclaimMacros;

  if ( !reclaimMacroFolder ) {
    let macroPack = game.packs.find( pack => pack.title === `Reclaim Macros` );
    reclaimMacros = await macroPack.importAll( { folderName: RECLAIM.FoundryFolderNames.Macros } );
  } else {
    reclaimMacros = reclaimMacroFolder.contents;
  }

  if ( !reclaimMacros || !Array.isArray( reclaimMacros ) || reclaimMacros.length < 1 ) {
    console.error( `Failed to set up Reclaim macros` );
    return;
  }

  for ( let macro of reclaimMacros ) {
    let foundMacro = hotbar.macros.find( barMacro => barMacro.macro?.id === macro.id );

    if ( foundMacro ) {
      continue; // Macro already in hotbar
    }

    let emptyPosition = hotbar.macros.find( slot => {
      if ( slot.macro ) {
        return false;
      }

      return true;
    } );

    await game.user.assignHotbarMacro( macro, emptyPosition.slot );
  }
}

/**
 * Goes through all the users and checks if they have a valid derrivedRole.
 * If not, displays dialog requesting users to pick roles.
 */
async function checkGameState() {
  let allUserValid = true;
  for ( const user of game.users ) {
    user.canModifyRole = ( game.users.current.isGM || user.isSelf );
    if ( !user.derivedRole ) {
      allUserValid = false;
    }
  }

  if ( !allUserValid ) {
    let form = new ReclaimPickRoleForm( game.users );
    form.render( true );
  }
}

