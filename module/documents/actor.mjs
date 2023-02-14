/* eslint-disable no-undef */

export class ReclaimActor extends Actor {

  static metadata = Object.freeze( mergeObject( super.metadata, {
    label: `RECLAIM.Actor`,
    labelPlural: `RECLAIM.Actors`
  }, { inplace: false } ) );

}
