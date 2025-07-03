import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

export default function InteractiveGlobe() {
  const navigate = useNavigate();
  const isDragging = useRef(false);
  const pointerDown = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    isDragging.current = false;
    pointerDown.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    const dx = Math.abs(e.clientX - pointerDown.current.x);
    const dy = Math.abs(e.clientY - pointerDown.current.y);
    if (dx > 5 || dy > 5) {
      isDragging.current = true;
    }
  };

  const handlePointerUp = () => {
    if (!isDragging.current) {
      navigate("/explore");
    }
  };

  return (
    <div
      className="cursor-pointer w-full h-[400px] md:h-[500px]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls enableZoom={true} enablePan={false} />
        <Stars radius={100} depth={50} count={2000} factor={4} fade speed={2} />
        <Sphere args={[2.5, 64, 64]}>
          <meshStandardMaterial
            map={new THREE.TextureLoader().load("/images/earth-texture.jpg")}
            metalness={0.4}
            roughness={0.7}
          />
        </Sphere>
      </Canvas>
    </div>
  );
}