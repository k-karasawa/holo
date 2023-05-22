import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Text, Stars, Group } from '@react-three/drei';
import dynamic from 'next/dynamic';

const ParticlesBg = dynamic(() => import('particles-bg'), { ssr: false });

interface ModelProps {
  textRef: React.MutableRefObject<Group | null>;
}

function Model({ textRef }: ModelProps) {
  const [model, setModel] = useState<Group | null>(null);
  const { scene } = useGLTF('/models/mproject.glb', true);
  const modelRef = useRef<Group>();

  useEffect(() => {
    if (scene) {
      setModel(scene);
    }
  }, [scene]);

  // Add rotation on Y-axis.
  useFrame(({ clock }) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = clock.getElapsedTime();
    }
  });

  return (
    <>
      {model ? (
        <primitive
          ref={modelRef}
          object={model}
          position={[0, -1, 0]}
          scale={[0.6, 0.6, 0.6]}
        />
      ) : null}
    </>
  );
}

function RotatingStars() {
  const groupRef = useRef<Group>();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = clock.getElapsedTime() * 0.1;
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade={true} />
    </group>
  );
}

export default function NewPage() {
  const textRef = useRef<Group | null>(null);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas style={{ background: '#000000' }}>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 1, 0]} intensity={1} />
        <Model textRef={textRef} />
        <RotatingStars />
      </Canvas>
    </div>
  );
}
