/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Token}
 */

export class ReclaimToken extends Token {
  //** @override */
  _onCreate(options, userId) {
    // function body copied from token.js row 1523 just to change camera panning
    
    // Start by drawing the newly created token
    this.draw().then(() => {

      // Draw vision for the new token
      const refreshVision = this.document.sight.enabled && this.observer;
      const refreshLighting = this.emitsLight;
      if ( refreshVision || refreshLighting ) {
        this.updateSource({defer: true});
        canvas.perception.update({refreshVision, refreshLighting}, true);
      }

      // Assume token control
      if ( !game.user.isGM && this.isOwner && !this.document.hidden ) this.control({pan: false});

      // Update visibility of objects in the Scene
      if ( !refreshVision ) canvas.effects.visibility.restrictVisibility();
    });
  }
}