/* eslint-disable no-undef */

import { RECLAIM } from "../helpers/config.mjs";

export class RelcaimTokenConfig extends TokenConfig {

  /**
   * @inheritdoc
   * @override
   * */
  static get defaultOptions() {
    return foundry.utils.mergeObject( super.defaultOptions, {
      classes: [`sheet`, `token-sheet`],
      template: `systems/reclaim/templates/token-config.html`,
      width: 480,
      height: `auto`,
      tabs: [
        { navSelector: `.tabs[data-group="main"]`, contentSelector: `form`, initial: `character` },
        { navSelector: `.tabs[data-group="light"]`, contentSelector: `.tab[data-tab="light"]`, initial: `basic` },
        { navSelector: `.tabs[data-group="vision"]`, contentSelector: `.tab[data-tab="vision"]`, initial: `basic` }
      ],
      viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
      sheetConfig: true
    } );
  }

  /**
   * @override
   * @inheritdoc
   */
  async getData( options ) {
    let result = await super.getData( options );


    let allCards = [];
    let formattedName = ``;
    for ( const stack of game.cards.contents ) {
      if ( stack.type !== `deck` ) {
        continue;
      }

      for ( const card of stack.cards ) {
        formattedName = `${stack.name} - ${card.name}`;
        card.formattedName = formattedName ? formattedName : ``;

        allCards.push( card );
      }
    }
    allCards.sort( ( a, b ) => a.formattedName.localeCompare( b.formattedName ) );

    result.cards = allCards;
    const cardId = this.object.getFlag( game.system.id, RECLAIM.Flags.TokenSpawnedByCardId );
    result.cardId = cardId;

    return result;
  }

  /**
   * @inheritdoc
   * @override
   */
  async _onSubmit( event, { updateData = null, preventClose = false, preventRender = false } = {} ) {
    const result = super._onSubmit( event, { updateData, preventClose, preventRender } );

    const formData = this._getSubmitData( updateData );

    if ( formData.cardId ) {
      this.object.setFlag( game.system.id, RECLAIM.Flags.TokenSpawnedByCardId, formData.cardId );
    }

    return result;
  }
}