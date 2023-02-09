/* eslint-disable no-undef */
import { RECLAIM } from "./config.mjs";

Hooks.on( `updateScene`, scene => {
  console.debug( `Reclaim Card Hand State` );
} );

export class ReclaimCardHandState {

  static #stateMachine = null;

  static async init() {
    ReclaimCardHandState.stateMachine = new StateMachine( {
      init: `farmerCardHands`,
      transitions: [
        { name: `toNextRole`, from: `farmerCardHands`, to: `contractorCardHands` }
      ]
    } );
  }

}
