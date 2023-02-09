

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
    Macros: `Reclaim Macros`
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
  }
};


