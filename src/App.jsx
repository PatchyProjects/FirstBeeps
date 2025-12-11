import { useRef, useState } from 'react'
import './App.css'
import { Canvas, useFrame } from '@react-three/fiber'
import { Grid, OrbitControls } from '@react-three/drei'
import { MeshBasicMaterial } from 'three'
import * as Tone from 'tone'

const colors = ['#EFD9CE', '#DEC0F1', '#B79CED', '#957FEF', '#7161EF', '#ffc8dd', '#ffafcc', '#cdb4db']
const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
const synth = new Tone.PolySynth(Tone.Synth).toDestination();

const Ground = () => {

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial color={colors[0]} />
    </mesh>
  )
}

const Cube = ({ position , size, color, note}) => {
  const ref = useRef()
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  useFrame((state, delta) => {

  })

  const playSound = () => {
    synth.triggerAttackRelease(note, "8n");
  }
  return (

    // <mesh position={position} ref={ref}>
    <mesh ref={ref} position = {position}
        scale={isPressed ? 0.9 : isHovered ? 1.1 : 1}
        // position = {[position.x,position.y,isPressed ? position.z -0.1 : position.z]}
        onPointerOver={() => {setIsHovered(true); playSound();}}
        onPointerOut={() => setIsHovered(false)}
        onPointerDown={() => {setIsPressed(true); playSound();}}
        onPointerUp={() => setIsPressed(false)}
      >
      
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />

    </mesh>
  )
}

const ButtonGrid = ({ position, size, rows, cols, spacing=0.1}) => {
  const groupRef = useRef()
  const [activeIndex, setActiveIndex] = useState(null)

   return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: rows * cols }).map((_, index) => {
        const row = Math.floor(index / cols)
        const col = index % cols
        const x = (col - cols / 2) * (size.x + spacing) + size.x / 2
        const y = (row - rows / 2) * (size.y + spacing) + size.y / 2

        return (
          <Cube 
            position={[x, y, 0]} 
            size={[size.x, size.y, size.z]} 
            color={colors[index % colors.length]} 
            note={notes[index % notes.length]}
          />
        )
      })}
    </group>
  )
}

const Scene = () => {
   
  return (
    <>

    {/* <Ground /> */}
    <ButtonGrid position={[0, 0, 0]} size={{x: 1, y: 1}} rows={5} cols={5} spacing={.1} />
    <ambientLight intensity={.5} />
    <pointLight position={[0, 5, -15]} intensity={100}/>
    {/* <OrbitControls /> */}

    </>
  )
}

function App() {


  return (
    <Canvas shadows camera={{ position: [0, 0, -20], fov: 25 }} >
      <Scene />
    </Canvas>
  )
}

export default App
