/* eslint-disable no-undef */

import { RECLAIM } from "../helpers/config.mjs";

/**
 * @extends {CardsHand}
 */
export class ReclaimCardsHandSheet extends CardsHand {

  /**
   * @override
   */
  static get defaultOptions() {
    return mergeObject( super.defaultOptions, {
      classes: super.defaultOptions.classes.concat( [game.system.id, `cards-config`] ),
      template: `systems/reclaim/templates/cards/cards-hand.html`,
      closeOnSubmit: true
    } );
  }

  /**
   * @override
   * @inheritdoc
   */
  async getData( options ) {
    let result = await super.getData( options );

    const fromFlags = this.object.getFlag( game.system.id, RECLAIM.Flags.ConnectedDeckArray );
    let connections = ReclaimCardsHandSheet._getTemplateDataFromFlag( fromFlags );
    result.connections = connections;

    return result;
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

  /**
   * Takes an array as stored in the flag of a ReclaimConnectedCards and transforms it into
   * a data model for the cards-hand handlebar template to use
   *
   * @protected
   * @param {Array} fromFlag
   */
  static _getTemplateDataFromFlag( fromFlag ) {

    let connections = [];
    for ( let connectionIndex = 0; connectionIndex < 4; connectionIndex++ ) {
      let connectionIdFromFlag = ``;
      let connectionLimitFromFlag = 0;

      if ( fromFlag && connectionIndex < fromFlag.length ) {
        let connectionFromFlag = fromFlag[ connectionIndex ];
        connectionIdFromFlag = connectionFromFlag[ RECLAIM.Flags.ConnectedDeckId ];
        connectionLimitFromFlag = connectionFromFlag[ RECLAIM.Flags.AutoDrawLimit ];
      }

      let connectionTemplateData = {
        selectElementName: `${RECLAIM.InputFields.ConnectedDeckId}${connectionIndex}`,
        inputElementName: `${RECLAIM.InputFields.AutoDrawLimit}${connectionIndex}`,
        connectionId: connectionIdFromFlag,
        connectionLimit: connectionLimitFromFlag,
        selection: connectionIdFromFlag
      };

      let allDecks = game.cards.filter( collection => collection.type === `deck` );
      connectionTemplateData.decks = allDecks.map( deck => {
        return {
          name: deck.name,
          id: deck.id };
      } );

      connections.push( connectionTemplateData );
    }

    return connections;
  }
}
