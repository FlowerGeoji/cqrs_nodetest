import _ from 'lodash'

export default {
  createDeck: (state, command) => {
    const {aggregateId, payload} = command

    if (!_.isEmpty(state)) {
      throw Error(`Deck is already exist. id: ${aggregateId}`)
    }
    if (_.isEmpty(payload)) {
      throw Error(`Payload is empty. payload: ${payload}`)
    }

    return {
      type: 'DECK_CREATED',
      payload
    }
  },
  addCard: (state, command) => {
    const {aggregateId, payload} = command
    
    if (_.isEmpty(state)) {
      throw Error(`There is no Deck. id: ${aggregateId}`)
    }

    return {
      type: 'CARD_ADDED',
      payload
    }
  }
}