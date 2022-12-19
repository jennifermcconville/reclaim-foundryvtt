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

    const connectedDeck = this.object.getFlag( game.system.id, RECLAIM.Flags.ConnectedDeckId );
    let autoDrawLimit = this.object.getFlag( game.system.id, RECLAIM.Flags.AutoDrawLimit );
    if ( !autoDrawLimit ) {
      autoDrawLimit = 0;
    }

    let deckBinderHtmlString =
      `<div class="reclaim-deckBinder">
      <header class="reclaim-deckBinder-header flexrow">
        <span class="deck">Auto draw from deck</span>
        <span class="number">Untill</span>
      </header>
      <div class="form-fields flexrow">
        <select class="deck" name="${RECLAIM.Flags.ConnectedDeckId}" >
          <option value="">-</option>`;

    let allDecks = game.cards.filter( collection => collection.type === `deck` );
    allDecks.forEach( deck => {
      const selected = ( deck.id === connectedDeck ) ? ` selected` : ``;

      deckBinderHtmlString +=
        `
          <option value="${deck.id}"${selected}>${deck.name}</option>`;
    } );

    deckBinderHtmlString +=
      `</select>
        <input class="number" type="number" value="${autoDrawLimit}" step="1" name="${RECLAIM.Flags.AutoDrawLimit}" min="0">
      </div>
    </div>`;

    let deckBinderElement = $.parseHTML( deckBinderHtmlString );
    let deckBinderFooter = html.children( `footer` );
    deckBinderFooter.before( deckBinderElement[ 0 ] );

    super.activateListeners( html );
  }

  /**
   * Submit the contents of a Form Application, processing its content as defined by the Application
   * @override
   *
   * @param {object} [options]        Options passed to the _onSubmit event handler
   * @returns {FormApplication}       Return a self-reference for convenient method chaining
   */
  async submit( options = {} ) {
    return super.submit( options );
  }
}
