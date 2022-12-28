/* eslint-disable no-undef */

import { RECLAIM } from "../helpers/config.mjs";

export class ReclaimCardConfig extends CardConfig {

  /**
   * @inheritdoc
   * @override
   * */
  static get defaultOptions() {
    return foundry.utils.mergeObject( super.defaultOptions, {
      classes: [`sheet`, `card-config`],
      template: `systems/reclaim/templates/cards/card-config.html`,
      width: 480,
      height: `auto`,
      tabs: [{ navSelector: `.tabs`, contentSelector: `form`, initial: `details` }]
    } );
  }

  /**
   * @override
   * @inheritdoc
   */
  async getData( options ) {
    let result = await super.getData( options );

    result.allActors = game.actors.contents;
    result.selectedActor = this.object.getFlag( game.system.id, RECLAIM.Flags.CardSpawnsActorId );

    return result;
  }

  /**
   * @inheritdoc
   * @override
   */
  async _onSubmit( event, { updateData = null, preventClose = false, preventRender = false } = {} ) {
    const result = super._onSubmit( event, { updateData, preventClose, preventRender } );

    const formData = this._getSubmitData( updateData );

    if ( formData.actorSelect ) {
      this.object.setFlag( game.system.id, RECLAIM.Flags.CardSpawnsActorId, formData.actorSelect );
    }

    return result;
  }
}
