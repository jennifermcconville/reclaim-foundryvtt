/* eslint-disable no-undef */

import { RECLAIM } from "../helpers/config.mjs";

export class ReclaimCard extends Card {

  /**
   * @inheritdoc
   * @override */
  prepareDerivedData() {
    super.prepareDerivedData();

    if ( this.flags.reclaim ) {
      console.debug( `Found card with reclaim flags! Card:${this.id}, Actor:${this.flags.reclaim.ReclaimCardsActorSpawnId}` );
    }
  }
}

Hooks.on( `dropCanvasData`, async function( ...args ) {
  if ( args[ 1 ].type !== `Card` ) {
    return;
  }

  const card = game.cards.get( args[ 1 ].cardsId ).cards.get( args[ 1 ].cardId );

  if ( !card?.flags?.reclaim?.ReclaimCardsActorSpawnId ) {
    notifyCardMissingActor( card );
    return;
  }

  // Magic numbers since we don't know what the token size will be
  const newPos = { x: args[ 1 ].x - 50, y: args[ 1 ].y - 50 };
  spawnActor( card.flags.reclaim[ CONFIG.RECLAIM.Flags.CardSpawnsActorId ], args[ 0 ].scene, newPos );
  moveCard( card, game.user );
}
);

/**
 *  Spawns a token based on the sent in actorId and positiong
 * @param {string} actorId      Id of actor you want to spawn
 * @param {Scene} scene         The scene in which the Actor's token should be created
 * @param {object} pos          Object with float x and y float properties
 * @param {float} pos.x
 * @param {float} pos.y
 *
 */
async function spawnActor( actorId, scene, pos = { x, y } ) {
  if ( !actorId ) {
    return;
  }

  const actor = game.actors.get( actorId );
  const tokenDocument = await actor.getTokenDocument( { x: pos.x, y: pos.y } );
  let newToken = await TokenDocument.create( tokenDocument, {
    parent: scene
  } );

  console.debug( `Reclaim token from card created. NewTokenId: ${newToken.id}
  Position: (${newToken.x},${newToken.y})` );
}

/**
 *  Send a message to the chat notifying the users that the card they just dragged onto the scene
 *  doesn't have an actor assigned to it and can't create a token.
 * @param {Card} source
 */
async function notifyCardMissingActor( source ) {
  const messageData = {
    type: CONST.CHAT_MESSAGE_TYPES.OTHER,
    content: `
    <div class="cards-notification flexrow">
      <img class="icon" src="${source.img}" alt="${source.name}">
      <p>This card doesn't have an actor associated with it and cannot spawn a token.</p>
    </div>`
  };
  ChatMessage.applyRollMode( messageData, game.settings.get( `core`, `rollMode` ) );
  ChatMessage.create( messageData );
}

/**
 *  Removes the card from it's current container and places it in the player's hand
 *
 * @param {ReclaimCard} card
 * @param {User} targetUser
 */
async function moveCard( card, targetUser ) {
  if ( !card || !targetUser ) {
    return;
  }

  const usersCardHandId = targetUser.getFlag( game.system.id, RECLAIM.Flags.UserCardHandId );
  const usersCardHand = game.cards.find( card => card.id === usersCardHandId );
  if ( !usersCardHand ) {
    return;
  }

  card.pass( usersCardHand );
}
