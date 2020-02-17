import _ from 'lodash'

const commandResolver = async (connector, command={}) => {
  try {
    // 1. command validation
    console.log({command})
    const {
      aggregateId,
      aggregateName,
      type,
    } = command

    if (_.isEmpty(aggregateId))
      throw Error(`Command must have Aggregate Id - [id: ${aggregateId}]`)
    if (_.isEmpty(aggregateName))
      throw Error(`Command must have Aggregate Name - [name: ${aggregateName}]`)
    if (_.isEmpty(type))
      throw Error(`Invalid command type - [type: ${type}]`), {statusCode: 400}
    
    // 2. read snapshot & events from store
    // 3. reduce snapshot & event

    const prevState = connector.reducers[aggregateName]({aggregateId})
    console.log({prevState})

    // 3. handle command & create events
    const nextEvents = connector.commands[aggregateName]({state: prevState, command})
    console.log({nextEvents})
    //-- todo: save event here?????????? --

    const combines = connector.combines[aggregateName]
    console.log({combines})
    if (combines) {
      for(const event of nextEvents) {
        await combines({event})
      }
    }
    //-- todo: save event here?????????? --
    
    const nextState = connector.reducers[aggregateName]({state: prevState, events: nextEvents})
    console.log({nextState})

    return {statusCode: 200, body: JSON.stringify(nextState)}
  }
  catch(error) {
    console.error(error)
    return {statusCode: 400, body: JSON.stringify({error: error.message})}
  }
}

export default commandResolver