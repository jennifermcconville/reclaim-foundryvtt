/* eslint-disable no-undef */

import { ReclaimChatMessage } from "./../documents/chatt-message.mjs";

export class ReclaimSidebar extends Sidebar {

  /** @override */
  getData( options = {} ) {
    let data = super.getData( options );

    data.tabs.chat.tooltip = game.i18n.localize( ReclaimChatMessage.metadata.labelPlural );

    return data;
  }

}
