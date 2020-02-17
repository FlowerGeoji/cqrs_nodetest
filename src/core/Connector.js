import _ from 'lodash'

export default async (config={}) => {
  const commands = {}
  const reducers = {}
  const combines = {}

  const {aggregates} = config
  const keys = _.keys(aggregates)
  for(const key of keys) {
    // commands
    const {default: commandsMap} = await import(`../_aggregates/${_.toLower(key)}.commands`)
    _.set(commands, `${key}`, ({state, command})=>{
      return _.castArray(commandsMap[command.type](state, command))
    })

    // reducers
    const {default: reducersMap} = await import(`../_aggregates/${_.toLower(key)}.reducers`)
    _.set(reducers, `${key}`, ({aggregateId, state, events})=>{
      const _state = state ? state : readSnapshot(key, aggregateId)
      const _events = events ? events : readEvents(key, aggregateId)

      return _.reduce(_events, (state, event)=>{
        return reducersMap[event.type](state, event)
      }, _state)
    })

    // combines
    try {
      const {default: combinesMap} = await import(`../_combines/${_.toLower(key)}.combines`)
      if (combinesMap) {
        _.set(combines, `${key}`, async ({event})=>{
          const combine = combinesMap[event.type]
          if (combine) await combine(event, reducers)
        })
      }
    }
    catch(error) {
      console.warn(error)
    }
  }

  return {
    commands,
    reducers,
    combines
  }
}



//// MOCKING (Snapshot)  ////
const readSnapshot = (aggregateName, aggregateId) => {
  return {}
}
//// MOCKING (Snapshot)  ////

//// MOCKING (EventStore)  ////
const readEvents = (aggregateName, aggregateId) => {
  return _.filter(eventsStore, event=>(_.isEqual(event.aggregateName, aggregateName) && _.isEqual(event.aggregateId, aggregateId)))
}

const eventsStore = [
  {aggregateName: 'Card', aggregateId: 'card1', type:'CARD_CREATED', payload: {word: 'WORD', voice: 'voice1'}},
  {aggregateName: 'Card', aggregateId: 'card2', type:'CARD_CREATED', payload: {word: 'Sentence', voice: 'voice2'}},
  {aggregateName: 'Deck', aggregateId: 'deck1', type:'DECK_CREATED', payload: {name: 'deck_words'}},
  {aggregateName: 'Deck', aggregateId: 'deck1', type:'CARD_ADDED', payload: {cardId: 'card1'}},
  {aggregateName: 'Card', aggregateId: 'card1', type:'CARD_EDITED', payload: {word: 'Word_edited', voice: 'voice1_edited'}},
]
//// MOCKING (EventStore)  ////