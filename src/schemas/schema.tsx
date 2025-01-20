export type Resources = {
    lumber: number,
    food: number,
    gold: number,
    goblins: []
}

export type MaxResources = {
    maxGold: number,
    maxLumber: number,
    maxFood: number,
    maxGoblins: number
}

export interface ClickerGenerator {
    perTick: number,
    count: number,
    cost: Partial<Record<keyof Resources, number>>
}