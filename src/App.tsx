import React, { useEffect, useState } from 'react'
import './styles/App.css'
import ResourceBar from './components/resource_bar'
import ClickerPanel from './components/clicker_panel'
import { MaxResources, Resources } from './schemas/schema'

function App() {
  const [resources, setResources] = useState<Resources>({
    gold: 0,
    lumber: 0,
    food: 0,
    goblins: [],
    houses: 2
  })

  const [maxResources, setMaxResources] = useState<MaxResources>({
    gold: 1000,
    lumber: 1000,
    food: 1000,
    goblins: 2 + (resources.houses || 0) * 2,
    houses: 6
  })

  return (
    <>
      <ResourceBar resources={resources} maxResources={maxResources} />
      <div className='bg-slate-800 content-center'>
        <ClickerPanel resources={resources} maxResources={maxResources} setResources={setResources} setMaxResources={setMaxResources} />
      </div>
    </>
  )
}

export default App
