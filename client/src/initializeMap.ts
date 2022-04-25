import { TileData } from "./classes/TileData";

export default function initializeMap(MAP_WIDTH: number): TileData[] {
	const tileOffset = MAP_WIDTH / 2 - 0.5
	const initialTileDataList: TileData[] = Array(MAP_WIDTH)
        .fill(0)
        .reduce(
            (acc, _, i) =>
                acc.concat(
                    Array(MAP_WIDTH)
                        .fill(0)
                        .map(
                            (_, j) =>
                                new TileData(
                                    10 * i + j,
                                    i - tileOffset,
                                    0,
                                    j - tileOffset
                                )
                        )
                ),
            []
        )

	const design = ['red', 'yellow', 'yellow', 'blue', 'red', 'blue', 'green', 'green']
	for(let i = 0; i < initialTileDataList.length; i++) {
		if(i <= design.length-1) {
			initialTileDataList[i].color = design[i]
		} else {
			initialTileDataList[i].color = design[design.length * 2 - i - 1]
		}
	}

	return initialTileDataList
}