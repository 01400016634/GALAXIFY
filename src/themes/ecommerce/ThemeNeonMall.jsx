import React from 'react';
import * as THREE from 'three';
import { CinematicCanvas, EcommerceLayout } from '../SharedEngine';

// 1. Remove the word "export" from the front of the function
const ThemeNeonMall = () => {
    const setupScene = (ctx) => {
        ctx.scene.background = new THREE.Color('#000000');
        const monolithGroup = new THREE.Group();
        const core = new THREE.Mesh(new THREE.BoxGeometry(3.8, 15.8, 3.8), new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 1, roughness: 0.0, clearcoat: 1 }));
        const shell = new THREE.Mesh(new THREE.BoxGeometry(4.2, 16.2, 4.2), new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending }));
        const glow = new THREE.Mesh(new THREE.BoxGeometry(3.5, 15.5, 3.5), new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending }));
        monolithGroup.add(core, shell, glow);
        ctx.scene.add(monolithGroup);
        ctx.animatedObjects.push({ obj: monolithGroup, type: 'float-spin-slow' });

        for (let i = 0; i < 4; i++) ctx.addGlowingRing(6 + i * 1.5, i % 2 === 0 ? 0xff00ff : 0x00ffff, 0.03);
        ctx.addParticles(0x00ffff, 2000, 0.1, 'rain', 0.8);

        const light1 = new THREE.PointLight(0xff00ff, 200, 50); light1.position.set(10, 5, 5);
        const light2 = new THREE.PointLight(0x00ffff, 200, 50); light2.position.set(-10, -5, 5);
        ctx.scene.add(light1, light2);
    };

    return (
        <>
            <CinematicCanvas setupScene={setupScene} tintColor={[1.2, 0.8, 1.6]} />
            <div className="hidden">
                <EcommerceLayout ui={{ title: '', sub: '', cta: '', accent: '' }} />
            </div>
        </>
    );
};

// 2. Add this single line at the very bottom of the file
export default ThemeNeonMall;