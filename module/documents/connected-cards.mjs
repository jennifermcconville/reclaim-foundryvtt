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
    reclaimFlags[ RECLAIM.FlagConnectedDeck ] = data.boundDeck;
    reclaimFlags[ RECLAIM.FlagAutoDrawLimit ] = data.autoDrawLimit;

    data.flags = {};
    data.flags[ game.system.id ] = reclaimFlags;

    super.update( data );
  }
}
