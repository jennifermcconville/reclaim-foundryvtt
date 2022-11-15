/**
 * @extends {TokenHUD}
 */

export class ReclaimTokenHUD extends TokenHUD {

   /** @override
  static get defaultOptions() {
     return foundry.utils.mergeObject(super.defaultOptions, {
        id: "token-hud",
        template: "systems/reclaim/templates/reclaim-token-hud.html"
     });
  } */

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
      var effectsButton = this.element.find('div.col.right').find('div.control-icon[data-action="effects"]');


      await super._render(...args);

      // hiding elements via jQuerry since they are not made conditional in the template 
      this.element.find('div.col.left').find('div.control-icon[data-action="target"]').hide()
      this.element.find('div.col.left').find('div.attribute.elevation').hide();

      var effectsButton = this.element.find('div.col.right').find('div.control-icon[data-action="effects"]');
      effectsButton.hide();

      var deleteButton = $(`
                           <div class="control-icon" data-action="delete">
                              <img src="icons/svg/cancel.svg" width="36" height="36" title="Delete token"> 
                           </div>
                        `);

      deleteButton.insertBefore(effectsButton);
      deleteButton.click(this._onClickDelete.bind(this));




      //.click(this._onClickControl.bind(this));

      //adds the Delete button for all users

      /** icon - cancel? style: fill red 
      *  <div class="control-icon" data-action="delete">
      *      <img src="icons/svg/cancel.svg" width="36" height="36" title="Delete token">
      *  </div>   
      */
   }

   // super._onClickControl(event);
   // if ( event.defaultPrevented ) return;
   // const button = event.currentTarget;
   // switch ( button.dataset.action ) {
   //   case "config":
   //     return this._onTokenConfig(event);

   _onClickDelete(event) {
      if (event.defaultPrevented) return;
      const button = event.currentTarget;
      if(button.dataset.action == "delete") 
         return this._onDeleteToken(event);
   }

   _onDeleteToken(event) {
      console.log("Delete token now");

   }
}