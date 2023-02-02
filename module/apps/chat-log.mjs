/* eslint-disable no-undef */


export class ReclaimChatLog extends ChatLog {

  static get defaultOptions() {
    console.debug( `RECLAIM Chat Log` );
    return mergeObject( super.defaultOptions, {
      template: `systems/reclaim/templates/chat-log.html`
    } );

  }
}
