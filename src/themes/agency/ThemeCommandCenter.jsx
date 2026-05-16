import React from 'react';
import * as THREE from 'three';
import { CinematicCanvas, AgencyLayout } from '../SharedEngine';

export const ThemeCommandCenter = () => {
    const setupScene = (ctx) => {
        ctx.scene.background = new THREE.Color('#000000');
        const earthGroup = new THREE.Group();
        const earthCore = new THREE.Mesh(new THREE.SphereGeometry(4.5, 64, 64), new THREE.MeshBasicMaterial({ color: 0x000000 }));
        const earthDots = new THREE.Mesh(new THREE.SphereGeometry(4.6, 128, 128), new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending }));
        earthGroup.add(earthCore, earthDots);
        ctx.scene.add(earthGroup);
        ctx.animatedObjects.push({ obj: earthGroup, type: 'rotate-slow-y', speed: 0.15 });

        const uiGroup = new THREE.Group();
        const panelMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.2, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
        for (let i = 0; i < 12; i++) {
            const panel = new THREE.Mesh(new THREE.PlaneGeometry(5, 3), panelMat);
            const angle = (i / 12) * Math.PI * 2;
            panel.position.set(Math.cos(angle) * 8, (Math.random() - 0.5) * 5, Math.sin(angle) * 8);
            panel.lookAt(0, 0, 0);

            const lines = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 2.8), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.3 }));
            lines.position.z = 0.01;
            panel.add(lines);
            uiGroup.add(panel);
        }
        ctx.scene.add(uiGroup);
        ctx.animatedObjects.push({ obj: uiGroup, type: 'rotate-slow-y', speed: -0.05 });

        ctx.addGlowingRing(7, 0x00ffff, 0.05).rotation.x = Math.PI / 2;
        ctx.addParticles(0x00aaff, 2000, 0.08, 'dust', 0.7);
    };

    return (
        <>
            <CinematicCanvas setupScene={setupScene} tintColor={[0.7, 1.3, 1.7]} />
            <div className="hidden">
                <AgencyLayout ui={{ title: '', sub: '', cta: '', accent: '' }} />
            </div>
        </>
    );
};