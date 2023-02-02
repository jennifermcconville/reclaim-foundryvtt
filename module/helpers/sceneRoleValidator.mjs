/* eslint-disable no-undef */

import { RECLAIM } from "./config.mjs";
import { ReclaimPickRoleForm } from "../apps/pick-role-form.mjs";

export class ReclaimSceneRoleValidator {

  /**
   * Goes through all the users and checks if they have a valid SceneRole in the scene.
   * If not, displays dialog requesting users to pick roles.
   * @param {Scene}   scene
   * @param {[user]}  users
   */
  static async checkGameState( scene, users ) {
    let allUserValid = true;
    let roleCount = ReclaimSceneRoleValidator.createRoleIntMap();


    let assignedSceneRoles = scene.getFlag( game.system.id, RECLAIM.Flags.UserSceneRole );
    if ( !assignedSceneRoles ) {
      assignedSceneRoles = {};
      if ( users.current.isGM ) {
        let document = await scene.setFlag( game.system.id, RECLAIM.Flags.UserSceneRole, assignedSceneRoles );
        assignedSceneRoles = document.getFlag( game.system.id, RECLAIM.Flags.UserSceneRole );
      }
    }

    // Check if each user has valid role
    allUserValid = ReclaimSceneRoleValidator.validateUserRoles( users, assignedSceneRoles, roleCount );

    if ( users.current.isGM && !allUserValid ) {
      scene.setFlag( game.system.id, RECLAIM.Flags.UserSceneRole, assignedSceneRoles );
    }

    for ( const pair of roleCount ) {
      if ( pair[ 1 ] <= 0 ) {
        allUserValid = false;
        break;
      }
    }

    if ( !allUserValid ) {
      scene.setFlag( game.system.id, RECLAIM.Flags.GameState, RECLAIM.GameState.RolesNotSelected );
      let form = new ReclaimPickRoleForm( users );
      form.render( true );
    }
  }

  static validateUserRoles( users, assignedSceneroles, roleCount ) {
    let allUsersValid = true;
    for ( const user of users ) {
      const assignedUserRole = assignedSceneroles[ user.id ];

      if ( !assignedUserRole ) { // User doesn't have a role
        assignedSceneroles[ user.id ] = RECLAIM.SceneRoles.Observer;
        allUsersValid = false;
        continue;
      }

      if ( !RECLAIM.SceneRoles[ assignedUserRole ] ) { // User role is invalid
        assignedSceneroles[ user.id ] = RECLAIM.SceneRoles.Observer;
        allUsersValid = false;
        continue;
      }

      if ( !roleCount.has( assignedUserRole ) ) {
        assignedSceneroles[ user.id ] = RECLAIM.SceneRoles.Observer;
        allUsersValid = false;
        continue;
      }

      let increment = roleCount.get( assignedUserRole );
      increment++;
      roleCount.set( assignedUserRole, increment );
    }

    return allUsersValid;
  }

  static createRoleIntMap() {
    let result = new Map();
    for ( const property in RECLAIM.SceneRoles ) {
      if ( Object.hasOwnProperty.call( RECLAIM.SceneRoles, property ) ) {
        const roleName = RECLAIM.SceneRoles[ property ];
        result.set( roleName, 0 );
      }
    }
    return result;
  }

}
