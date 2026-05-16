import React from 'react';
import * as THREE from 'three';
import { CinematicCanvas, RealEstateLayout } from '../SharedEngine';

export const ThemeDreamHall = () => {
    const setupScene = (ctx) => {
        ctx.scene.background = new THREE.Color('#000000');
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.05 }));
        floor.rotation.x = -Math.PI / 2; floor.position.y = -6;
        ctx.scene.add(floor);

        const sculpture = new THREE.Mesh(
            new THREE.TorusKnotGeometry(4.5, 1.8, 512, 128),
            new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 0.0, clearcoat: 1, transmission: 0.5, ior: 2.0 })
        );
        ctx.scene.add(sculpture);
        ctx.animatedObjects.push({ obj: sculpture, type: 'float-spin-slow' });

        for (let i = 0; i < 3; i++) {
            const ring = ctx.addGlowingRing(12 + i * 2, 0xffffff, Math.PI / 2, 0);
            ring.material.opacity = 0.15;
        }

        const light1 = new THREE.DirectionalLight(0xffffff, 8); light1.position.set(15, 30, 15);
        const light2 = new THREE.DirectionalLight(0xeebbcc, 4); light2.position.set(-15, 15, -15);
        ctx.scene.add(light1, light2);
    };

    return (
        <>
            <CinematicCanvas setupScene={setupScene} tintColor={[1.0, 1.0, 1.2]} />
            <div className="hidden">
                <RealEstateLayout ui={{ title: '', sub: '', cta: '', accent: '' }} />
            </div>
        </>
    );
};