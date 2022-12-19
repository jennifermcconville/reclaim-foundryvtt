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

    let reclaimFlags = {};
    reclaimFlags[ RECLAIM.Flags.ConnectedDeckId ] = data[ RECLAIM.Flags.ConnectedDeckId ];
    reclaimFlags[ RECLAIM.Flags.AutoDrawLimit ] = data[ RECLAIM.Flags.AutoDrawLimit ];

    data.flags = {};
    data.flags[ game.system.id ] = reclaimFlags;

    super.update( data );
  }

  /**
   * Using data from flags on this document, this function will draw random cards into this
   * hand from the deck with id RECLAIM.FlagConnectedDeck untill number RECLAIM.FlagAutoDrawLimit is reached.
   *
   * @param {Array.ReclaimConnectedCards} connectedHands Card hands that should be refilled
   */
  static async autoDrawCardLimit( connectedHands ) {
    if ( !Array.isArray( connectedHands ) ) {
      if ( !( connectedHands instanceof ReclaimConnectedCards ) ) {
        return;
      }
      connectedHands = [connectedHands];
    }

    connectedHands.forEach( hand => {
      const drawLimit = hand.getFlag( game.system.id, RECLAIM.Flags.AutoDrawLimit );
      const sourceCardsId = hand.getFlag( game.system.id, RECLAIM.Flags.ConnectedDeckId );

      if ( !drawLimit || !sourceCardsId || hand.ongoingAutoDraw ) {
        return;
      }

      hand.ongoingAutoDraw = true;
      const sourceCards = game.cards.get( sourceCardsId );
      hand.draw( sourceCards, ( drawLimit - hand.cards.size ) );
      hand.ongoingAutoDraw = false;
    } );
  }

  async pass( to, ids, { updateData = {}, action = `pass`, chatNotification = true } = {} ) {
    const result = await super.pass( to, ids, { updateData, action, chatNotification } );
    ReclaimConnectedCards.autoDrawCardLimit( this );
    return result;
  }
}
