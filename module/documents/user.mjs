/* eslint-disable no-undef */
import { RECLAIM } from "../helpers/config.mjs";


export class ReclaimUser extends User {


  /**
   * @inheritdoc
   * @override
   */
  static defineSchema() {
    let schema = super.defineSchema();
    const fields = foundry.data.fields;

    schema.ReclaimRole = new fields.SchemaField( {
      name: new fields.StringField()
    } );

    return schema;
  }

  async prepareBaseData() {
    super.prepareBaseData();
    console.debug( `Preparing base data` );

    // Let role = this.getFlag( game.system.id, RECLAIM.Flags.UserRole );
    // if ( !role ) {
    //   this.setFlag( game.system.id, RECLAIM.Flags.UserRole, -1 );
    // }
  }

  async prepareDerivedData() {
    super.prepareDerivedData();

    // This.derivedRole = new ReclaimUserRole( this.getFlag( game.system.id, RECLAIM.Flags.UserRole ) );
  }

  async getData( options ) {
    let result = super.getData( options );
    return result;
  }

  validate( options ) {
    return super.validate( options );
  }
}
