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
    let assignedRoles = new Map();

    for ( const property in RECLAIM.SceneRoles ) {
      if ( Object.hasOwnProperty.call( RECLAIM.SceneRoles, property ) ) {
        const roleName = RECLAIM.SceneRoles[ property ];
        assignedRoles.set( roleName, 0 );
      }
    }


    let userSceneRoles = scene.getFlag( game.system.id, RECLAIM.Flags.UserSceneRole );
    if ( !userSceneRoles ) {
      userSceneRoles = {};
      if ( users.current.isGM ) {
        let document = await scene.setFlag( game.system.id, RECLAIM.Flags.UserSceneRole, userSceneRoles );
        userSceneRoles = document.getFlag( game.system.id, RECLAIM.Flags.UserSceneRole );
      }
    }

    // Check if each user has valid role
    for ( const user of users ) {
      const currentUserRole = userSceneRoles[ user.id ];

      if ( !currentUserRole ) { // User doesn't have a role
        userSceneRoles[ user.id ] = RECLAIM.SceneRoles.Observer;
        allUserValid = false;
        continue;
      }

      if ( !RECLAIM.SceneRoles[ currentUserRole ] ) { // User role is invalid
        userSceneRoles[ user.id ] = RECLAIM.SceneRoles.Observer;
        allUserValid = false;
        continue;
      }

      if ( !assignedRoles.has( currentUserRole ) ) {
        userSceneRoles[ user.id ] = RECLAIM.SceneRoles.Observer;
        allUserValid = false;
        continue;
      }

      let increment = assignedRoles.get( currentUserRole );
      increment++;
      assignedRoles.set( currentUserRole, increment );
    }

    if ( users.current.isGM && !allUserValid ) {
      scene.setFlag( game.system.id, RECLAIM.Flags.UserSceneRole, userSceneRoles );
    }

    for ( const pair of assignedRoles ) {
      if ( pair[ 1 ] <= 0 ) {
        allUserValid = false;
        break;
      }
    }

    if ( !allUserValid ) {
      let form = new ReclaimPickRoleForm( users );
      form.render( true );
    }
  }
}
