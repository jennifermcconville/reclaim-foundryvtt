/* eslint-disable no-undef */

// import { RECLAIM } from "../helpers/config.mjs";

Hooks.once( `init`, async function( input ) {
  console.debug( `Changing Chat name ${input}` );

} );


Hooks.once( `ready`, async function( input ) {
  console.debug( `Changing Chat name ${input}` );

} );

export class ReclaimChatMessage extends ChatMessage {

  static metadata = Object.freeze( mergeObject( super.metadata, {
    label: `RECLAIM.ChatMessage`,
    labelPlural: `RECLAIM.ChatMessages`
  }, { inplace: false } ) );

}
