import React from 'react';
import * as THREE from 'three';
import { CinematicCanvas, RealEstateLayout } from '../SharedEngine';

export const ThemeSkylineEstate = () => {
    const setupScene = (ctx) => {
        ctx.scene.background = new THREE.Color('#000000');

        // Grid floor representing city coordinates
        const gridHelper = new THREE.GridHelper(60, 30, 0x00ffff, 0x111122);
        gridHelper.position.y = -5;
        ctx.scene.add(gridHelper);

        // Abstract holographic skyscraper blocks
        const cityGroup = new THREE.Group();
        const buildingMat = new THREE.MeshStandardMaterial({
            color: 0x050510,
            roughness: 0.1,
            metalness: 0.9,
            transparent: true,
            opacity: 0.7
        });

        for (let i = 0; i < 35; i++) {
            const h = Math.random() * 14 + 4;
            const w = Math.random() * 2.5 + 1;
            const geo = new THREE.BoxGeometry(w, h, w);
            const building = new THREE.Mesh(geo, buildingMat);

            building.position.set(
                (Math.random() - 0.5) * 45,
                h / 2 - 5,
                (Math.random() - 0.5) * 45
            );

            // Luminous neon edges for the buildings
            const edges = new THREE.EdgesGeometry(geo);
            const line = new THREE.LineSegments(
                edges,
                new THREE.LineBasicMaterial({ color: i % 2 === 0 ? 0x00ffff : 0xaa00ff })
            );
            building.add(line);
            cityGroup.add(building);
        }
        ctx.scene.add(cityGroup);
        ctx.animatedObjects.push({ obj: cityGroup, type: 'rotate-slow-y', speed: 0.03 });

        // Neon atmospheric lighting
        const light1 = new THREE.PointLight(0x00ffff, 300, 60);
        light1.position.set(20, 20, 20);
        const light2 = new THREE.PointLight(0xaa00ff, 300, 60);
        light2.position.set(-20, 10, -20);
        ctx.scene.add(light1, light2);

        ctx.addParticles(0x00ffff, 1500, 0.05, 'dust', 0.5);
    };

    return (
        <>
            <CinematicCanvas setupScene={setupScene} tintColor={[0.8, 1.1, 1.6]} />
            <div className="hidden">
                <RealEstateLayout ui={{ title: '', sub: '', cta: '', accent: '' }} />
            </div>
        </>
    );
};