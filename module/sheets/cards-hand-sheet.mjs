/* eslint-disable no-undef */

import { RECLAIM } from "../helpers/config.mjs";

/**
 * @extends {CardsHand}
 */
export class ReclaimCardsHandSheet extends CardsHand {

  /**
   * @override
   * @param {*} html
   */
  activateListeners( html ) {

    const connectedDecksArray = this.object.getFlag( game.system.id, RECLAIM.Flags.ConnectedDeckArray );
    let connectionFieldCount = 4; // Make this line connectedDecksArray ? connectedDecksArray.length : 1; to make dynamic
    const allDecks = game.cards.filter( collection => collection.type === `deck` );
    const allDecksLength = allDecks.length;

    let deckBinderHtmlString =
      `<div class="reclaim-deckBinder">
      <header class="reclaim-deckBinder-header flexrow">
        <span class="deck">Auto draw from deck</span>
        <span class="number">Untill</span>
      </header>`;

    // Loop creates connectionFieldCount select and input elements
    for ( let selectIndex = 0; selectIndex < connectionFieldCount; selectIndex++ ) {
      const connection = connectedDecksArray[ selectIndex ];
      const connectedDeckId = connection ? connection[ RECLAIM.Flags.ConnectedDeckId ] : null;
      const autoDrawLimit = connection ? connection[ RECLAIM.Flags.AutoDrawLimit ] : null;

      deckBinderHtmlString += `
      <div class="form-fields flexrow">
        <select class="deck" name="${RECLAIM.InputFields.ConnectedDeckId}${selectIndex}" >
          <option value="">-</option>`;

      // Loop fills select element with all card deck values
      for ( let optionIndex = 0; optionIndex < allDecksLength; optionIndex++ ) {
        let deck = allDecks[ optionIndex ];
        const selected = ( deck.id === connectedDeckId ) ? ` selected` : ``;

        deckBinderHtmlString +=
          `
          <option value="${deck.id}"${selected}>${deck.name}</option>`;
      }

      deckBinderHtmlString +=
      `</select>
        <input class="number" type="number" value="${autoDrawLimit}" step="1" name="${RECLAIM.InputFields.AutoDrawLimit}${selectIndex}" min="0" />
      </div>`;
    }

    deckBinderHtmlString += `
      </div>`;

    let deckBinderElement = $.parseHTML( deckBinderHtmlString );
    let deckBinderFooter = html.children( `footer` );
    deckBinderFooter.before( deckBinderElement[ 0 ] );

    super.activateListeners( html );
  }
}
