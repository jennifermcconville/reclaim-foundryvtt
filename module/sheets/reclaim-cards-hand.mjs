/* eslint-disable no-undef */

/**
 * @extends {CardsHand}
 */

export class ReclaimCardsHand extends CardsHand {
  static get defaultOptions() {
    let template = foundry.utils.mergeObject( super.defaultOptions, {
      template: `templates/cards/cards-hand.html`
    } );

    return template;
  }

  // Overwrite get sheet() { ?
  // render(force=false, options={}) {

  /**
   * @override
   * */
  render( force = false, options = {} ) {
    let result = super.render( force, options );

    let deckBinderElement = $( `<div class="reclaim.deckBinder">Just some innocent text :) </div>` );
    deckBinderElement.insertAfter( result.element.find( `form.editable.div` ) );

    return result;
  }

  /**
   * @override
   */
  async _render( ...args ) {
    await super._render( args );

    console.debug( this.element.find( `form.editable` ) );

    let deckBinderElement = $( `<div class="reclaim.deckBinder">Just some innocent text</div>` );
    deckBinderElement.insertAfter( this.element.find( `form.editable` ).children( `div` ) );
  }

  // Async _render( force, options ) {
  //   await super.render( force, options );

  //   console.debug( this.element.find( `form.editable` ) );
  // }

}
