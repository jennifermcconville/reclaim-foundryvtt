/* eslint-disable no-undef */

export class ReclaimChatMessage extends ChatMessage {

  static metadata = Object.freeze( mergeObject( super.metadata, {
    label: `RECLAIM.ChatMessage`,
    labelPlural: `RECLAIM.ChatMessages`
  }, { inplace: false } ) );

}
