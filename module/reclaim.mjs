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

/**
 * @typedef {Object} CardFolders
 * @property {Folder} cardHands A reference to the automatically created Card Hand folder
 * @property {Folder} playerHands A reference to the automatically created subfolder to cardHands, which
 * is meant to contain all player owned Card Hands.
 */

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

  const cardFolders = await ensureCardFolders(
    RECLAIM.FoundryFolderNames.CardHands,
    RECLAIM.FoundryFolderNames.PlayerCardHands
  );

  await game.users.forEach( user => {
    console.debug( `Processing user ${user.id}` );
    let flag = user.getFlag( game.system.id, RECLAIM.Flags.UserCardHandId );
    if ( !flag ) {
      createUserCardHand( user, cardFolders );
    }

    let userHand = game.cards.find( cardHand => cardHand.id === flag );
    if ( !userHand ) {
      userHand = createUserCardHand( user, cardFolders );
    }

    assingToMiniCardHand( user, userHand );
  } );

  Hooks;
} );

Hooks.on( `renderApplication`, async function( ...args ) {
  console.debug( `Heard a renderApplication hook!` );
} );

Hooks.on( `renderHandMiniBarWindow`, async function( ...args ) {
  console.debug( `Heard a renderHandMiniBarWindow hook!` );
} );


/**
 * Make sure that the hand is displayed as the bottom card collection of hand-mini-bar for this user.
 * @param {User}user
 * @param {Cards}hand
 */
async function assingToMiniCardHand( user, hand ) {
  console.debug( `Assigning card hand ${hand.id} to user's ${user.id} mini bar...` );
  HandMiniBarModule.handMiniBarList[ 0 ];
}

/**
 * Creates a new Hand and assigns this user it's Id via flag. Also makes sure mini-card-hand displays it as the bottom
 *  card collection
 *
 * @param {User} user
 * @param {CardFolders} cardFolders
 * @returns {Cards}
 */
async function createUserCardHand( user, cardFolders ) {
  console.debug( `Creating new card hand for user ${user.id}.` );
  if ( !user || !cardFolders || !cardFolders.playerHands ) {
    return;
  }

  const newHand = await ReclaimConnectedCards.create( {
    name: `${user.name} Hand`,
    folder: cardFolders.playerHands
  } );

  user.setFlag( game.system.id, RECLAIM.Flags.UserCardHandId, newHand.id );

  return newHand;
}

/**
 * Ensures that the Cards tab in Foundry has a folder to contain card hands
 * with a subfolder from player card hands.
 * @param {string} cardHandFolderName
 * @param {string} playerHandSubfolderName
 *
 * @returns {CardFolders}
 */
async function ensureCardFolders( cardHandFolderName, playerHandSubfolderName ) {
  let cardHandsFolder = game.folders.find( folder => folder.name === cardHandFolderName );
  let playerHandsFolder = game.folders.find( folder => folder.name === playerHandSubfolderName );

  if ( !cardHandsFolder ) {
    cardHandsFolder = Folder.create( {
      name: cardHandFolderName,
      type: `Cards` }
    );
  }

  if ( !playerHandsFolder ) {
    playerHandsFolder = await Folder.create( {
      name: playerHandSubfolderName,
      type: `Cards`,
      parent: cardHandsFolder
    } );
  }

  return {
    cardHands: cardHandsFolder,
    playerHands: playerHandsFolder
  };


  // TODO give / create a card hand to the user
  // make sure his mini-card-hand displays it
}

