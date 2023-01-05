/* eslint-disable no-undef */
/**
 * @extends {TokenHUD}
 */

export class ReclaimTokenHUD extends TokenHUD {

  /** @override */
  getData( options ) {
    let data = super.getData( options );

    let isGM = game.user.isGM;

    // Disables the dynamic unused buttons from Token HUD
    data = foundry.utils.mergeObject( data, {
      canConfigure: isGM,
      canToggleCombat: false,
      displayBar1: false,
      bar1Data: null,
      displayBar2: false,
      bar2Data: null,
      effectsClass: ``,
      combatClass: ``,
      targetClass: ``,
      bar1: null,
      bar2: null,
      statusEffects: null
    } );

    return data;
  }

  /** @override */
  async _render( ...args ) {
    await super._render( ...args );

    // Hiding elements via jQuerry since they are not made conditional (dynamic) in the template
    this.element.find( `div.col.left` ).find( `div.control-icon[data-action="target"]` ).hide();
    this.element.find( `div.col.left` ).find( `div.attribute.elevation` ).hide();

    let effectsButton = this.element.find( `div.col.right` ).find( `div.control-icon[data-action="effects"]` );
    effectsButton.hide();

    // Adding buttons via code to avoid overriding the whole template
    let deleteButton = $( `
                           <div class="control-icon" data-action="delete">
                              <img src="icons/svg/cancel.svg" width="36" height="36" title="Delete token"> 
                           </div>
                        ` );

    let changeButton = $( `
                          <div class="control-icon" data-action="change">
                            <img src="icons/svg/direction.svg" width="36" height="36" title="Change resource"> 
                          </div>
                        ` );


    deleteButton.insertBefore( effectsButton );


    // Connecting click listener manually as other buttons get connected in super._render call
    // which re-creates the html, so our button needs to be added afterwards
    deleteButton.click( this._onClickDelete.bind( this ) );

    if ( this?.object?.actor?.type === `resource` ) {
      changeButton.insertAfter( deleteButton );
      changeButton.click( this._onClickChange.bind( this ) );
    }
  }

  /**
   * Click handler for Delete button, removes current token from scene.
   *
   * @param {MouseEvent} event
   * @private
   */
  _onClickDelete( event ) {

    // Following the pattern of other on click handles in super class
    super._onClickControl( event );
    if ( event.defaultPrevented ) {
      return;
    }
    const button = event.currentTarget;
    if ( button.dataset.action === `delete` ) {
      return this._onDeleteToken( event );
    }
  }

  /**
   * @override
   * @param {*} event
   */
  // eslint-disable-next-line no-unused-vars
  _onDeleteToken( event ) {
    canvas.scene.deleteEmbeddedDocuments( `Token`, [this.object.id] );
  }

  /**
   * Click handler for Change button, associates the token to the next Resource Actor in the folder.
   *
   * @param {MouseEvent} event
   * @private
   */
  _onClickChange( event ) {
    super._onClickControl( event );
    if ( event.defaultPrevented ) {
      return;
    }
    const button = event.currentTarget;
    if ( button.dataset.action === `change` ) {
      return this._onChangeToken( event );
    }
  }

  /**
   *
   * @override
   * @param {*} event
   * @returns {null}
   */
  // eslint-disable-next-line no-unused-vars
  async _onChangeToken( event ) {
    if ( this.object.actor.type !== `resource` ) {
      return;
    }

    const token = this.object;

    // Get a list of all resource actors
    // sort ?
    let sortedResourceActors = game.actors.filter( actor => actor.type === `resource` ).sort( a => a.name );

    // Find next actor
    let index = sortedResourceActors.findIndex( function( actor ) {
      if ( actor.id === this ) {
        return true;
      } else {
        return false;
      }
    }, token.actor.id );

    if ( index < 0 ) {
      throw Error( `Could not find tokens actor in actors list` );
    }
    index++;
    if ( index >= sortedResourceActors.length ) {
      index = 0;
    }
    let nextActor = sortedResourceActors[ index ];

    // Change this token association to the next actor in list
    await token.document.update(
      {
        actorId: nextActor.id,
        actor: nextActor,
        texture: { src: nextActor.prototypeToken.texture.src },
        id: nextActor.prototypeToken.id
      },
      { parent: token.parent.parent } );

    // Prevent closing of HUD
    this.bind( token );
  }
}
