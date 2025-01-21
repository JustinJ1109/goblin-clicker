export type Resources = {
    lumber: number,
    food: number,
    gold: number,
    goblins: object[],
    houses?: number,
}

export type MaxResources = {
    gold: number,
    lumber: number,
    food: number,
    goblins: number,
    houses: number
}

export interface ClickerGenerator {
    yieldPerTick?: Partial<Record<keyof Resources, number>>,
    count: number,
    cost: Partial<Record<keyof Resources, number>>,
    multiplier?: number,
    upkeepPerTick?: Partial<Record<keyof Resources, number>>
    maxIncreaseOnBuild?: Partial<Record<keyof Resources, number>>,
    yieldOnBuild?: Partial<Record<keyof Resources, number>>
}