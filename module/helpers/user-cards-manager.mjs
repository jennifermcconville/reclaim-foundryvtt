/* eslint-disable no-undef */

import { RECLAIM } from "./config.mjs";
import { ReclaimConnectedCards } from "../documents/connected-cards.mjs";

export class UserCardsManager {

  static async onReady() {
    const cardFolders = await UserCardsManager.ensureCardFolders(
      RECLAIM.FoundryFolderNames.CardHands,
      RECLAIM.FoundryFolderNames.PlayerCardHands
    );

    await game.users.forEach( user => {
      let newHand = false;
      let flag = user.getFlag( game.system.id, RECLAIM.Flags.UserCardHandId );
      if ( !flag ) {
        UserCardsManager.createUserCardHand( user, cardFolders );
        newHand = true;
      }

      let userHandPromise = game.cards.find( cardHand => cardHand.id === flag );
      if ( !userHandPromise ) {
        userHandPromise = UserCardsManager.createUserCardHand( user, cardFolders );
        newHand = true;
      }

      if ( newHand ) {
        if ( userHandPromise.then ) {
          userHandPromise.then( value => {
            UserCardsManager.assingToMiniCardHand( user, value );
          } );
        } else {
          UserCardsManager.assingToMiniCardHand( user, userHandPromise );
        }
      }
    } );
  }


  /**
   * Make sure that the hand is displayed as the bottom card collection of hand-mini-bar for this user.
   * @param {User}user
   * @param {Cards}hand
   */
  static async assingToMiniCardHand( user, hand ) {
    user.setFlag( HandMiniBarModule.moduleName, `CardsID-0`, hand.id );
  }

  /**
   * Creates a new Hand and assigns this user it's Id via flag. Also makes sure mini-card-hand displays it as the bottom
   *  card collection
   *
   * @param {User} user
   * @param {CardFolders} cardFolders
   * @returns {Cards}
   */
  static async createUserCardHand( user, cardFolders ) {
    if ( !user || !cardFolders || !cardFolders.playerHands ) {
      return;
    }

    const newHand = await ReclaimConnectedCards.create( {
      name: `${user.name} Hand`,
      folder: cardFolders.playerHands,
      type: `hand`
    } );

    user.setFlag( game.system.id, RECLAIM.Flags.UserCardHandId, newHand.id );

    return newHand;
  }

  /**
   * Ensures that the Cards tab in Foundry has a folder to contain card hands
   * with a subfolder from player card hands.
   * @param {string} cardHandFolderName
   * @param {string} playerHandSubfolderName
   *
   * @returns {CardFolders}
   */
  static async ensureCardFolders( cardHandFolderName, playerHandSubfolderName ) {
    let cardHandsFolder = game.folders.find( folder => folder.name === cardHandFolderName );
    let playerHandsFolder = game.folders.find( folder => folder.name === playerHandSubfolderName );

    if ( !cardHandsFolder ) {
      cardHandsFolder = Folder.create( {
        name: cardHandFolderName,
        type: `Cards` }
      );
    }

    if ( !playerHandsFolder ) {
      playerHandsFolder = await Folder.create( {
        name: RECLAIM.FoundryFolderNames.PlayerCardHands,
        type: `Cards`,
        parent: cardHandsFolder
      } );
    }

    return {
      cardHands: cardHandsFolder,
      playerHands: playerHandsFolder
    };
  }
}
