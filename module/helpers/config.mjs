/* eslint-disable no-undef */


export const RECLAIM = {
  Flags: {
    ConnectedDeckId: `ReclaimConnectedDeckId`,
    AutoDrawLimit: `ReclaimDrawLimit`,
    ConnectedDeckArray: `ReclaimConnectedDecks`,
    CardSpawnsActorId: `ReclaimCardsActorSpawnId`,
    TokenSpawnedByCardId: `ReclaimTokenCardId`,
    UserCardHandId: `ReclaimUserCardHandId`,
    DrawOnPlay: `ReclaimDrawOnPlay`,
    UserSceneRole: `ReclaimSceneUserRole`
  },
  InputFields:
  {
    ConnectedDeckId: `ReclaimConnectedDeckId`,
    AutoDrawLimit: `ReclaimDrawLimit`
  },
  FoundryFolderNames: {
    CardHands: `Card Hands`,
    PlayerCardHands: `Player's Hands`,
    Macros: `Reclaim Macros`,
    RevealedCards: `Reclaim Revealed Cards`
  },
  SceneRoles: {
    Observer: `Observer`,
    Farmer: `Farmer`,
    Housing: `Housing`,
    Treatment: `Treatment`,
    Contractor: `Contractor`
  },
  Hooks: {
    PlayersValidated: `ReclaimHookPlayerValidated`,
    PlayerRoleChanged: `ReclaimHookPlayerRoleChanged`
  },
  DeckNames: {
    Revealed: {
      Cost: `Costs Deck`,
      Discard: `Discard Pile`,
      FarmLevel2: `Farm Level 2 Deck`,
      FarmLevel1: `Farms Level 1 Deck`,
      HousingLevel1: `Housing Level 1 Deck`,
      HousingLevel2: `Housing Level 2 Deck`,
      Transportation: `Transportation Deck`,
      TreatmentLevel1: `Treatment Level 1 Deck`,
      TreatmentLevel2: `Treatment Level 2 Deck`
    }
  },
  Helpers: {
    getUserSceneRole( scene, user ) {
      const result = user.getFlag( game.system.id, RECLAIM.Flags.UserSceneRole );
      if ( result ) {
        return result[ scene.id ];
      }

      // Let assignedRoles = scene.getFlag( game.system.id, RECLAIM.Flags.UserSceneRole );
      // if ( !assignedRoles ) {
      //   return;
      // }

      // return assignedRoles[ user.id ];
    },
    setUserSceneRole( scene, user, role ) {
      user.setFlag( game.system.id, RECLAIM.Flags.UserSceneRole, {
        [ scene.id ]: role
      } );

      // Scene.setFlag( game.system.id, RECLAIM.Flags.UserSceneRole, {
      //   [ user.id ]: role
      // } );
    },
    getUserDeck( user ) {
      return user.getFlag( game.system.id, RECLAIM.Flags.UserCardHandId );
    },
    getNextRole( role ) {
      let result = null;

      switch ( role ) {
        case RECLAIM.SceneRoles.Housing:
          result = RECLAIM.SceneRoles.Treatment;
          break;

        case RECLAIM.SceneRoles.Treatment:
          result = RECLAIM.SceneRoles.Farmer;
          break;

        case RECLAIM.SceneRoles.Farmer:
          result = RECLAIM.SceneRoles.Contractor;
          break;

        case RECLAIM.SceneRoles.Contractor:
          result = RECLAIM.SceneRoles.Housing;
          break;

        default:
          break;
      }

      return result;
    }
  }
};


