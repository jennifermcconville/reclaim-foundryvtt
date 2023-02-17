/* eslint-disable no-undef */

import { RECLAIM } from "./config.mjs";
import { HelperFunctions } from "./helper-functions.mjs";

Hooks.on( `canvasReady`, async function( canvas ) {
  ReclaimSceneRoleValidator.checkPlayerRoles( canvas.scene, game.users );
} );

Hooks.on( `updateScene`, async function( scene, args ) {
  if ( typeof args?.flags?.reclaim?.[ RECLAIM.Flags.UserSceneRole ] !== `undefined` ) {
    ReclaimSceneRoleValidator.checkPlayerRoles( scene, game.users );
  }
} );

Hooks.on( `updateUser`, async function( _user, args ) {
  if ( typeof args?.flags?.reclaim?.[ RECLAIM.Flags.UserSceneRole ] !== `undefined` ) {
    ReclaimSceneRoleValidator.checkPlayerRoles( game.scenes.active, game.users );
  }
} );

export class ReclaimSceneRoleValidator {

  /**
   * Goes through all the users and checks if they have a valid SceneRole in the scene.
   * If not, displays dialog requesting users to pick roles.
   * @param {Scene}   scene
   * @param {[user]}  users
   */
  static async checkPlayerRoles( scene, users ) {
    const allUserValid = ReclaimSceneRoleValidator.validateUserRoles( scene, users );
    Hooks.callAll( RECLAIM.Hooks.PlayersValidated, canvas.scene, allUserValid );
  }

  static validateUserRoles( scene, users ) {
    let roleCount = {};
    for ( const roleKey in RECLAIM.SceneRoles ) {
      roleCount[ RECLAIM.SceneRoles[ roleKey ] ] = 0;
    }

    for ( const user of users ) {
      const assignedUserRole = HelperFunctions.getUserSceneRole( scene, user );

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

    for ( const roleKey in RECLAIM.SceneRoles ) {
      if ( RECLAIM.SceneRoles[ roleKey ] === RECLAIM.SceneRoles.Observer ) {
        continue;
      }

      if ( roleCount[ RECLAIM.SceneRoles[ roleKey ] ] !== 1 ) {
        return false;
      }
    }

    return true;
  }
}
