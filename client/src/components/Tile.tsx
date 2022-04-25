import { Edges } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'
import { DoubleSide } from 'three'
import { TileData } from '../classes/TileData'

// type selectionFunction = (tile: TileData) => TileData;

function Tile(props: {
    tileData: TileData
    handleSelection: (id: number) => void
}) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ref = useRef<THREE.Mesh>(null!)

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
        props.handleSelection(props.tileData.id)
    }

    return (
        <>
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
            >
                <boxBufferGeometry args={[0.8, 0.8, 0.2]} />
                <meshBasicMaterial
                    color={props.tileData.color}
                    transparent
                    opacity={0.4}
                    side={DoubleSide}
                />
                <Edges
                    scale={1}
                    threshold={15} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
                    color="black"
                />
            </mesh>
        </>
    )
}

export default Tile
