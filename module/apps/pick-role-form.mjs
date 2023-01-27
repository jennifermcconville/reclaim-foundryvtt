/* eslint-disable no-undef */

import { ReclaimUserRole } from "../documents/user.mjs";

export class ReclaimPickRoleForm extends FormApplication {

  static get defaultOptions() {
    return mergeObject( super.defaultOptions, {
      classes: [`form`],
      popOut: true,
      template: `systems/reclaim/templates/pick-role-form.html`,
      id: `reclaim-pick-role-form`,
      title: `Setup user roles`
    } );
  }

  getData() {

    // Send data to the template
    return {
      users: game.users,
      roles: ReclaimUserRole.JustNames
    };
  }

  activateListeners( html ) {
    super.activateListeners( html );
  }

  async _updateObject( event, formData ) {
    console.log( formData.exampleInput );
  }
}


