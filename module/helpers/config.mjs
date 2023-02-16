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
      let assignedRoles = scene.getFlag( game.system.id, RECLAIM.Flags.UserSceneRole );
      if ( !assignedRoles ) {
        return;
      }

      return assignedRoles[ user.id ];
    },
    getUserDeck( user ) {
      return user.getFlag( game.system.id, RECLAIM.Flags.UserCardHandId );
    }
  }
};


