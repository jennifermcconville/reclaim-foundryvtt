/* eslint-disable no-undef */


export class ReclaimHotbar extends Hotbar {

  /** @override */
  getData( _options = {} ) {
    let superData = super.getData();
    superData.macros = superData.macros.slice( 0, 2 );
    return superData;
  }
}
