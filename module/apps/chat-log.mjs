/* eslint-disable no-undef */

import { RECLAIM } from "../helpers/config.mjs";

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
    const currentRole = RECLAIM.Helpers.getUserSceneRole( activeScene, user );
    const nextRole = RECLAIM.Helpers.getNextRole( currentRole );
    if ( nextRole === null ) {
      ui.notifications.warn( `You don't have permission to switch your role. Ask the Gamemaster to assign you a role.` );
      return;
    }

    const result = await activeScene.setFlag( game.system.id, RECLAIM.Flags.UserSceneRole, {
      [ user.id ]: nextRole
    } );
  }

  async openSceneSettings( scene ) {
    scene.sheet.render();
  }

  /** STATIC FUNCTIONS */
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
    let newText = ``;
    if ( !allValid ) {
      newText += `All the game roles haven't been correctly assigned to players in this Scene.`;
      textElement.addClass( `red-tint` );
    } else {
      textElement.removeClass( `red-tint` );
      const currentRole = RECLAIM.Helpers.getUserSceneRole( scene, game.users.current );
      newText += `You are playing in the ${currentRole} role.`;
    }

    textElement.text( newText );
  }

  /** /STATIC FUNCTIONS */
}
