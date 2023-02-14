/* eslint-disable no-undef */

import { RECLAIM } from "./config.mjs";

export class ReclaimMiniHandBarHelper {
  static async removeAllDecksFromUi( user ) {
    if ( !user ) {
      return;
    }

    ReclaimMiniHandBarHelper.iterateUiSlots( user, ( uiSlotId, _uiSlotContent ) => {
      user.unsetFlag( HandMiniBarModule.moduleName, uiSlotId );
    } );
  }

  static async addDecksToUi( user, decksArray, showUserDeck = true ) {
    if ( !decksArray ) {
      return;
    }

    let decksIndex = 0;
    if ( showUserDeck ) {
      const userDeckId = [user.getFlag( game.system.id, RECLAIM.Flags.UserCardHandId )];
      decksArray = userDeckId.concat( decksArray );
    }

    for ( let uiIndex = 0; uiIndex <= 9; uiIndex++ ) {
      if ( decksIndex >= decksArray.length ) { // Early out if deck empty or out when end of deck reached
        return;
      }

      let uiSlotId = `CardsID-${uiIndex}`;
      let idOfOccupant = user.getFlag( HandMiniBarModule.moduleName, uiSlotId );

      if ( !idOfOccupant ) {
        await user.setFlag( HandMiniBarModule.moduleName, uiSlotId, decksArray[ decksIndex ] );
        decksIndex++;
      }
    }
  }

  static async consolidateDecks( user ) {
    let displayedDecks = this.iterateUiSlots( user, ( _slotId, slotContent ) => {
      if ( typeof slotContent !== `undefined` && slotContent !== null ) {
        return slotContent;
      }
    } );

    let counter = { value: 0 };
    this.iterateUiSlots( user, ( slotId, _slotContent, deckArray, index ) => {
      if ( index.value < deckArray.length ) {
        user.setFlag( HandMiniBarModule.moduleName, slotId, deckArray[ index.value ] );
        index.value++;
        return;
      }
      user.unsetFlag( HandMiniBarModule.moduleName, slotId );
    }, displayedDecks, counter );
  }

  static updateDisplayedDecksNumber( user ) {
    let decksDisplayed = this.iterateUiSlots( user, ( _slotId, slotContent ) => {
      if ( typeof slotContent !== `undefined` && slotContent != null ) {
        return slotContent;
      }
    } );
    let displayedCount = decksDisplayed.length;
    window.HandMiniBarModule.updateHandCount( displayedCount );
  }

  /**
   *  Iterates over each hand ui slot and executes the operation function using it's key - value pair
   *
   * @param {User} user
   * @param {function (uiSlotId, uiSlotContent, ...args) {}} operation
   * @param {...any} args
   */
  static iterateUiSlots( user, operation, ...args ) {
    let results = [];
    for ( let uiIndex = 0; uiIndex <= 9; uiIndex++ ) {
      let uiSlotId = `CardsID-${uiIndex}`;
      let idOfOccupant = user.getFlag( HandMiniBarModule.moduleName, uiSlotId );

      let result = operation( uiSlotId, idOfOccupant, ...args );
      if ( typeof result !== `undefined` ) {
        results.push( result );
      }
    }
    return results;
  }
}
