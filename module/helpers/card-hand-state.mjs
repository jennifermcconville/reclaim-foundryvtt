/* eslint-disable no-undef */
import { RECLAIM } from "./config.mjs";
import { HelperFunctions } from "./helper-functions.mjs";
import { ReclaimConnectedCards } from "../documents/connected-cards.mjs";

Hooks.on( `updateUser`, ( user, changes ) => {
  if ( !user.isSelf ) {
    return;
  }

  const activeScene = game.scenes.active;
  if ( typeof changes.flags?.reclaim?.[ RECLAIM.Flags.UserSceneRole ][ activeScene.id ] === `undefined` ) {
    return;
  }

  game.reclaim.cardHandState.updateDisplayedHands( activeScene );
} );

Hooks.once( `ready`, () => {
  ReclaimCardHandState.setupCards();
} );

export class ReclaimCardHandState {

  #roleDecks = new Map();

  async init() {
    let revealedCardsFolder = game.folders.find( folder => folder.name === RECLAIM.FoundryFolderNames.RevealedCards );
    if ( !revealedCardsFolder ) {
      if ( game.users.current.isGM ) {
        ui.notifications.error( `"Reclaim Reveled Cards" card folder not found, please import it from the compendium.` );
      }
      return;
    }

    let nameIdDeckMap = new Map();
    for ( const deck of revealedCardsFolder.contents ) {
      nameIdDeckMap.set( deck.name, deck.id );
    }

    this.#roleDecks.set( RECLAIM.SceneRoles.Farmer, [
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.Cost ),
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.FarmLevel1 ),
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.FarmLevel2 ),
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.Transportation )
    ] );
    this.#roleDecks.set( RECLAIM.SceneRoles.Housing, [
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.Cost ),
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.HousingLevel1 ),
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.HousingLevel2 ),
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.Transportation )
    ] );
    this.#roleDecks.set( RECLAIM.SceneRoles.Treatment, [
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.Cost ),
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.TreatmentLevel1 ),
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.TreatmentLevel2 ),
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.Transportation )
    ] );
    this.#roleDecks.set( RECLAIM.SceneRoles.Contractor, [
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.Cost ),
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.FarmLevel1 ),
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.FarmLevel2 ),
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.HousingLevel1 ),
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.HousingLevel2 ),
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.TreatmentLevel1 ),
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.TreatmentLevel2 ),
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.Transportation )
    ] );
    this.#roleDecks.set( RECLAIM.SceneRoles.Observer, [
    ] );
  }

  async updateDisplayedHands( scene ) {
    if ( !scene ) {
      return;
    }

    const user = game.users.current;
    const currentUserRole = HelperFunctions.getUserSceneRole( scene, user );
    if ( !currentUserRole ) {
      return;
    }

    const roleDecks = this.#roleDecks.get( currentUserRole );

    // Preper new flag map
    let newDecks = {
      "CardsID-0": HelperFunctions.getUserDeck( user )
    };
    for ( let index = 0; index < roleDecks.length; index++ ) {
      newDecks[ `CardsID-${index + 1}` ] = roleDecks[ index ];
    }
    let newDecksNbr = Object.keys( newDecks ).length;

    // Remove all old flag data
    await user.update( {
      flags: {
        [ HandMiniBarModule.moduleName ]: null
      }
    } );

    // Add all flags in one update call
    await user.update( {
      flags: {
        [ HandMiniBarModule.moduleName ]: newDecks
      }
    } );

    game.settings.set( HandMiniBarModule.moduleName, `HandCount`, newDecksNbr );
  }

  /**
   * Checks if the card piles nececary for gameplay are prepared, attempts to import otherwise.
   * Creates missing private player hands if missing
   * Places a random Hidden Agenda card in private player hands if not present
   * Fills all revealed card pilles with drawn cards
   */
  static async setupCards() {
    const cardFolders = await ReclaimCardHandState.createCardFolders(
      RECLAIM.FoundryFolderNames.CardHands,
      RECLAIM.FoundryFolderNames.PlayerCardHands
    );

    await game.users.forEach( user => {
      ReclaimCardHandState.createPlayerHand( user, cardFolders );
      ReclaimCardHandState.drawHiddenAgenda( user );
    } );

    // Refill all card hands
    ReclaimConnectedCards.autoDrawCards( game.cards.contents );
  }

  /**
   *
   * If not present in user's Card Hand, draws a random Hidden Agenda
   *
   * @param {User} user
   */
  static drawHiddenAgenda( user ) {
    let flag = user.getFlag( game.system.id, RECLAIM.Flags.UserCardHandId );
    if ( !flag ) {
      return;
    }

    let userCardHand = game.cards.find( cardHand => cardHand.id === flag );
    if ( !userCardHand ) {
      return;
    }

    for ( const card of userCardHand.availableCards ) {
      if ( card.origin.name === `Hidden Agenda` ) {
        return; // Early out if player has a Hidden Agenda card already
      }
    }

    // Draw random Hidden Agenda card to player hand
    let hiddenAgendaDeck = game.cards.find( deck => deck.name === `Hidden Agenda` );

    if ( hiddenAgendaDeck ) {
      userCardHand.draw( hiddenAgendaDeck, 1, { how: CONST.CARD_DRAW_MODES.RANDOM } );
    }
  }

  /**
   *
   * If one doesn't exist, creates a Card Hand and assigns it to a user Mini Card Hand, first slot.
   *
   * @param {User} user
   * @param {Folder} cardFolders
   */
  static createPlayerHand( user, cardFolders ) {
    let flag = user.getFlag( game.system.id, RECLAIM.Flags.UserCardHandId );
    if ( !flag ) {
      ReclaimCardHandState.createUserCardHand( user, cardFolders );
    }

    let userHandPromise = game.cards.find( cardHand => cardHand.id === flag );
    if ( !userHandPromise ) {
      userHandPromise = ReclaimCardHandState.createUserCardHand( user, cardFolders );
    }

    // Adding new hand to hand-mini-bar handled by ReclaimCardHandState
  }

  /**
   * Creates a new Hand and assigns this user it's Id via flag. Also makes sure mini-card-hand displays it as the bottom
   *  card collection
   *
   * @param {User} user
   * @param {CardFolders} cardFolders
   * @returns {Cards}
   */
  static async createUserCardHand( user, cardFolders ) {
    if ( !user || !cardFolders || !cardFolders.playerHands ) {
      return;
    }

    const newHand = await ReclaimConnectedCards.create( {
      name: `${user.name} Hand`,
      folder: cardFolders.playerHands,
      type: `hand`,
      ownership: {
        default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
      }
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
  static async createCardFolders( cardHandFolderName, playerHandSubfolderName ) {
    let cardHandsFolder = game.folders.find( folder => folder.name === cardHandFolderName );
    let playerHandsFolder = game.folders.find( folder => folder.name === playerHandSubfolderName );

    if ( !cardHandsFolder ) {
      cardHandsFolder = await Folder.create( {
        name: cardHandFolderName,
        type: `Cards` }
      );
    }

    if ( !playerHandsFolder ) {
      playerHandsFolder = await Folder.create( {
        name: RECLAIM.FoundryFolderNames.PlayerCardHands,
        type: `Cards`,
        parent: cardHandsFolder
      } );
    }

    return {
      cardHands: cardHandsFolder,
      playerHands: playerHandsFolder
    };
  }
}
