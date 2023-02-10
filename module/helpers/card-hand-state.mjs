/* eslint-disable no-undef */
import { RECLAIM } from "./config.mjs";

Hooks.on( `updateScene`, scene => {
  console.debug( `Reclaim Card Hand State` );
} );

export class ReclaimCardHandState {

  #usersCardsState = null;

  ReclaimCardHandState() {
    let template = new StateMachine( {
      init: RECLAIM.SceneRoles.Observer,
      transitions: [
        { name: `toFarmer`, from: `*`, to: RECLAIM.SceneRoles.Farmer },
        { name: `toHousing`, from: `*`, to: RECLAIM.SceneRoles.Housing },
        { name: `toTreatment`, from: `*`, to: RECLAIM.SceneRoles.Treatment },
        { name: `toContractor`, from: `*`, to: RECLAIM.SceneRoles.Contractor },
        { name: `toObserver`, from: `*`, to: RECLAIM.SceneRoles.Observer }
      ]
    } );
  }

  async init() {
    let revealedCardsFolder = game.folders.find( folder => folder.name === RECLAIM.FoundryFolderNames.RevealedCards );
    if ( !revealedCardsFolder ) {
      return;
    }

    let nameIdDeckMap = new Map();
    for ( const deck of revealedCardsFolder.content ) {
      nameIdDeckMap.set( deck.name, deck.id );
    }

    let farmerDecks = [
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.FarmLevel1 ),
      nameIdDeckMap.get( RECLAIM.DeckNames.Revealed.FarmLevel2 )
    ];

    console.debug( `` );
  }

}
