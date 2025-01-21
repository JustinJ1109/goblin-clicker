import React from "react"
import "../styles/info_tile.css"
import { Resources } from "../schemas/schema"

type Props = {
    infoType: keyof Resources,
    data?: string,
}

const colorVariants: Partial<Record<keyof Resources, string>> = {
    food: "bg-lime-600 hover:bg-lime-700",
    lumber: "bg-amber-700 hover:bg-amber-800",
    gold: "bg-orange-400 hover:bg-orange-500",
    goblins: "bg-green-800 hover:bg-green-900",
    houses: "bg-blue-400 hover:bg-blue-500 text-black-800"
}

const InfoTile = ({ infoType, data }: Props) => {

    return (
        <div className={`info-tile-container ${colorVariants[infoType]} text-center`}>
            <div className="info info-title">
                {infoType[0].toUpperCase() + infoType.slice(1)}
            </div>
            <div className="info info-data">
                {data}
            </div>
        </div>
    )
}

export default InfoTile