/* eslint-disable react/no-unknown-property */
import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Center, Environment } from "@react-three/drei";
import * as THREE from "three";
import "./ModelViewer.css";

// Import the model
import modelGLB from "./assets/demo/model.glb";

function Model() {
  const meshRef = useRef();
  const { scene } = useGLTF(modelGLB);

  // Clone the scene so we can safely reuse it
  const clonedScene = scene.clone(true);

  // Traverse to apply materials if needed
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Tăng độ sáng và giảm độ tối của vật liệu
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              if (mat.roughness !== undefined)
                mat.roughness = Math.min(mat.roughness, 0.6);
              if (mat.metalness !== undefined)
                mat.metalness = Math.max(mat.metalness, 0.2);
            });
          } else {
            if (child.material.roughness !== undefined)
              child.material.roughness = Math.min(
                child.material.roughness,
                0.6,
              );
            if (child.material.metalness !== undefined)
              child.material.metalness = Math.max(
                child.material.metalness,
                0.2,
              );
          }
        }
      }
    });
  }, [clonedScene]);

  // Auto-rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={meshRef}>
      <Center>
        <primitive object={clonedScene} scale={1} />
      </Center>
    </group>
  );
}

export default function ModelViewer() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="model-viewer-wrapper">
      <Canvas
        camera={{
          position: [0, 0, isMobile ? 3.5 : 2.5],
          fov: isMobile ? 50 : 45,
        }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), 0);
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        {/* Environment lighting (HDRI) */}
        <Suspense fallback={null}>
          <Environment
            preset="city"
            background={false}
            blur={0.5}
            environmentIntensity={1.2}
          />
        </Suspense>

        {/* Main Ambient Light */}
        <ambientLight intensity={1.0} color="#ffffff" />

        {/* Key Light - chính, sáng từ trên xuống */}
        <directionalLight
          position={[3, 5, 5]}
          intensity={2.5}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Fill Light - phụ từ bên trái */}
        <directionalLight
          position={[-5, 3, -5]}
          intensity={0.8}
          color="#aaccff"
        />

        {/* Fill Light từ dưới lên - loại bỏ bóng tối phía dưới */}
        <directionalLight
          position={[0, -4, 2]}
          intensity={0.6}
          color="#88bbff"
        />

        {/* Rim Light - ánh sáng viền phía sau */}
        <directionalLight
          position={[-2, 1, -5]}
          intensity={1.0}
          color="#ffffff"
        />

        {/* Spot Light - ánh sáng tập trung từ trên */}
        <spotLight
          position={[0, 6, 2]}
          intensity={0.8}
          angle={0.5}
          penumbra={0.4}
          color="#ffffff"
        />

        {/* Hemisphere light */}
        <hemisphereLight args={["#88ccff", "#334466", 0.6]} />

        {/* Model */}
        <Model />

        {/* Controls: orbit + zoom */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          rotateSpeed={isMobile ? 0.5 : 1.0}
          zoomSpeed={isMobile ? 0.5 : 1.0}
          minDistance={1.5}
          maxDistance={8}
          autoRotate={false}
          target={[0, 0, 0]}
        />
      </Canvas>

      {/* Hint overlay */}
      <div className="model-viewer-hint">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a10 10 0 1 0 10 10h-2.5A7.5 7.5 0 1 1 12 4.5V2z" />
          <path d="M12 2v8h8" />
          <path d="M12 6a6 6 0 1 0 6 6h-2a4 4 0 1 1-4-4V6z" />
        </svg>
        <span>Drag to rotate · Scroll to zoom</span>
      </div>
    </div>
  );
}
