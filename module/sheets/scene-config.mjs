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
      const assignedRoles = this.object.getFlag( game.system.id, RECLAIM.Flags.UserSceneRole );
      userData.push( {
        name: user.name,
        id: user.id,
        sceneRoles: RECLAIM.SceneRoles,
        assignedRole: assignedRoles ? assignedRoles[ user.id ] : ``
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

    let usersRoleData = {};
    for ( const user of game.users.contents ) {
      usersRoleData[ user.id ] = formData[ `userRole-${user.id}` ];
    }

    this.object.setFlag( game.system.id, RECLAIM.Flags.UserSceneRole, usersRoleData );

  }
}
