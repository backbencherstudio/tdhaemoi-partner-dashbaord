"use client";
import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { STLLoader } from "three-stdlib";

function StlModel({ url }: { url: string }) {
    const geometry = useLoader(STLLoader, url);
    return (
        <mesh geometry={geometry} scale={0.008} position={[0, 0, 0]}>
            <meshStandardMaterial
                color="#b08d6e"
                metalness={0.1}
                roughness={0.8}
                transparent={true}
                opacity={0.97}
            />
        </mesh>
    );
}

export default function StlModelViewer({ url }: { url: string }) {
    if (!url)
        return (
            <div className="w-full h-60 flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
                No 3D Preview
            </div>
        );
    return (
        <div style={{ width: "100%", height: 450 }}>
            <Canvas
                camera={{
                    position: [0, 2, 4],
                    fov: 50,
                    near: 0.1,
                    far: 1000
                }}
            // style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
            >
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[15, 15, 10]}
                    intensity={0.7}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />
                <pointLight position={[-10, -10, -5]} intensity={0.15} />
                <pointLight position={[10, -10, 5]} intensity={0.2} />

                <Suspense fallback={null}>
                    <Stage
                        environment="city"
                        intensity={0.4}
                        shadows
                    >
                        <StlModel url={url} />
                    </Stage>
                </Suspense>

                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    autoRotate={false}
                    autoRotateSpeed={1.5}
                    minDistance={1}
                    maxDistance={50}
                    dampingFactor={0.08}
                    enableDamping={true}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI}
                    minAzimuthAngle={-Infinity}
                    maxAzimuthAngle={Infinity}
                    zoomSpeed={1.2}
                    panSpeed={1.5}
                    rotateSpeed={1.0}
                    target={[0, 0, 0]}
                />
            </Canvas>
        </div>
    );
}