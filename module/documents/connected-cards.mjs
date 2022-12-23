/* eslint-disable no-undef */

import { RECLAIM } from "..//helpers/config.mjs";

/**
 * @extends {Cards}
 */
export class ReclaimConnectedCards extends Cards {

  /**
   * @override
   * @inheritdoc
   */
  async recall( options ) {
    let result = super.recall( options );

    this.setFlag( game.system.id, RECLAIM.Flags.ConnectedDeckArray, null );

    return result;
  }

  async pass( to, ids, { updateData = {}, action = `pass`, chatNotification = true } = {} ) {
    const result = await super.pass( to, ids, { updateData, action, chatNotification } );
    ReclaimConnectedCards.autoDrawCards( this );
    return result;
  }

  /**
   * Using data from flags on this document, this function will draw random cards into this
   * hand from the deck with id RECLAIM.FlagConnectedDeck untill number RECLAIM.FlagAutoDrawLimit is reached.
   *
   * @param {Array.ReclaimConnectedCards} connectedHands Card hands that should be refilled
   */
  static async autoDrawCards( connectedHands ) {
    if ( !Array.isArray( connectedHands ) ) {
      if ( !( connectedHands instanceof ReclaimConnectedCards ) ) {
        return;
      }
      connectedHands = [connectedHands];
    }

    connectedHands.forEach( hand => ReclaimConnectedCards.autoDrawHandCards( hand ) );
  }

  static async autoDrawHandCards( hand ) {
    const connectionsArray = hand.getFlag( game.system.id, RECLAIM.Flags.ConnectedDeckArray );
    if ( !connectionsArray || hand.ongoingAutoDraw ) {
      return;
    }

    hand.ongoingAutoDraw = true;
    connectionsArray.forEach( connection => ReclaimConnectedCards._autoDrawConnection( hand, connection ) );
    hand.ongoingAutoDraw = false;
  }

  static async _autoDrawConnection( hand, connection ) {

    // Early out
    const sourceDeckId = connection[ RECLAIM.Flags.ConnectedDeckId ];
    const drawLimit = connection[ RECLAIM.Flags.AutoDrawLimit ];
    if ( !drawLimit || !sourceDeckId ) {
      return;
    }
    const nbrToDraw = drawLimit - hand.cards.filter( card => card.origin.id === sourceDeckId ).length;
    if ( nbrToDraw <= 0 ) {
      return;
    }

    const sourceDeck = game.cards.get( sourceDeckId );
    hand.draw( sourceDeck, nbrToDraw, { how: CONST.CARD_DRAW_MODES.RANDOM } );

  }

  static async onUpdateCards( options ) {
    if ( !options ) {
      return;
    }

    ReclaimConnectedCards.autoDrawCards( options );
  }
}

Hooks.once( `init`, async function() {
  console.debug( `Initialising Reclaim Connected Cards hooks.` );
  Hooks.on( `updateCards`, ReclaimConnectedCards.onUpdateCards );
} );
