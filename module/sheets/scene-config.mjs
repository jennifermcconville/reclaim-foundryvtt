/* eslint-disable no-undef */

import { RECLAIM } from "../helpers/config.mjs";
import { HelperFunctions } from "../helpers/helper-functions.mjs";


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
      const assignedRole = HelperFunctions.getUserSceneRole( this.object, user );
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
      HelperFunctions.setUserSceneRole( this.object, user, formData[ `userRole-${user.id}` ] );
    }
  }
}
