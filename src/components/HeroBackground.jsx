import React, { useMemo } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

function SymbolSVG() {
  const data = useLoader(SVGLoader, "/symbol.svg");

  const shapes = useMemo(() => {
    return data.paths.flatMap((path) => path.toShapes(true));
  }, [data]);

  return (
    <group scale={[0.02, -0.01, 0.02]} position={[-10, 2, -4]}>
      {shapes.map((shape, i) => (
        <mesh key={i}>
          <shapeGeometry args={[shape]} />
          <meshBasicMaterial color="#4fc3f7" wireframe />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroBackground() {
  return (
    <Canvas className="absolute top-0 left-0 w-full h-full z-0">
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} />
      <OrbitControls enableZoom={false} />
      <SymbolSVG />
    </Canvas>
  );
}
