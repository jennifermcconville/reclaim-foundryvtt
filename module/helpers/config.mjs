

export const RECLAIM = {
  Flags: {
    ConnectedDeckId: `ReclaimConnectedDeckId`,
    AutoDrawLimit: `ReclaimDrawLimit`,
    ConnectedDeckArray: `ReclaimConnectedDecks`,
    CardSpawnsActorId: `ReclaimCardsActorSpawnId`,
    TokenSpawnedByCardId: `ReclaimTokenCardId`,
    UserCardHandId: `ReclaimUserCardHandId`,
    DrawOnPlay: `ReclaimDrawOnPlay`,
    UserSceneRole: `ReclaimSceneUserRole`,
    GameState: `ReclaimGameState`
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
  GameState: {
    RolesNotSelected: `RolesNotSelected`
  },
  Hooks: {
    PlayersValidated: `ReclaimHookPlayerValidated`,
    PlayerRolesChanged: `ReclaimHookPlayerRolesChanged`
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
  }
};


