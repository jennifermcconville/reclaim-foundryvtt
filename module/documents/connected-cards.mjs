/* eslint-disable no-undef */

import { RECLAIM } from "..//helpers/config.mjs";

/**
 * @extends {Cards}
 */
export class ReclaimConnectedCards extends Cards {

  /**
   * @override
   * @param {*} data
   */
  update( data ) {
    super.update( data );

    ReclaimConnectedCards.autoDrawCards( this );
  }

  /**
   * @override
   * @param {object} [options={}]                       Options which modify the recall operation
   * @param {object} [options.updateData={}]            Modifications to make to each Card as part of the recall
   *                                                    operation, for example the displayed face
   * @param {boolean} [options.chatNotification=true]   Create a ChatMessage which notifies that this action has
   *                                                    occurred
   * @returns {Promise<Cards>}                          The Cards document after the recall operation has completed.
   */
  async recall( options ) {
    debugger;

    this.setFlag( game.system.id, RECLAIM.Flags.ConnectedDeckArray, null );

    return super.recall( options );
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
    hand.draw( sourceDeck, nbrToDraw );

  }

  async pass( to, ids, { updateData = {}, action = `pass`, chatNotification = true } = {} ) {
    const result = await super.pass( to, ids, { updateData, action, chatNotification } );
    ReclaimConnectedCards.autoDrawCards( this );
    return result;
  }
}
