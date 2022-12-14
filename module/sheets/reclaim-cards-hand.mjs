/* eslint-disable no-undef */

/**
 * @extends {CardsHand}
 */

export class ReclaimCardsHand extends CardsHand {

  // Static get defaultOptions() {
  //   let template = foundry.utils.mergeObject( super.defaultOptions, {
  //     template: `templates/cards/cards-hand.html`
  //   } );

  //   return template;
  // }

  // Overwrite get sheet() { ?
  // render(force=false, options={}) {

  // /**
  //  * @override
  //  *
  //  * @param {*} _event
  //  * @param {*} _formData
  //  */
  // async _updateObject( _event, _formData ) {
  //   super._updateObject( _event, _formData );
  // }

  // /**
  //  * @override
  //  * */
  // render( force = false, options = {} ) {
  //   let result = super.render( force, options );

  //   let deckBinderElement = $( `<div class="reclaim.deckBinder">Just some innocent text :) </div>` );
  //   deckBinderElement[ 0 ].insertAfter( result.element.find( `form.editable.div` ) );

  //   return result;
  // }

  /**
   * @override
   */
  async _render( ...args ) {
    await super._render( args );
    return;

    let deckBinderHtmlString =
    `<div class="reclaim-deckBinder">
      <header class="reclaim-deckBinder-header flexrow">
        <span class="deck">Auto draw from deck</span>
        <span class="number">Untill</span>
      </header>
      <div class="form-fields flexrow">
        <select class="deck" name="boundDeck" >
          <option value="">-</option>`;

    let allDecks = game.cards.filter( collection => collection.type = `deck` );
    allDecks.forEach( deck => {
      deckBinderHtmlString +=
          `
          <option value="${deck.id}">${deck.name}</option>`;
    } );

    deckBinderHtmlString +=
        `</select>
        <input class="number" type="number" value="0" step="1" name="autoDrawLimit" min="0">
      </div>
    </div>`;

    let deckBinderElement = $.parseHTML( deckBinderHtmlString );
    let deckBinderSiblingElement = this.element.find( `form.editable` ).children( `div` );
    deckBinderSiblingElement.after( deckBinderElement[ 0 ] );
  }

  // <div class="form-fields">
  //             <select name="from">
  //                 <option value="iUi1e9ZVFfoRuLoq">Disease Cost</option>
  //                  <option value="4artNsUrtSeg6afn">Dumping Cost</option>
  // <                option value="7KH86FYWecFzuqtk">Events</option></select>
  //         </div>


  // Async _render( force, options ) {
  //   await super.render( force, options );

  //   console.debug( this.element.find( `form.editable` ) );
  // }

}
