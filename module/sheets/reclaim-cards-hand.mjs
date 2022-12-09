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
    console.debug( result );

    // Result.element.find("")
    return result;
  }

}
