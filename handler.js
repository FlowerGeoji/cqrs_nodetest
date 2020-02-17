import commandResolver from './src/core/commandResolver'
import Connector from './src/core/Connector'
import config from './src/core/config'

export const hello = async (event, context) => {
  console.log({event})
  console.log({context})
  const connector = await Connector(config)
  console.log({connector})
  return await commandResolver(connector, JSON.parse(event.body))
};
