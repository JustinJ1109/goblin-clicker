import React, { useState } from "react";
import InfoTile from "./info_tile";
import { MaxResources, Resources } from "../schemas/schema";




type Props = {
    resources: Resources
    maxResources: MaxResources
}

const ResourceBar = ({ resources, maxResources }: Props) => {

    return (
        <div>
            <InfoTile infoType="food" data={`${resources.food} / ${maxResources.maxFood}`} />
            <InfoTile infoType="lumber" data={`${resources.lumber} / ${maxResources.maxLumber}`} />
            <InfoTile infoType="gold" data={`${resources.gold} / ${maxResources.maxGold}`} />

        </div>
    )
}

export default ResourceBar