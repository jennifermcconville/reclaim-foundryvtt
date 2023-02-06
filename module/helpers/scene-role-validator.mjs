/* eslint-disable no-undef */

import { RECLAIM } from "./config.mjs";

Hooks.on( `canvasReady`, async function( canvas ) {
  ReclaimSceneRoleValidator.checkGameState( canvas.scene, game.users );
} );

Hooks.on( `updateScene`, async function( scene, args ) {
  if ( typeof args?.flags?.reclaim?.ReclaimSceneUserRole !== `undefined` ) {
    ReclaimSceneRoleValidator.checkGameState( scene, game.users );
  }
} );


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
      allUserValid = false;
    }

    // Check if each user has valid role
    allUserValid = ReclaimSceneRoleValidator.validateUserRoles( users, assignedSceneRoles );

    if ( !allUserValid ) {
      Hooks.callAll( `playerRolesInvalid`, canvas.scene );
    }

  }

  static validateUserRoles( users, assignedSceneRoles ) {
    let roleCount = {};
    for ( const roleKey in RECLAIM.SceneRoles ) {
      roleCount[ RECLAIM.SceneRoles[ roleKey ] ] = 0;
    }

    for ( const user of users ) {
      const assignedUserRole = assignedSceneRoles[ user.id ];

      if ( !assignedUserRole ) { // User doesn't have a role
        return false;
      }

      if ( !RECLAIM.SceneRoles[ assignedUserRole ] ) { // User role is invalid
        return false;
      }

      if ( !( assignedUserRole in roleCount ) ) {
        return false;
      }

      if ( assignedUserRole === RECLAIM.SceneRoles.Observer ) {
        continue;
      }

      roleCount[ assignedUserRole ]++;
      if ( roleCount[ assignedUserRole ] !== 1 ) {
        return false;
      }
    }

    return true;
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
