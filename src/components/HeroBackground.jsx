import React, { useMemo } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

function SymbolSVG() {
  const data = useLoader(SVGLoader, "/symbol.svg");
  const shapes = useMemo(
    () => data.paths.flatMap((path) => path.toShapes(true)),
    [data]
  );

  return (
    <group scale={[0.018, -0.009, 0.018]} position={[-8, 5, -4]}>
      {shapes.map((shape, i) => (
        <mesh key={i}>
          <shapeGeometry args={[shape]} />
          <meshBasicMaterial color="#4fc3f7" opacity={0.1} transparent />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroBackground() {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
      <Canvas className="pointer-events-none w-full h-full">
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 5, 5]} intensity={0.5} />
        <SymbolSVG />
      </Canvas>
    </div>
  );
}
