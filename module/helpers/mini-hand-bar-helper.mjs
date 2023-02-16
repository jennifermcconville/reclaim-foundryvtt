/* eslint-disable no-undef */

import HandMiniBar from "../../../../modules/hand-mini-bar/scripts/hand-mini-bar.js";

export class ReclaimMiniHandBarHelper {

  /**
   * Fix for hand-mini-bar module which caused doubles of each HandMiniBar
   * to be added to HandMiniBarModule.handMiniBarList
   */
  static fixHandMiniBar() {
    const fixedFunction = function( value ) { // Value is the new value of the setting
      if ( value > HandMiniBarModule.handMax ) {
        value = HandMiniBarModule.handMax;
      }

      if ( value > HandMiniBarModule.handMiniBarList.length ) {
        let more = value - HandMiniBarModule.handMiniBarList.length;
        for ( let i = 0; i < more; i++ ) {
          new HandMiniBar( HandMiniBarModule.handMiniBarList.length ); // Pushes itself into list as part of constructor;
        }
      } else {// Remove some may need additional cleanup
        let less = HandMiniBarModule.handMiniBarList.length - value;
        for ( let i = 0; i < less; i++ ) {
          HandMiniBarModule.handMiniBarList.pop().remove();
        }
      }
    };

    window.HandMiniBarModule.updateHandCount = fixedFunction;

    game.settings.register( HandMiniBarModule.moduleName, `HandCount`, {
      name: game.i18n.localize( `HANDMINIBAR.HandCountSetting` ),
      hint: game.i18n.localize( `HANDMINIBAR.HandCountSettingHint` ),
      scope: `client`,     // "world" = sync to db, "client" = local storage
      config: true,       // False if you dont want it to show in module config
      type: Number,       // Number, Boolean, String,
      default: 1,
      range: {             // If range is specified, the resulting setting will be a range slider
        min: 0,
        max: 10,
        step: 1
      },
      onChange: fixedFunction,
      filePicker: false  // Set true with a String `type` to use a file picker input
    } );
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

      const result = operation( uiSlotId, idOfOccupant, ...args );
      if ( typeof result !== `undefined` ) {
        results.push( result );
      }
    }
    return results;
  }
}
