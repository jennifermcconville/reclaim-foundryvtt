/* eslint-disable no-undef */
import { RECLAIM } from "./config.mjs";

export class HelperFunctions {
  static getUserSceneRole( scene, user ) {
    const result = user.getFlag( game.system.id, RECLAIM.Flags.UserSceneRole );
    if ( result ) {
      return result[ scene.id ];
    }
  }
  
  static setUserSceneRole( scene, user, role ) {
    user.setFlag( game.system.id, RECLAIM.Flags.UserSceneRole, {
      [ scene.id ]: role
    } );
  }
  
  static getUserDeck( user ) {
    return user.getFlag( game.system.id, RECLAIM.Flags.UserCardHandId );
  }
  
  static getNextRole( role ) {
    let result = null;

    switch ( role ) {
      case RECLAIM.SceneRoles.Housing:
        result = RECLAIM.SceneRoles.Treatment;
        break;

      case RECLAIM.SceneRoles.Treatment:
        result = RECLAIM.SceneRoles.Farmer;
        break;

      case RECLAIM.SceneRoles.Farmer:
        result = RECLAIM.SceneRoles.Contractor;
        break;

      case RECLAIM.SceneRoles.Contractor:
        result = RECLAIM.SceneRoles.Housing;
        break;

      default:
        break;
    }

    return result;
  }
};
