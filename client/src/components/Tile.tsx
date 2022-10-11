import { useFrame } from '@react-three/fiber'
import React, { useEffect, useRef, useState } from 'react'
import { DoubleSide } from 'three'
import { TileData } from '../classes/TileData'
import {
    Selection,
    Select,
    EffectComposer,
    Outline,
} from '@react-three/postprocessing'

// type selectionFunction = (tile: TileData) => TileData;

function Tile(props: {
    tileData: TileData
    selectedTile: number
    handleSelection: (id: number) => void
}) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [isOutlined, setIsOutlined] = useState(false)

    useEffect(() => {
        // TODO: setState is asynchronous, cannot request the state right after to get the updated value https://dev.to/anantbahuguna/3-mistakes-to-avoid-when-updating-react-state-45gp
        console.log(`inside useEffect for tile ${props.tileData.id}`)
        console.log(`current selectedTile: ${props.selectedTile}`)
        document.title = `Tile is ${props.selectedTile}` // DEBUG PURPOSES

        if (props.tileData.id == props.selectedTile) {
            setIsOutlined(true)
            console.log(`Tile ${props.tileData.id} outline is TRUE`)
        } else {
            setIsOutlined(false)
            console.log(`Tile ${props.tileData.id} outline is FALSE`)
        }
    }, [props.tileData])

    // for funny kooky animations haha
    useFrame(() => {
        // ref.current.rotation.z += (Math.random() - 0.5) * 0.2
        // ref.current.rotation.y += (Math.random() - 0.5) * 0.2
        // ref.current.rotation.x += (Math.random() - 0.5) * 0.2
        // ref.current.position.y +=
        //     ref.current.position.y <= 0
        //         ? Math.random() * 0.05
        //         : ref.current.position.y >= 1
        //         ? Math.random() * -0.05
        //         : Math.random() * 0.05
    })
    // console.log('inside Tile', props.tileData)

    function selectTile() {
        console.log(
            `%cTile ${props.tileData.id} was clicked!`,
            'color:red;font-size:20px'
        )
        if (props.tileData.id == props.selectedTile) {
            // if tile is already selected, unselect and set id -1 as selectedTile
            console.log('Tile is already selected, should deselect...')
            props.handleSelection(-1)
            return
        }
        props.handleSelection(props.tileData.id)
    }

    function TileBox() {
        const ref = useRef<THREE.Mesh>(null!)
        return (
            <Select enabled={true}>
                <mesh
                    ref={ref}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={[1, 1, 1]}
                    position={[
                        props.tileData.x,
                        props.tileData.y,
                        props.tileData.z,
                    ]}
                    onClick={selectTile}
                    // onPointerOver={() => setIsOutlined(true)}
                    // onPointerOut={() => setIsOutlined(false)}
                >
                    <boxGeometry args={[0.8, 0.8, 0.2]} />
                    <meshBasicMaterial
                        color={props.tileData.color}
                        transparent
                        opacity={0.4}
                        side={DoubleSide}
                    />
                </mesh>
            </Select>
        )
    }

    return (
        <>
            {isOutlined ? (
                <Selection>
                    <EffectComposer multisampling={1} autoClear={false}>
                        <Outline
                            blur
                            visibleEdgeColor={0xffaa00}
                            edgeStrength={100}
                            width={500}
                        />
                    </EffectComposer>
                    <TileBox />
                </Selection>
            ) : (
                <TileBox />
            )}
        </>
    )
}

export default Tile
