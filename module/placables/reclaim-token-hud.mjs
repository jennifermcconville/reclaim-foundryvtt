/**
 * @extends {TokenHUD}
 */

export class ReclaimTokenHUD extends TokenHUD {

   /** @override */
   getData(options) {
      let data = super.getData(options);

      var isGM = game.user.isGM;

      data = foundry.utils.mergeObject(data, {
         canConfigure: isGM,
         canToggleCombat: false,
         displayBar1: false,
         bar1Data: null,
         displayBar2: false,
         bar2Data: null,
         effectsClass: "",
         combatClass: "",
         targetClass: "",
         bar1: null,
         bar2: null,
         statusEffects: null
      });

      return data;
   }

   /** @override */
   async _render(...args) {
      await super._render(...args);

      // hiding elements via jQuerry since they are not made conditional in the template 
      this.element.find('div.col.left').find('div.control-icon[data-action="target"]').hide()
      this.element.find('div.col.left').find('div.attribute.elevation').hide();

      this.element.find('div.col.right').find('div.control-icon[data-action="effects"]').hide(); 
   }
}