/* eslint-disable no-undef */

import { RECLAIM } from "../helpers/config.mjs";
import { ReclaimUserRole } from "../documents/user-role.mjs";
import { ReclaimUser } from "../documents/user.mjs";

Hooks.on( `updateDocument`, async function() {
  console.debug( `Data updated.` );
} );


export class ReclaimPickRoleForm extends FormApplication {


  static get defaultOptions() {
    return mergeObject( super.defaultOptions, {
      classes: [`form`],
      template: `systems/reclaim/templates/pick-role-form.html`,
      id: `reclaim-pick-role-form`,
      submitOnChange: true,
      closeOnSubmit: false,
      popOut: true
    } );
  }

  getData() {
    let fromSuper = super.getData();
    let merged = mergeObject( fromSuper,
      {
        roles: ReclaimUserRole.JustNames
      } );
    return merged;
  }

  activateListeners( html ) {
    super.activateListeners( html );
  }

  async _updateObject( event, formData ) {
    let selectedRole = event.target.selectedOptions[ 0 ].value;
    let userID = event.target.id; // Used element id field to store UserId
    let user = game.users.contents.find( user => user.id === userID );
    if ( !user ) {
      return;
    }

    user.setFlag( game.system.id, RECLAIM.Flags.UserSceneRole, selectedRole );
  }

  /**
   * @inheritdoc
   * @override
   * @param {*} event
   */
  async _onChangeInput( event ) {

    // If ( this.disableChangeEvents ) {
    //   return;
    // }

    super._onChangeInput( event );
  }
}


