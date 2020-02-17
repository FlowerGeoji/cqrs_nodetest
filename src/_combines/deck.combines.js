import _ from 'lodash'

export default {
  'CARD_ADDED': async (event, reducers) => {
    const{payload: {cardId}} = event
    const card = reducers['Card']({aggregateId: cardId})
    console.log({card})

    if(_.isEmpty(card)) throw Error(`There invalid card. cardId: ${cardId}`)
  }
}