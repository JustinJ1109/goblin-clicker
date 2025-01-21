import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ClickableTile from "./clickable_tile";
import { ClickerGenerator, MaxResources, Resources } from "../schemas/schema";

type Props = {
    resources: Resources,
    setResources: Dispatch<SetStateAction<Resources>>,
    maxResources: MaxResources,
    setMaxResources: Dispatch<SetStateAction<MaxResources>>
}

const ClickerPanel = ({ ...props }: Props) => {
    const [miningOutposts, setMiningOutposts] = useState<ClickerGenerator>({
        yieldPerTick: {
            gold: 2
        },
        cost: {
            gold: 10,
            lumber: 20
        },
        count: 5
    });
    
    const [farms, setFarms] = useState<ClickerGenerator>({
        yieldPerTick: {
            food: 2
        },
        cost: {
            gold: 10,
            lumber: 5
        },
        count: 0
    });

    const [houses, setHouses] = useState<ClickerGenerator>({
        cost: {
            lumber: 20,
            gold: 10
        },
        upkeepPerTick: {
            food: 5
        },
        yieldOnBuild: {
            houses: 1
        },
        maxIncreaseOnBuild: {
            goblins: 2
        },
        count: 2,
    })

    const [storageHuts, setStorageHuts] = useState<ClickerGenerator>({
        cost: {
            lumber: 300,
            gold: 400
        },
        upkeepPerTick: {
            food: 5
        },
        maxIncreaseOnBuild: {
            gold: 1000,
            lumber: 1000,
            food: 1000,
        },
        count: 0,
    })

    const [loggingOutposts, setLoggingOutposts] = useState<ClickerGenerator>({
        cost: {
            // lumber: 10,
            // gold: 20
        },
        upkeepPerTick: {
            gold: 10
        },
        count: 5,
        yieldPerTick: {
            lumber: 2
        }
    })

    const miningOutpostsRef = useRef(miningOutposts)
    const farmsRef = useRef(farms)
    const houseRef = useRef(houses)
    const loggingOutpostsRef = useRef(loggingOutposts)
    const storageHutRef = useRef(storageHuts)

    const onTick = () => {
        type CommodityResources = Omit<Resources, "goblins">
        const structureRefs = [miningOutpostsRef, farmsRef, loggingOutpostsRef, houseRef]

        structureRefs.forEach((structureRef) => {
            if (structureRef.current.yieldPerTick !== undefined) {
                props.setResources((prev) => ({
                    ...prev,
                    ...Object.keys(structureRef.current.yieldPerTick).reduce((acc, currency) => {
                        const newCurrency = Math.min(
                            (prev[currency as keyof CommodityResources] || 0) +
                                (structureRef.current.count * (structureRef.current.yieldPerTick[currency as keyof CommodityResources] || 0)), 
                            props.maxResources[currency as keyof MaxResources])
                        acc[currency as keyof CommodityResources] = newCurrency
                        return acc
                    }, {} as Partial<CommodityResources>)
                }))
            }
        })
    }

    const maybeIncrement = (resource: number, resourceKey: keyof Resources, maxResource: number, amt: number) => {
        if (resource >= maxResource) {
            return
        }
        else {
            props.setResources((prev) => ({ ...prev, [resourceKey]: Math.min(resource + amt, maxResource) }))
        }
    }

    useEffect(() => {
        miningOutpostsRef.current = miningOutposts
        farmsRef.current = farms
        houseRef.current = houses
        loggingOutpostsRef.current = loggingOutposts
        storageHutRef.current = storageHuts
    }, [miningOutposts, farms, houses, loggingOutposts, storageHuts])

    // called on mount
    useEffect(() => {
        console.log("Interval created")
        const tickInterval = setInterval(onTick, 500)

        // called on unmount
        return () => {
            console.log("Cleared interval")
            clearInterval(tickInterval)
        }
    }, [props.maxResources])

    const maybeDevelopCiv = (objData: ClickerGenerator, setObj: Dispatch<SetStateAction<ClickerGenerator>>) => {
        type CommodityResources = Omit<Resources, "goblins">

        const canAfford = Object.keys(objData.cost).every((currency) => {
            const cost = objData.cost[currency as keyof CommodityResources]
            const currentResource = props.resources[currency as keyof CommodityResources]
            return (currentResource || 0) >= (cost || 0)
        })

        if (!canAfford) {
            console.log("Can't afford")
            return false
        }

        // remove cost from resources (purchase the structure)
        props.setResources((prev) => ({
            ...prev,
            ...Object.keys(objData.cost).reduce((acc, currency) => {
                const cost = objData.cost[currency as keyof CommodityResources]
                acc[currency as keyof CommodityResources] = (prev[currency as keyof CommodityResources] || 0) - (cost || 0)
                return acc
            }, {} as Partial<CommodityResources>)
        }))

        if ("yieldOnBuild" in objData && objData.yieldOnBuild !== undefined) {
            const hasRoom = Object.keys(objData.yieldOnBuild).every((currency) => {
                return props.resources[currency as keyof CommodityResources] < props.maxResources[currency as keyof MaxResources]
            })
            if (!hasRoom) {
                console.log("Cannot expand")
                return false
            }
            props.setResources((prev) => ({
                ...prev,
                ...Object.keys(objData.yieldOnBuild).reduce((acc, currency) => {
                    const incr = objData.yieldOnBuild[currency as keyof CommodityResources]
                    acc[currency as keyof CommodityResources] = (prev[currency as keyof CommodityResources] || 0) + (incr || 0)
                    return acc
                }, {} as Partial<CommodityResources>)
            }))
        }
        
        if ("maxIncreaseOnBuild" in objData && objData.maxIncreaseOnBuild !== undefined) {
            props.setMaxResources((prev) => ({
                ...prev,
                ...Object.keys(objData.maxIncreaseOnBuild).reduce((acc, currency) => {
                    const incr = objData.maxIncreaseOnBuild[currency as keyof MaxResources]
                    acc[currency as keyof MaxResources] = (prev[currency as keyof MaxResources] || 0) + (incr || 0)
                    return acc
                }, {} as Partial<MaxResources>)
            }))

        }



        // set the next one's cost
        const newCost: Partial<Record<keyof Resources, number>> = { ...objData.cost }
        Object.keys(objData.cost).forEach(currency => {
            newCost[currency as keyof Resources] = Math.ceil((objData.cost[currency as keyof CommodityResources] || 0) * Math.ceil((objData.count + 1) / 2) * 1.1)
        });

        setObj((prev) => ({ ...prev, "count": prev.count + 1, "cost": newCost }))
    }

    return (
        <div className="grid grid-cols-3">
            <ClickableTile text="Mine" onClick={() => maybeIncrement(props.resources.gold, "gold", props.maxResources.gold, 1)} />
            <ClickableTile text="Chop Trees" onClick={() => maybeIncrement(props.resources.lumber, "lumber", props.maxResources.lumber, 1)} />

            <ClickableTile text="Build Mining Outpost" cost={miningOutpostsRef.current.cost} subText={miningOutpostsRef.current.count.toString()} onClick={() => maybeDevelopCiv(miningOutpostsRef.current, setMiningOutposts)} />
            <ClickableTile text="Build Logging Outpost" cost={loggingOutpostsRef.current.cost} subText={loggingOutpostsRef.current.count.toString()} onClick={() => maybeDevelopCiv(loggingOutpostsRef.current, setLoggingOutposts)} />
            <ClickableTile text="Build Farm" cost={farmsRef.current.cost} subText={farmsRef.current.count.toString()} onClick={() => maybeDevelopCiv(farmsRef.current, setFarms)} />
            <ClickableTile text="Build House" cost={houseRef.current.cost} subText={houseRef.current.count.toString()} onClick={() => maybeDevelopCiv(houseRef.current, setHouses)} />
            <ClickableTile text="Build Storage Hut" cost={storageHutRef.current.cost} subText={storageHutRef.current.count.toString()} onClick={() => maybeDevelopCiv(storageHutRef.current, setStorageHuts)} />
        </div>
    )
}

export default ClickerPanel