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

      // Const assignedRole = this.getFlag( game.system.id, RECLAIM.Flags.UserSceneRole );

      userData.push( {
        name: user.name,
        id: user.id,
        sceneRoles: RECLAIM.SceneRoles,
        assignedRole: `Not assigned`
      } );
    }

    let merged = mergeObject( fromSuper,
      {
        users: userData
      } );
    return merged;
  }
}
