/* eslint-disable no-undef */

/**
 * @extends {Cards}
 */

Hooks.once( `init`, async function() {

} );


export class ReclaimConnectedCards extends Cards {


  // Unused attempt at auto binding card hands to decks
  // addBoundDeckFlag() {
  //   if ( this.type === `hand` ) {

  //     let boundDeck = this.getFlag( `reclaim`, `boundDeck` );
  //     if ( boundDeck ) {
  //       return;
  //     }

  //     // Add bound deck flag if all cards belong to same deck otherwise do nothing
  //     let parentIDs = new Map();
  //     this.cards.forEach( element => {
  //       let mapped = parentIDs.get( element.origin.id );
  //       if ( mapped ) {
  //         parentIDs.set( element.origin.id, ( mapped++ ) );
  //       } else {
  //         parentIDs.set( element.origin.id, 0 );
  //       }
  //     } );

  //     if ( parentIDs.size === 1 ) {
  //       this.setFlag( `reclaim`, `boundDeck`, parentIDs[ 0 ].id );
  //     }
  //   }
  // }

  // /** @override */
  // prepareData() {

  //   // Prepare data for the Cards. Calling the super version of this executes
  //   // the following, in order: data reset (to clear active effects),
  //   // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
  //   // prepareDerivedData().
  //   super.prepareData();
  // }

  // /** @override */
  // prepareBaseData() {

  //   // Data modifications in this step occur before processing embedded
  //   // documents or derived data.
  //   super.prepareBaseData();
  // }

  // /** @override */
  // prepareDerivedData() {

  //   //  Augment the basic actor data with additional dynamic data. Typically,
  //   //  you'll want to handle most of your calculated/derived data in this step.
  //   //  Data calculated in this step should generally not exist in template.json
  //   //  (such as ability modifiers rather than ability scores) and should be
  //   //  available both inside and outside of character sheets (such as if an actor
  //   //  is queried and has a roll executed directly from it).
  //   super.prepareDerivedData();
  // }

  // Static migrateData( source ) {
  //   super.migrateData( source );

  //   if ( source.type === `hand` ) {
  //     console.debug( `Migrating data of type: ${source.type}` );

  //     // Make into reclaim-auto-hand and add locked deck
  //     // source.type = AUTO_HAND_TYPE;
  //   }

  //   if ( source.type === AUTO_HAND_TYPE ) {
  //     console.debug( `Migrating data of type: ${source.type}` );
  //   }

  //   // If reclaim-auto-hand check for locked deck, try migrate / throw warning?
  // }

  // /** @override */
  // _onUpdate( data, options, userId ) {
  //   super._onUpdate( data, option, userId );
  // }

  //   /**
  //    * @override
  //    * @param {*} inData
  //    * @param {*} inContext
  //    */
  //   async update( inData = {}, inContext = {} ) {
  //     if ( this.type !== `hand` ) {
  //       super.update( inData, inContext );
  //       return;
  //     }

  //     if ( inData.boundDeck ) {
  //       this.setFlag( System.name, `boundDeck`, inData.boundDeck );
  //     }
  //     if ( inData.autoDrawLimit ) {
  //       this.setFlag( System.name, `autoDrawLimit`, inData.autoDrawLimit );
  //     }

  //     super.update( inData, inContext );
  //   }
  // }

  // Export class ReclaimCard extends Card {

  //   /** @override */
  //   prepareData() {

  //     // Prepare data for the Cards. Calling the super version of this executes
  //     // the following, in order: data reset (to clear active effects),
  //     // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
  //     // prepareDerivedData().
  //     super.prepareData();
  //   }

  //   /** @override */
  //   prepareBaseData() {

  //     // Data modifications in this step occur before processing embedded
  //     // documents or derived data.
  //     super.prepareBaseData();
  //   }

  //   /** @override */
  //   prepareDerivedData() {

  //     //  Augment the basic actor data with additional dynamic data. Typically,
  //     //  you'll want to handle most of your calculated/derived data in this step.
  //     //  Data calculated in this step should generally not exist in template.json
  //     //  (such as ability modifiers rather than ability scores) and should be
  //     //  available both inside and outside of character sheets (such as if an actor
  //     //  is queried and has a roll executed directly from it).
  //     super.prepareDerivedData();
  //   }

  //   // Static migrateData( source ) {

  //   // }
  // }


// /**
//  * The allowed set of Card types which may exist
//  * @type {string[]}
//  */
//  static get TYPES() { can i add types here?
//   return game.documentTypes?.Card || [CONST.BASE_DOCUMENT_TYPE];
// }
}
