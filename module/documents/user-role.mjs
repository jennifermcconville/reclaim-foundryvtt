

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
      this.#currentRole = ReclaimUserRole.roleNames[ 0 ];
    }
  }

  isValid() {
    return this.#currentRole >= 0 && this.#currentRole < ReclaimUserRole.RoleNames.count;
  }
}
