import React from 'react';
import * as THREE from 'three';
import { CinematicCanvas, EcommerceLayout } from '../SharedEngine';

export const ThemeSpaceMarket = () => {
    const setupScene = (ctx) => {
        ctx.scene.background = new THREE.Color('#000000');

        // Galactic trading outpost station
        const stationGroup = new THREE.Group();
        const coreMat = new THREE.MeshPhysicalMaterial({ color: 0x111122, metalness: 0.9, roughness: 0.1, clearcoat: 1.0 });
        const core = new THREE.Mesh(new THREE.OctahedronGeometry(3, 1), coreMat);
        stationGroup.add(core);

        // Glowing trade rings revolving around the core
        for (let i = 0; i < 2; i++) {
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(5.5 + i * 1.5, 0.08, 16, 100),
                new THREE.MeshBasicMaterial({ color: i === 0 ? 0x00ffff : 0xffaa00, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending })
            );
            ring.rotation.x = Math.PI / 2 + (i * 0.4);
            stationGroup.add(ring);
        }
        ctx.scene.add(stationGroup);
        ctx.animatedObjects.push({ obj: stationGroup, type: 'rotate-slow-y', speed: 0.08 });

        // Floating cargo freighter boxes floating around in orbit
        const cargoGroup = new THREE.Group();
        const cargoMat = new THREE.MeshBasicMaterial({ color: 0x00ffaa, wireframe: true, transparent: true, opacity: 0.4 });
        const boxGeo = new THREE.BoxGeometry(0.5, 0.5, 0.8);
        for (let i = 0; i < 15; i++) {
            const crate = new THREE.Mesh(boxGeo, cargoMat);
            crate.position.set((Math.random() - 0.5) * 25, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 25);
            cargoGroup.add(crate);
            ctx.animatedObjects.push({ obj: crate, type: 'float-spin', speed: 0.5 + Math.random() });
        }
        ctx.scene.add(cargoGroup);

        // Deep space neon point lights
        const light1 = new THREE.PointLight(0x00ffff, 250, 50); light1.position.set(12, 8, 12);
        const light2 = new THREE.PointLight(0xffaa00, 250, 50); light2.position.set(-12, -8, -12);
        ctx.scene.add(light1, light2);

        ctx.addParticles(0x00aaff, 3000, 0.06, 'stars', 0.7);
    };

    return (
        <>
            <CinematicCanvas setupScene={setupScene} tintColor={[0.6, 1.2, 1.5]} />
            <div className="hidden">
                <EcommerceLayout ui={{ title: '', sub: '', cta: '', accent: '' }} />
            </div>
        </>
    );
};