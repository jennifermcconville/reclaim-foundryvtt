/**
 * @extends {TokenHUD}
 */

export class ReclaimTokenHUD extends TokenHUD {

  /** @override */
  getData(options) {
    let data = super.getData(options);

    let isGM = game.user.isGM;

    // Disables the dynamic unused buttons from Token HUD
    data = foundry.utils.mergeObject(data, {
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
    });

    return data;
  }

  /** @override */
  async _render(...args) {
    await super._render(...args);

    // Hiding elements via jQuerry since they are not made conditional (dynamic) in the template
    this.element.find(`div.col.left`).find(`div.control-icon[data-action="target"]`).hide();
    this.element.find(`div.col.left`).find(`div.attribute.elevation`).hide();

    let effectsButton = this.element.find(`div.col.right`).find(`div.control-icon[data-action="effects"]`);
    effectsButton.hide();

    // Adding delete button via code to avoid overriding the whole template just for one button
    let deleteButton = $(`
                           <div class="control-icon" data-action="delete">
                              <img src="icons/svg/cancel.svg" width="36" height="36" title="Delete token"> 
                           </div>
                        `);

    deleteButton.insertBefore(effectsButton);
    // Connecting click listener manually as other buttons get connected in super._render call
    // which re-creates the html, so our button needs to be added afterwards
    deleteButton.click(this._onClickDelete.bind(this));
  }

  _onClickDelete(event) {
    // Following the pattern of other on click handles in super class
    if (event.defaultPrevented) return;
    const button = event.currentTarget;
    if (button.dataset.action === `delete`) return this._onDeleteToken(event);
  }

  _onDeleteToken(event) {
    canvas.scene.deleteEmbeddedDocuments(`Token`, [this.object.id]);
  }
}
