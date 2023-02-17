/* eslint-disable no-undef */

import { RECLAIM } from "../helpers/config.mjs";
import { HelperFunctions } from "../helpers/helper-functions.mjs";

Hooks.on( `renderChatLog`, async function( chatLog, element ) {
  chatLog.chatButton = element.find( `#reclaim-chat-button` )[ 0 ];
  chatLog.textField = element.find( `#reclaim-chat-box` )[ 0 ];
} );


export class ReclaimChatLog extends ChatLog {

  #chatButton = null;

  #chatTextField = null;

  get chatButton() {
    return this.#chatButton;
  }

  set chatButton( value ) {
    this.#chatButton = value;
  }

  get textField() {
    return this.#chatTextField;
  }

  set textField( value ) {
    this.#chatTextField = value;
  }

  constructor() {
    super();

    Hooks.on( RECLAIM.Hooks.PlayersValidated, ReclaimChatLog.onPlayerRolesChanged );
  }

  activateListeners( html ) {
    super.activateListeners( html );

    html.find( `#reclaim-chat-button` ).click( this.switchRole.bind( this ) );
  }

  async switchRole() {
    const user = game.users.current;
    const activeScene = game.scenes.active;
    const currentRole = HelperFunctions.getUserSceneRole( activeScene, user );
    const nextRole = HelperFunctions.getNextRole( currentRole );
    if ( nextRole === null ) {
      ui.notifications.warn( `You don't have permission to switch your role. Ask the Gamemaster to assign you a role.` );
      return;
    }

    HelperFunctions.setUserSceneRole( game.scenes.active, user, nextRole );
  }

  static get defaultOptions() {
    return mergeObject( super.defaultOptions, {
      template: `systems/reclaim/templates/chat-log.html`
    } );
  }

  static async onPlayerRolesChanged( scene, allValid ) {
    if ( !scene.active ) {
      return;
    }

    const textElement = $( ui.chat.textField );
    const button = $( ui.chat.chatButton );
    let newText = ``;
    if ( !allValid ) {
      newText += `All the game roles haven't been correctly assigned to players in this Scene.`;
      textElement.addClass( `red-tint` );
    } else {
      textElement.removeClass( `red-tint` );
      const currentRole = HelperFunctions.getUserSceneRole( scene, game.users.current );
      newText += `You are playing in the ${currentRole} role.`;
    }
    textElement.text( newText );

    const currentRole = HelperFunctions.getUserSceneRole( scene, game.users.current );
    if ( !currentRole || currentRole === RECLAIM.SceneRoles.Observer ) {
      button.hide();
    } else {
      button.show();
    }
  }
}
