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
    Hooks.on( RECLAIM.Hooks.PlayersValidated, this.onPlayerRolesChanged );
  }

  static get defaultOptions() {
    return mergeObject( super.defaultOptions, {
      template: `systems/reclaim/templates/chat-log.html`
    } );

  }

  activateListeners( html ) {
    super.activateListeners( html );

    html.find( `#reclaim-chat-button` ).click( this.openSceneSettings.bind( this ) );
  }

  async onPlayerRolesChanged( _scene, allValid ) {
    if ( !allValid ) {
      let textElement = $( this.textField );
      textElement.text( `All the game roles haven't been correctly assigned to players in this Scene. Press the button below to open Scene Settings.` );
      textElement.addClass( `red-tint` );
      return;
    }
    let textElement = $( this.textField );
    textElement.text( `Reclaim.` );
    textElement.removeClass( `red-tint` );
  }

  async openSceneSettings( scene ) {
    scene.sheet.render();
  }
}
