import _ from 'lodash'

export default {
  createCard: (state, command) => {
    const {aggregateId, payload} = command

    if (!_.isEmpty(state)) {
      throw Error(`Card is already exist. id: ${aggregateId}`)
    }
    if (_.isEmpty(payload)) {
      throw Error(`Payload is empty. payload: ${payload}`)
    }

    return {
      type: 'CARD_CREATED',
      payload
    }
  },
  editCard: () =>{}
}