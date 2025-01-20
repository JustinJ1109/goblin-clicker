import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ClickableTile from "./clickable_tile";
import { ClickerGenerator, MaxResources, Resources } from "../schemas/schema";

type Props = {
    resources: Resources,
    setResources: Dispatch<SetStateAction<Resources>>,
    maxResources: MaxResources,
    setMaxResources: Dispatch<SetStateAction<MaxResources>>
}



const passiveGenerators: Record<string, ClickerGenerator> = {
    miningOutpost: {
        perTick: 5,
        cost: {
            "gold": 10
        },
        count: 0
    }
}

const ClickerPanel = ({ ...props }: Props) => {
    const [miningOutposts, setMiningOutposts] = useState(0);
    const miningOutpostsRef = useRef(miningOutposts)

    const onTick = () => {
        props.setResources((prev) => ({ ...prev, "gold": Math.min(prev.gold + (miningOutpostsRef.current * passiveGenerators.miningOutpost.perTick), props.maxResources.maxGold) }))
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
    }, [miningOutposts])

    // called on mount
    useEffect(() => {
        console.log("Interval created")
        const tickInterval = setInterval(onTick, 500)

        // called on unmount
        return () => {
            clearInterval(tickInterval)
        }
    }, [])

    const maybeDevelopCiv = (objData: ClickerGenerator, setObj: Dispatch<SetStateAction<number>>) => {
        type CommodityResources = Omit<Resources, "goblins">

        const canAfford = Object.keys(objData.cost).every((currency) => {
            const cost = objData.cost[currency as keyof CommodityResources]
            const currentResource = props.resources[currency as keyof CommodityResources]
            return currentResource >= (cost || 0)
        })
        if (!canAfford) {
            console.log("Can't afford")
            return false
        }

        props.setResources((prev) => ({
            ...prev,
            ...Object.keys(objData.cost).reduce((acc, currency) => {
                const cost = objData.cost[currency as keyof CommodityResources]
                acc[currency as keyof CommodityResources] =
                    Math.max(0, (prev[currency as keyof CommodityResources] || 0) - (cost || 0))
                return acc
            }, {} as Partial<CommodityResources>)
        }))
        setObj((prev) => prev + 1)

    }


    return (
        <div>
            <ClickableTile text="Mine" onClick={() => maybeIncrement(props.resources.gold, "gold", props.maxResources.maxGold, 1)} />
            <ClickableTile text="Chop Trees" onClick={() => maybeIncrement(props.resources.lumber, "lumber", props.maxResources.maxLumber, 1)} />

            <ClickableTile text="Build Mining Outpost" cost={passiveGenerators.miningOutpost.cost} subText={miningOutpostsRef.current.toString()} onClick={() => maybeDevelopCiv(passiveGenerators.miningOutpost, setMiningOutposts)} />
        </div>
    )
}

export default ClickerPanel