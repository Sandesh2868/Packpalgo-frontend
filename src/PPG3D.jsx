// PPG3D.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Stars } from "@react-three/drei";
import { Suspense } from "react";

export default function PPG3D() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Stars />

        {/* Rotated 3D Text saying "PPG" */}
        <Text
          position={[0, 0, 0]}
          rotation={[0.3, 0.6, 0]}
          fontSize={2}
          color="#4fc3f7"
          wireframe
          maxWidth={200}
          letterSpacing={-0.05}
        >
          PPG
        </Text>

        <OrbitControls />
      </Suspense>
    </Canvas>
  );
}
