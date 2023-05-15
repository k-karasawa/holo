import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Text } from '@react-three/drei';
import { Group } from 'three';
import dynamic from 'next/dynamic';

const ParticlesBg = dynamic(() => import('particles-bg'), { ssr: false });

interface ModelProps {
  textRef: React.MutableRefObject<Group | null>;
}

function Model({ textRef }: ModelProps) {
  const [model, setModel] = useState<Group | null>(null);
  const { scene } = useGLTF('/models/tochi.gltf', true);
  const modelRef = useRef<Group>();

  useEffect(() => {
    if (scene) {
      setModel(scene);
    }
  }, [scene]);

  return (
    <>
      {model ? (
        <primitive
          ref={modelRef}
          object={model}
          position={[0, 0, 0]}
          scale={[0.6, 0.6, 0.6]}
        />
      ) : null}
    </>
  );
}

export default function NewPage() {
  const textRef = useRef<Group | null>(null);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
     
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 1, 0]} intensity={1} />
        <Model textRef={textRef} />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}
