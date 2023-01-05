/* eslint-disable no-undef */

/**
 *  @extends {Token}
 */


import { RECLAIM } from "../helpers/config.mjs";

export class ReclaimToken extends Token {

  //* @override */
  _onCreate( _options, _userId ) {

    // Function body copied from token.js row 1523 just to change camera panning
    // Start by drawing the newly created token
    this.draw().then( () => {

      // Draw vision for the new token
      const refreshVision = this.document.sight.enabled && this.observer;
      const refreshLighting = this.emitsLight;
      if ( refreshVision || refreshLighting ) {
        this.updateSource( { defer: true } );
        canvas.perception.update( { refreshVision, refreshLighting }, true );
      }

      // Assume token control
      if ( !game.user.isGM && this.isOwner && !this.document.hidden ) {
        this.control( { pan: false } );
      }

      // Update visibility of objects in the Scene
      if ( !refreshVision ) {
        canvas.effects.visibility.restrictVisibility();
      }
    } );
  }

  /**
   * Ignore double click on these token types to prevent opening sheets
   *
   * @override
   */
  _onClickLeft2( event ) {
    if ( this.actor.type === `resource` ) {
      return;
    }

    if ( this.actor.type === `infrastructure` ) {
      this.showCardPopout();
      return;
    }

    super._onClickLeft2( event );
  }

  async showCardPopout() {

    const cardId = this.document.getFlag( game.system.id, RECLAIM.Flags.TokenSpawnedByCardId );
    if ( !cardId ) {
      return;
    }

    let card;
    for ( const stack of game.cards.contents ) {
      card = stack.cards.find( card => card.id === cardId );
      if ( card ) {
        break;
      }
    }

    if ( !card ) {
      return;
    }

    const imagePopout = new ImagePopout( card.img, {
      title: card.name,
      uuid: card.link
    } );

    imagePopout.render( true );
  }

}

