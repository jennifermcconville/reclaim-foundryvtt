/* eslint-disable no-undef */
import { RECLAIM } from "../helpers/config.mjs";


export class ReclaimUserRole {

  static JustNames = [
    `Housing`,
    `Treatment`,
    `Farming`,
    `Contractor`,
    `Observer`
  ];

  static RoleNames = {
    0: `Housing`,
    1: `Treatment`,
    2: `Farming`,
    3: `Contractor`,
    4: `Observer`,
    count: 5
  };

  #currentRole = -1;

  ReclaimUserRole( roleId ) {
    this.#currentRole = roleId;
  }

  increment() {
    this.#currentRole++;
    if ( this.#currentRole >= ReclaimUserRole.RoleNames.count ) {
      this.#currentRole = tReclaimUserRole.roleNames[ 0 ];
    }
  }

  isValid() {
    return this.#currentRole >= 0 && this.#currentRole < ReclaimUserRole.RoleNames.count;
  }
}

export class ReclaimUser extends User {

  async prepareBaseData() {
    console.debug( `Preparing base data` );
    let role = this.getFlag( game.system.id, RECLAIM.Flags.UserRole );
    if ( !role ) {
      this.setFlag( game.system.id, RECLAIM.Flags.UserRole, -1 );
    }
  }

  async prepareDerivedData() {
    this.derivedRole = new ReclaimUserRole( this.getFlag( game.system.id, RECLAIM.Flags.UserRole ) );
  }

  async getData( options ) {
    let result = await super.getData( options );
    return result;
  }

  validate( options ) {
    return super.validate( options );
  }
}
