/* eslint-disable no-undef */
import { RECLAIM } from "./config.mjs";
import { ReclaimMiniHandBarHelper as HandbarHelper } from "./mini-hand-bar-helper.mjs";

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
    const currentUserRole = ReclaimCardHandState.getCurrentUserRole( scene, user );

    // Remove all decks belonging to other roles
    // for ( const roleKey in RECLAIM.SceneRoles ) {
    // }
    await HandbarHelper.removeAllDecksFromUi( user ).then( () => {
      return HandbarHelper.addDecksToUi( user, this.#roleDecks.get( currentUserRole ) );
    } ).then( () => {
      return HandbarHelper.consolidateDecks( user );
    } ).then( () => {
      return HandbarHelper.updateDisplayedDecksNumber( user );
    } ).then( () => {
      window.HandMiniBarModule.updatePlayerHands();
    } );
  }

  static getCurrentUserRole( scene, user ) {
    let assignedRoles = scene.getFlag( game.system.id, RECLAIM.Flags.UserSceneRole );
    return assignedRoles[ user.id ];
  }
}
