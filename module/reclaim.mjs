/* eslint-disable no-undef */

// Import application classes
import { ReclaimSidebar } from "./apps/sidebar.mjs";
import { ReclaimChatLog } from "./apps/chat-log.mjs";
import { ReclaimHotbar } from "./apps/hotbar.mjs";

// Import document classes.
import { ReclaimActor } from "./documents/actor.mjs";
import { ReclaimToken } from "./documents/token.mjs";
import { ReclaimConnectedCards } from "./documents/connected-cards.mjs";
import { ReclaimCard } from "./documents/card.mjs";
import { ReclaimChatMessage } from "./documents/chatt-message.mjs";

// Import sheet classes.
import { ReclaimCardsHandSheet } from "./sheets/cards-hand-sheet.mjs";
import { ReclaimCardConfig } from "./sheets/card-config-sheet.mjs";
import { RelcaimTokenConfig } from "./placables/reclaim-token-config.mjs";
import { ReclaimSceneConfig } from "./sheets/scene-config.mjs";

// Import placable classes.
import { ReclaimTokenHUD } from "./placables/reclaim-token-hud.mjs";

// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { RECLAIM } from "./helpers/config.mjs";
import { UserCardsManager } from "./helpers/user-cards-manager.mjs";
import { ReclaimSceneRoleValidator } from "./helpers/scene-role-validator.mjs";
import { ReclaimCardHandState } from "./helpers/card-hand-state.mjs";
import { ReclaimMiniHandBarHelper } from "./helpers/mini-hand-bar-helper.mjs";

Hooks.once( `init`, async function() {

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.reclaim = {
    ReclaimActor,
    ReclaimCard,
    ReclaimCardsHandSheet,
    ReclaimCardHandState,
    ReclaimCardConfig,
    ReclaimChatLog,
    ReclaimChatMessage,
    ReclaimConnectedCards,
    ReclaimHotbar,
    ReclaimSceneConfig,
    ReclaimSidebar,
    ReclaimToken,
    RelcaimTokenConfig,
    ReclaimTokenHUD,
    ReclaimSceneRoleValidator
  };

  // Add custom constants for configuration.
  CONFIG.RECLAIM = RECLAIM;

  CONFIG.ui.chat = ReclaimChatLog;

  // Define custom Document classes
  CONFIG.Actor.documentClass = ReclaimActor;
  CONFIG.Cards.documentClass = ReclaimConnectedCards;
  CONFIG.Card.documentClass = ReclaimCard;
  CONFIG.ChatMessage.documentClass = ReclaimChatMessage;
  CONFIG.Token.objectClass = ReclaimToken;
  CONFIG.ui.sidebar = ReclaimSidebar;
  CONFIG.ui.hotbar = ReclaimHotbar;

  // Unregister default sheet
  DocumentSheetConfig.unregisterSheet( Cards, `core`, CardsHand, {
    label: `CARDS.CardsHand`,
    types: [`hand`]
  } );
  DocumentSheetConfig.unregisterSheet( Card, `core`, CardConfig, {
    label: `CARDS.Card`
  } );
  DocumentSheetConfig.unregisterSheet( TokenDocument, `core`, TokenConfig );
  DocumentSheetConfig.unregisterSheet( Scene, `core`, SceneConfig );

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
  DocumentSheetConfig.registerSheet( Scene, `reclaim`, ReclaimSceneConfig, {
    label: `RECLAIM.Scene`,
    makeDefault: true
  } );

  // Propagate init to other js modules


  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
} );

Hooks.once( `ready`, async function() {
  game.canvas.hud.token = new ReclaimTokenHUD();

  UserCardsManager.onReady();
  setupHotbar();
  setupOwnership();

  ApplyDefaultModuleSettings();
  ReclaimMiniHandBarHelper.fixHandMiniBar();

  game.reclaim.cardHandState = new ReclaimCardHandState();
  game.reclaim.cardHandState.init();
  game.reclaim.cardHandState.updateDisplayedHands( game.scenes.current );

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
 * Sets default values for this combination of System and Module
 */
function ApplyDefaultModuleSettings() {
  if ( game.users.current.isGM ) {

    game.settings.set( `hide-player-ui`, `settings`, {
      hideLogo: true,
      hideNavigation: {
        complete: true,
        navToggle: true,
        sceneList: true,
        bossBar: true
      },
      hideControls: false,
      hideSideBar: {
        complete: false,
        chatLog: false,
        combatTracker: true,
        actorsDirectory: false,
        itemsDirectory: true,
        journalEntries: false,
        rollableTables: true,
        cardStacks: false,
        audioPlaylists: true,
        compendiumPacks: true,
        gameSettings: false
      },
      hidePlayers: false,
      hideHotbar: false,
      hidePlayerConfig: false,
      hideTokenHUD: false,
      hideTokenActionHUD: false,
      hideCustomHotbar: false
    } );

    game.settings.set( `hide-player-ui`, `playerConfig`, {
      hideLogo: true,
      hideNavigation: {
        complete: false,
        navToggle: false,
        sceneList: false,
        bossBar: false
      },
      hideControls: false,
      hideSideBar: {
        complete: false,
        chatLog: false,
        combatTracker: true,
        actorsDirectory: false,
        itemsDirectory: true,
        journalEntries: false,
        rollableTables: false,
        cardStacks: false,
        audioPlaylists: true,
        compendiumPacks: false,
        gameSettings: false
      },
      hidePlayers: false,
      hideHotbar: false,
      hidePlayerConfig: false,
      hideTokenHUD: false,
      hideTokenActionHUD: false,
      hideCustomHotbar: false
    } );
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

  if ( !game.users.current.isGM ) {
    return;
  }

  if ( document.ownership.default !== CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER ) {
    document.ownership.default = CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;
    document.update( {
      ownership: document.ownership
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
 *  Initiates a state machine that controlls the message and button on bottom of chat sidebar
 *  It's purpose is to guide the players through the flow of the game and it's rules
 */
async function initGameStateMachine() {
  throw new SyntaxError( `Not implemented` );
}

