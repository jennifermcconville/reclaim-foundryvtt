/* eslint-disable no-undef */

import { RECLAIM } from "../helpers/config.mjs";


export class ReclaimSceneConfig extends SceneConfig {


  /**
   * @inheritdoc
   * @override
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject( super.defaultOptions, {
      template: `systems/reclaim/templates/scene-config.html`
    } );
  }

  /**
   * @inheritdoc
   * @override
   */
  getData() {
    let fromSuper = super.getData();

    let userData = [];
    for ( const user of game.users.contents ) {
      const assignedRole = RECLAIM.Helpers.getUserSceneRole( this.object, user );
      userData.push( {
        name: user.name,
        id: user.id,
        sceneRoles: RECLAIM.SceneRoles,
        assignedRole: assignedRole
      } );
    }

    let merged = mergeObject( fromSuper,
      {
        users: userData
      } );
    return merged;
  }

  /**
   * @override
   * @inheritdoc
   */
  async _updateObject( event, formData ) {
    super._updateObject( event, formData );
    for ( const user of game.users.contents ) {
      RECLAIM.Helpers.setUserSceneRole( this.object, user, formData[ `userRole-${user.id}` ] );
    }
  }
}
