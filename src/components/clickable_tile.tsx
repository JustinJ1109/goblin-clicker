import React, { MouseEventHandler } from "react"
import { Resources } from "../schemas/schema"


type Props = {
    text: string,
    subText?: string,
    onClick: MouseEventHandler,
    cost?: Partial<Record<keyof Resources, number>>
}

const ClickableTile = ({ text, subText = "", onClick, cost }: Props) => {
    return (
        <div className="unselectable-text rounded-md bg-slate-500 hover:bg-slate-600 min-h-20 m-5" onClick={onClick}>
            {text} {subText && `(${subText})`}
            {cost &&
                Object.keys(cost).map((k, i) => {
                    return (
                        <div key={`${k}${i}`}>
                            {k[0].toUpperCase() + k.slice(1)}: {cost[k as keyof Resources]}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ClickableTile