/* eslint-disable no-undef */
import { RECLAIM } from "./config.mjs";

Hooks.on( `updateScene`, ( scene, changes ) => {
  if ( !scene.active ) {
    return;
  }

  if ( typeof changes.flags?.reclaim?.[ RECLAIM.Flags.UserSceneRole ] === `undefined` ) {
    return;
  }

  game.reclaim.cardHandState.updateDisplayedHands( scene );
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
    const currentUserRole = RECLAIM.Helpers.getUserSceneRole( scene, user );
    const roleDecks = this.#roleDecks.get( currentUserRole );

    // Preper new flag map
    let newDecks = {
      "CardsID-0": RECLAIM.Helpers.getUserDeck( user )
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
}
