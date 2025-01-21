import React from "react";
import InfoTile from "./info_tile";
import { MaxResources, Resources } from "../schemas/schema";

type Props = {
    resources: Resources
    maxResources: MaxResources
}

const ResourceBar = ({ resources, maxResources }: Props) => {

    return (
        <div className="flex">
            <InfoTile infoType="food" data={`${resources.food || 0} / ${maxResources.food}`} />
            <InfoTile infoType="lumber" data={`${resources.lumber || 0} / ${maxResources.lumber}`} />
            <InfoTile infoType="gold" data={`${resources.gold || 0} / ${maxResources.gold}`} />
            <InfoTile infoType="goblins" data={`${resources.goblins.length} / ${maxResources.goblins}`} />
            <InfoTile infoType="houses" data={`${resources.houses} / ${maxResources.houses}`} />
        </div>
    )
}

export default ResourceBar