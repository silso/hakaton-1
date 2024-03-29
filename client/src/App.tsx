import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei'
import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { TileData } from './classes/TileData'
import Tile from './components/Tile'
import * as Colyseus from 'colyseus.js'

import './style.css'
import { GameRoomState } from './schema/GameRoomState'
import Game from './components/Game'
import initializeMap from './initializeMap'
import _ from 'lodash'

const MAP_WIDTH = 4
let clientGameRoom: Game = new Game(
    new Colyseus.Room<GameRoomState>('defaultGameRoom')
)

// returns a list of the 2D array of Tiles that make up the Map
function Map(props: {
    tileDataList: TileData[]
    selectedTile: number
    handleSelection: (tile: number) => void
}) {
    return (
        <>
            {props.tileDataList.map((tileData: TileData) => (
                <Tile
                    key={tileData.id}
                    tileData={tileData}
                    selectedTile={props.selectedTile}
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

function Environment(props: { initialTileList: TileData[] }) {
    const [tileDataList, setTileDataList] = useState(props.initialTileList)
    const [selectedTileId, setSelectedTileId] = useState(-1)
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

    function swapTileColors(id1: number, id2: number) {
        const index1 = tileDataList.findIndex((e) => e.id == id1)
        const index2 = tileDataList.findIndex((e) => e.id == id2)

        setTileDataList(() => {
            const newDataList = _.cloneDeep(tileDataList)
            const tempColor = newDataList[index1].color
            console.log('color1 is ', tempColor)
            console.log('color2 is ', newDataList[index2].color)
            newDataList[index1].color = newDataList[index2].color
            newDataList[index2].color = tempColor
            return newDataList
        })
        // let color1 = '',
        //     color2 = ''
        // tileDataList.forEach((e) => {
        //     if (e.id == id1) color1 = e.color
        //     if (e.id == id2) color2 = e.color
        // })
        // if (!color1 || !color2) {
        //     console.error('Error: swapTileColors could not find colors!')
        //     return
        // }
        // setTileDataList((currTileData: TileData[]) => {
        //     return currTileData.map((tile) => {
        //         if (tile.id == id1) {
        //             tile.color = color2 ?? 'black'
        //         } else if (tile.id == id2) {
        //             tile.color = color1 ?? 'black'
        //         }
        //         return tile
        //     })
        // })
    }

    // TODO - currently poc functionality, need to sync up with server's swap and movement actions
    function handleSelection(tileId: number) {
        console.log('in handleSelection')
        // setTileDataList((currTileData: TileData[]) => {
        //     return currTileData.map((tile) => {
        //         // console.log('handleSelection data: ', data)
        //         // console.log('handleSelection tile: ', tileId)
        //         if (tile.id === tileId) {
        //             console.log(`setting ${selectedTile.id} to false selected`)
        //             selectedTile.selected = false
        //             setSelectedTile(tile)
        //         }
        //         return tile
        //     })
        // })
        // NEW METHOD USING SPREAD OPERATOR, since updating an array in place may not re-render the component
        setTileDataList((currTileData: TileData[]) => {
            const previousTileId = selectedTileId
            setSelectedTileId(tileId)
            return currTileData.map((tile) => {
                if (tile.id == tileId || tile.id == previousTileId) {
                    // second || condition is for temp test purposes, to allow for tiles to switch colors
                    const newTile = { ...tile }
                    // newTile.color = tile.id == tileId ? 'magenta' : 'white' // TEST PURPOSES
                    return newTile
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
            <button type="button" onClick={() => swapTileColors(0, 1)}>
                Call swapTileColors(0, 1)!
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
                    selectedTile={selectedTileId}
                    handleSelection={handleSelection}
                />
            </Canvas>
        </>
    )
}

export default function App() {
    const initialTileList: TileData[] = initializeMap(MAP_WIDTH)
    return <Environment initialTileList={initialTileList} />
}
