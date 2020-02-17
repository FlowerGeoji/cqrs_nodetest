import _ from 'lodash'

export default {
  'DECK_CREATED': (state, event) => {
    const {payload} = event

    return {
      ...payload
    }
  },
  'CARD_ADDED': (state, event) => {
    const {payload: {cardId}} = event

    return {
      ...state,
      cards: _.isEmpty(state.cards) ? [cardId] : _.concat(state.cards, cardId)
    }
  }
}