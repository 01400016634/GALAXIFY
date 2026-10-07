import React from 'react';
import * as THREE from 'three';
import { CinematicCanvas, EcommerceLayout } from '../SharedEngine';

export const ThemeGoldenPrestige = () => {
    const setupScene = (ctx) => {
        ctx.scene.background = new THREE.Color('#000000');
        const goldMat = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, metalness: 1, roughness: 0.1, clearcoat: 1, emissive: 0x442200 });
        const rings = new THREE.Group();
        for (let i = 0; i < 8; i++) {
            const r = new THREE.Mesh(new THREE.TorusGeometry(3 + i * 1.2, 0.15, 64, 256), goldMat);
            r.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            rings.add(r);
            ctx.animatedObjects.push({ obj: r, type: 'rotate-random', speed: 0.4 + i * 0.1 });
        }
        ctx.scene.add(rings);
        const core = new THREE.Mesh(new THREE.SphereGeometry(2.5, 128, 128), new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0, metalness: 1 }));
        ctx.scene.add(core);

        const light1 = new THREE.PointLight(0xffffff, 300, 50); light1.position.set(10, 10, 10);
        const light2 = new THREE.PointLight(0xffaa00, 300, 50); light2.position.set(-10, -10, -10);
        ctx.scene.add(light1, light2);
        ctx.addParticles(0xffaa00, 2000, 0.05, 'dust', 0.8);
    };
    return (
        <>
            <CinematicCanvas setupScene={setupScene} tintColor={[1.6, 1.2, 0.7]} />
            <div className="hidden"><EcommerceLayout ui={{ title: '', sub: '', cta: '', accent: '' }} /></div>
        </>
    );
};