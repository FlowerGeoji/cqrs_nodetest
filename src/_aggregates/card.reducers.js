export default {
  'CARD_CREATED': (state, event) => {
    const {payload} = event

    return {
      ...payload
    }
  },
  'CARD_EDITED': (state, event) => {
    const {payload} = event

    return {
      ...state,
      ...payload
    }
  }
}