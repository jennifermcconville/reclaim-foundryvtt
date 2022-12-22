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
    let deckOptions = ReclaimCardsHandSheet._renderDeckToOptionElements();

    let deckBinderHtmlString =
      `<div class="reclaim-deckBinder">
      <header class="reclaim-deckBinder-header flexrow">
        <span class="deck">Auto draw from deck</span>
        <span class="number">Untill</span>
      </header>`;

    // Loop creates connectionFieldCount select and input elements
    for ( let selectIndex = 0; selectIndex < connectionFieldCount; selectIndex++ ) {
      const connection = connectedDecksArray ? connectedDecksArray[ selectIndex ] : null;
      const connectedDeckId = connection ? connection[ RECLAIM.Flags.ConnectedDeckId ] : null; // Only used to compare if selected
      const autoDrawLimit = connection ? connection[ RECLAIM.Flags.AutoDrawLimit ] : 0; // Allways used as input element value

      deckBinderHtmlString += `
      <div class="form-fields flexrow">
        <select class="deck" name="${RECLAIM.InputFields.ConnectedDeckId}${selectIndex}" >
          <option value="">-</option>`;

      deckBinderHtmlString += ReclaimCardsHandSheet._selectOptionById( deckOptions, connectedDeckId );

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

  /**
   * @override
   */
  async _onSubmit( event, { updateData = null, preventClose = false, preventRender = false } = {} ) {
    const result = super._onSubmit( event, { updateData, preventClose, preventRender } );

    const formData = this._getSubmitData( updateData );

    if ( !formData[ ( `${RECLAIM.InputFields.ConnectedDeckId}0` ) ] ) {
      return result;
    }

    let newConnectionArray = [];
    for ( let flagIndex = 0; flagIndex < 4; flagIndex++ ) {
      newConnectionArray.push( {
        [ `${RECLAIM.Flags.ConnectedDeckId}` ]: formData[ `${RECLAIM.InputFields.ConnectedDeckId}${flagIndex}` ],
        [ `${RECLAIM.Flags.AutoDrawLimit}` ]: formData[ `${RECLAIM.InputFields.AutoDrawLimit}${flagIndex}` ]
      } );
    }

    this.object.setFlag( game.system.id, RECLAIM.Flags.ConnectedDeckArray, newConnectionArray );

    // TODO saved data looks wrong

    return result;
  }

  static _selectOptionById( optionsHTML, valueToSelect ) {
    if ( !valueToSelect || !optionsHTML ) {
      return optionsHTML;
    }

    const substring = `"${valueToSelect}"`;
    const idTagPosition = optionsHTML.indexOf( substring );
    if ( idTagPosition < 0 ) {
      return optionsHTML;
    }

    const insertTagAt = idTagPosition + substring.length;
    const result = [optionsHTML.slice( 0, insertTagAt ), ` selected`, optionsHTML.slice( insertTagAt )].join( `` );
    return result;
  }

  static _renderDeckToOptionElements() {
    const allDecks = game.cards.filter( collection => collection.type === `deck` );
    const allDecksLength = allDecks.length;
    let result = ``;

    // Loop fills select element with all card deck values
    for ( let optionIndex = 0; optionIndex < allDecksLength; optionIndex++ ) {
      let deck = allDecks[ optionIndex ];
      result +=
              `
              <option value="${deck.id}">${deck.name}</option>`;
    }

    return result;
  }
}
