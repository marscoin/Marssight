import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function Mars() {
  const meshRef = useRef<THREE.Mesh>(null)

  // Mars texture from local file
  const marsTexture = useTexture('/marsgeo.jpg')

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={marsTexture}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  )
}

function MarsWithAtmosphere() {
  const atmosphereRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <group>
      <Mars />
      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef} scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#ff6b4a"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={1.8} color="#fff5e6" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#ff6b4a" />
      <Suspense fallback={null}>
        <MarsWithAtmosphere />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
    </>
  )
}

interface MarsGlobeProps {
  className?: string
  size?: number
}

export function MarsGlobe({ className = '', size = 200 }: MarsGlobeProps) {
  return (
    <div
      className={`${className}`}
      style={{ width: size, height: size }}
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 30 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}

// Simpler fallback version using CSS (no WebGL)
export function MarsGlobeFallback({ className = '' }: { className?: string }) {
  return (
    <div className={`mars-planet mars-glow-intense ${className}`} />
  )
}
