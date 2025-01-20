import { useState } from 'react'
import './styles/App.css'
import InfoTile from './components/info_tile'
import ResourceBar from './components/resource_bar'
import ClickerPanel from './components/clicker_panel'
import { MaxResources, Resources } from './schemas/schema'

function App() {

  const [resources, setResources] = useState<Resources>({
    gold: 0,
    lumber: 0,
    food: 0,
    goblins: []
  })

  const [maxResources, setMaxResources] = useState<MaxResources>({
    maxGold: 500,
    maxLumber: 500,
    maxFood: 500,
    maxGoblins: 10
  })

  return (
    <>
      <ResourceBar resources={resources} maxResources={maxResources} />
      <ClickerPanel resources={resources} maxResources={maxResources} setResources={setResources} setMaxResources={setMaxResources} />
    </>
  )
}

export default App
