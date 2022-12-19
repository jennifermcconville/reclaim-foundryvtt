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

    const connectedDecks = this.object.getFlag( game.system.id, RECLAIM.Flags.ConnectedDeckArray );
    let connectionFieldCount = connectedDecks ? connectedDecks.length : 4;
    const allDecks = game.cards.filter( collection => collection.type === `deck` );

    let deckBinderHtmlString =
      `<div class="reclaim-deckBinder">
      <header class="reclaim-deckBinder-header flexrow">
        <span class="deck">Auto draw from deck</span>
        <span class="number">Untill</span>
      </header>`;

    for ( let count = 0; count < connectionFieldCount; count++ ) {
      const connectedDeckId = connectedDecks ? connectedDecks[ count ].Id : 0;
      const autoDrawLimit = connectedDecks ? connectedDecks[ count ].AutoDrawLimit : 0;

      deckBinderHtmlString +=
      `<div class="form-fields flexrow">
        <select class="deck" name="${RECLAIM.InputFields.ConnectedDeckId}" >
          <option value="">-</option>`;

      // TODO allDecks is an object not an array. Collection? How to iterate?
      for ( let deck in allDecks.entries() ) {
        const selected = ( deck.id === connectedDeckId ) ? ` selected` : ``;

        deckBinderHtmlString +=
          `
          <option value="${deck.id}"${selected}>${deck.name}</option>`;
      }

      deckBinderHtmlString +=
      `</select>
        <input class="number" type="number" value="${autoDrawLimit}" step="1" name="${RECLAIM.InputFields.AutoDrawLimit}" min="0">
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
