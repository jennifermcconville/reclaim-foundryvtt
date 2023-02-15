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

    html.find( `#reclaim-chat-button` ).click( this.openSceneSettings.bind( this ) );
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
    const button = $( ui.chat.chatButton );
    if ( !allValid ) {
      let newText = `All the game roles haven't been correctly assigned to players in this Scene`;
      if ( game.users.current.isGm ) {
        newText += `Press the button below to open Scene Settings.`;
      }
      textElement.text( newText );
      textElement.addClass( `red-tint` );
      button.show();
      return;
    }

    const currentRole = RECLAIM.Helpers.getUserSceneRole( scene, game.users.current );
    textElement.text( `You are playing in the ${currentRole} role.` );
    textElement.removeClass( `red-tint` );
    button.hide();

  }

  /** /STATIC FUNCTIONS */
}
