import {
    Html,
    OrbitControls,
    PerspectiveCamera,
    Stars,
} from '@react-three/drei'
import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { TileData } from './classes/TileData'
import Tile from './components/Tile'
import * as Colyseus from 'colyseus.js'

import './style.css'
import { GameRoomState } from './schema/GameRoomState'
import Game from './components/Game'
import initializeMap from './initializeMap'

const MAP_WIDTH = 4
let clientGameRoom: Game = new Game(
    new Colyseus.Room<GameRoomState>('defaultGameRoom')
)

// returns a list of the 2D array of Tiles that make up the Map
function Map(props: {
    tileDataList: TileData[]
    handleSelection: (tile: number) => void
}) {
    return (
        <>
            {props.tileDataList.map((tileData: TileData) => (
                <Tile
                    key={tileData.id}
                    tileData={tileData}
                    handleSelection={props.handleSelection}
                />
            ))}
        </>
    )
}

// TODO: Make a tile component that uses custom react hooks that are also clickable
// Consider using zustand or Recoil state management libraries to handle metadata of each tile
// Currently it renders all tiles when one is clicked, is there a way to only render the updated one using useEffect?
// Make API calls (eventually to colyseus api)

async function createGame(): Promise<void> {
    try {
        const client = new Colyseus.Client('ws://localhost:2567')
        clientGameRoom = new Game(await client.joinOrCreate('game-room'))
        clientGameRoom.initialize()
        // clientGameRoom.sendTestMessage()
        // clientGameRoom.listenTest()
    } catch (error) {
        console.log('oh no an error creating the game: ', error)
    }
}

function Environment(props: { initialTileDataList: TileData[] }) {
    const [tileDataList, setTileDataList] = useState(props.initialTileDataList)
    const [selectedTile, setSelectedTile] = useState(new TileData(-1, 0, 0, 0))
    // const [gameRoom, setGameRoom] = useState(new Colyseus.Room<GameRoomState>(''))

    useEffect(() => {
        console.log('calling createGame..')
        createGame()
    }, [])

    useEffect(() => {
        // console.log('omg data color')
    }, [tileDataList])

    function handleButtonPress(): void {
        clientGameRoom.sendTestMessage()
    }

    // TODO - currently poc functionality, need to sync up with server's swap and movement actions
    function handleSelection(tileId: number) {
        setTileDataList((currTileData: TileData[]) => {
            return currTileData.map((tile) => {
                // console.log('handleSelection data: ', data)
                // console.log('handleSelection tile: ', tileId)
                if (tile.id === tileId) {
                    selectedTile.selected = false
                    console.log(`setting previous tile ${tile.id} to false`)
                    setSelectedTile(tile)
                    console.log(`setting new tile ${tile.id} to true`)
                    selectedTile.selected = true
                }
                return tile
            })
        })
    }

    return (
        <>
            <button type="button" onClick={handleButtonPress}>
                Call sendTestMessage!
            </button>
            <Canvas>
                <OrbitControls />
                <Stars />
                <color attach="background" args={['black']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <PerspectiveCamera position={[-2, 5, 0]} makeDefault />
                <Map
                    tileDataList={tileDataList}
                    handleSelection={handleSelection}
                />
            </Canvas>
        </>
    )
}

export default function App() {
    const initialTileDataList: TileData[] = initializeMap(MAP_WIDTH)
    return <Environment initialTileDataList={initialTileDataList} />
}
