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
    let connectionFlagArray = [];

    // ReclaimFlags[ RECLAIM.Flags.ConnectedDeckId ] = data[ RECLAIM.Flags.ConnectedDeckId ];
    // reclaimFlags[ RECLAIM.Flags.AutoDrawLimit ] = data[ RECLAIM.Flags.AutoDrawLimit ];

    let connectionIndex = 0;
    let connectedDeckId = data[ `${RECLAIM.InputFields.ConnectedDeckId}${connectionIndex}` ];
    let autoDrawLimit = data[ `${RECLAIM.InputFields.AutoDrawLimit}${connectionIndex}` ];

    // Exit loop if potential connection invalid
    while ( connectedDeckId && autoDrawLimit ) {

      // Push connection to array
      let connection = {};
      connection[ RECLAIM.Flags.ConnectedDeckId ] = connectedDeckId;
      connection[ RECLAIM.Flags.AutoDrawLimit ] = autoDrawLimit;
      connectionFlagArray.push( connection );

      // Load next potential connection
      connectionIndex++;
      connectedDeckId = data[ `${RECLAIM.InputFields.ConnectedDeckId}${connectionIndex}` ];
      autoDrawLimit = data[ `${RECLAIM.InputFields.AutoDrawLimit}${connectionIndex}` ];
    }

    // Save array to this Document's system flags
    reclaimFlags[ RECLAIM.Flags.ConnectedDeckArray ] = connectionFlagArray;
    data.flags = {};
    data.flags[ game.system.id ] = reclaimFlags;

    super.update( data );

    ReclaimConnectedCards.autoDrawCardLimit( this );
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
      const connectionsArray = hand.getFlag( game.system.id, RECLAIM.Flags.ConnectedDeckArray );
      if ( !connectionsArray ) {
        return;
      }

      connectionsArray.forEach( connection => {
        const sourceDeckId = connection[ RECLAIM.Flags.ConnectedDeckId ];
        const drawLimit = connection[ RECLAIM.Flags.AutoDrawLimit ];

        if ( !drawLimit || !sourceDeckId || hand.ongoingAutoDraw ) {
          return;
        } // Early out if data invalid

        const nbrToDraw = drawLimit - hand.cards.filter( card => card.origin.id === sourceDeckId ).length;
        if ( nbrToDraw <= 0 ) {
          return;
        }

        hand.ongoingAutoDraw = true;
        const sourceDeck = game.cards.get( sourceDeckId );
        hand.draw( sourceDeck, nbrToDraw );
        hand.ongoingAutoDraw = false;
      } );

    } );
  }

  async pass( to, ids, { updateData = {}, action = `pass`, chatNotification = true } = {} ) {
    const result = await super.pass( to, ids, { updateData, action, chatNotification } );
    ReclaimConnectedCards.autoDrawCardLimit( this );
    return result;
  }
}
