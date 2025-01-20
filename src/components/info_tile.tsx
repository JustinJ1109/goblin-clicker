import React from "react"
import "../styles/info_tile.css"

type Props = {
    infoType: "gold" | "lumber" | "food",
    data?: string,
}

const colorVariants = {
    food: "bg-lime-600 hover:bg-lime-700",
    lumber: "bg-amber-700 hover:bg-amber-800",
    gold: "bg-orange-400 hover:bg-orange-500"
}

const InfoTile = ({ infoType, data }: Props) => {

    return (
        <div className={`info-tile-container ${colorVariants[infoType]}`}>
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