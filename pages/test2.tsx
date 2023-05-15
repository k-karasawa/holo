import { useRef } from 'react'
import { Color, AdditiveBlending, ShaderMaterial } from 'three'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { OrbitControls, Sparkles, useGLTF, useTexture } from '@react-three/drei'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
    vUv = uv;
  }
`;

const fragmentShader = `
  #pragma glslify: cnoise3 = require(glsl-noise/classic/3d.glsl) 
  uniform float uTime;
  uniform vec3 uColorStart;
  uniform vec3 uColorEnd;
  varying vec2 vUv;
  void main() {
    vec2 displacedUv = vUv + cnoise3(vec3(vUv * 7.0, uTime * 0.1));
    float strength = cnoise3(vec3(displacedUv * 5.0, uTime * 0.2));
    float outerGlow = distance(vUv, vec2(0.5)) * 4.0 - 1.4;
    strength += outerGlow;
    strength += step(-0.2, strength) * 0.8;
    strength = clamp(strength, 0.0, 1.0);
    vec3 color = mix(uColorStart, uColorEnd, strength);
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <encodings_fragment>
  }
`;

const PortalMaterial = new ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColorStart: { value: new Color('hotpink') },
    uColorEnd: { value: new Color('white') },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

extend({ PortalMaterial });

export default function Test2({ scale = Array.from({ length: 50 }, () => 0.5 + Math.random() * 4) }) {
  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: 'rgb(26, 30, 57)' }}>
      <Canvas camera={{ fov: 45, position: [-4, 2, -4] }} colorManagement={false}>
        <Sparkles count={scale.length} size={scale} position={[0, 0.9, 0]} scale={[4, 1.5, 4]} speed={0.3} />
        <Model />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

function Model(props) {
  const portalMaterial = useRef(PortalMaterial)
  const bakedTexture = useTexture('/baked-02.jpeg')
  const { nodes } = useGLTF('/portal-2.glb')
  useFrame((state, delta) => (portalMaterial.current.uniforms.uTime.value += delta))
  return (
    <group {...props} dispose={null} position={[0, 0, 0]} scale={[1, 1, 1]}>
      <mesh geometry={nodes.portalCircle.geometry} position={[0, 0.78, 1.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <primitive attach="material" object={portalMaterial.current} />
      </mesh>
      <mesh geometry={nodes.lampLightL.geometry} material-color="#f0bf94" position={[0.89, 1.07, -0.14]} scale={[0.07, 0.11, 0.07]} />
      <mesh geometry={nodes.lampLightR.geometry} material-color="#f0bf94" position={[-0.98, 1.07, -0.14]} scale={[-0.07, 0.11, 0.07]} />
      <mesh geometry={nodes.baked.geometry} position={[0.9, 0.34, -1.47]} rotation={[0, 0.14, 0]}>
        <meshBasicMaterial map={bakedTexture} map-flipY={false} />
      </mesh>
    </group>
  )
}

