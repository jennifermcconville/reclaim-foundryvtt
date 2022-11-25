/**
 * @extends {Cards}
 */

Hooks.once(`init`, async function () {
  // ReclaimAutoCardHand.updateSchema();
});

const NEW_TYPES = [`deck`, `pile`, `reclaim-auto-hand`];

export class ReclaimAutoCardHand extends Cards {
  constructor(data = {}, { parent = null, strict = true, ...options } = {}) {
    super(data, [parent, strict, options]);
  }

  static updateSchema() {
    console.debug(this.TYPES);
    this.TYPES = NEW_TYPES;
  }

  /** @override */
  prepareData() {
    // Prepare data for the Cards. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
    super.prepareBaseData();
  }

  /** @override */
  prepareDerivedData() {
    //  Augment the basic actor data with additional dynamic data. Typically,
    //  you'll want to handle most of your calculated/derived data in this step.
    //  Data calculated in this step should generally not exist in template.json
    //  (such as ability modifiers rather than ability scores) and should be
    //  available both inside and outside of character sheets (such as if an actor
    //  is queried and has a roll executed directly from it).
    super.prepareDerivedData();
  }

  static migrateData(source) {
    if (source.type === `hand`) {
      // Source.type = `reclaim-auto-hand`;
      // Try {
      //   this.update({ type: `reclaim-auto-hand` });
      // } catch(error) {
      //   console.error(error);
      //   throw error;
      // }

    }
    console.debug(`Migrating data of type: ${source.type}`);
    super.migrateData(source);
  }

  /** @override */
  _onUpdate(data, options, userId) {
    debugger;
    super._onUpdate(data, option, userId);
  }

}

export class ReclaimCard extends Card {
  /** @override */
  prepareData() {
    // Prepare data for the Cards. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
    super.prepareBaseData();
  }

  /** @override */
  prepareDerivedData() {
    //  Augment the basic actor data with additional dynamic data. Typically,
    //  you'll want to handle most of your calculated/derived data in this step.
    //  Data calculated in this step should generally not exist in template.json
    //  (such as ability modifiers rather than ability scores) and should be
    //  available both inside and outside of character sheets (such as if an actor
    //  is queried and has a roll executed directly from it).
    super.prepareDerivedData();
  }

  static migrateData(source) {

  }
}


// /**
//  * The allowed set of Card types which may exist
//  * @type {string[]}
//  */
//  static get TYPES() { can i add types here?
//   return game.documentTypes?.Card || [CONST.BASE_DOCUMENT_TYPE];
// }
