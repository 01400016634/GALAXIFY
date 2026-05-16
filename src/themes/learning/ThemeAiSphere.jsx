import React from 'react';
import * as THREE from 'three';
import { CinematicCanvas, LearningLayout } from '../SharedEngine';

export const ThemeAiSphere = () => {
    const setupScene = (ctx) => {
        ctx.scene.background = new THREE.Color('#000000');
        const coreGroup = new THREE.Group();
        const innerGlow = new THREE.Mesh(new THREE.SphereGeometry(3.5, 64, 64), new THREE.MeshBasicMaterial({ color: 0x0044ff }));
        const geo = new THREE.IcosahedronGeometry(4.2, 4);
        const neuralNet = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending }));
        const neuralPoints = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, blending: THREE.AdditiveBlending }));

        coreGroup.add(innerGlow, neuralNet, neuralPoints);
        ctx.scene.add(coreGroup);
        ctx.animatedObjects.push({ obj: coreGroup, type: 'rotate-complex-slow' });

        for (let i = 0; i < 3; i++) {
            ctx.addGlowingRing(7 + i, 0x00aaff, 0.1).rotation.x = Math.PI / 2;
        }
        ctx.addParticles(0x00ffff, 2000, 0.08, 'stars', 0.8);
    };
    return (
        <>
            <CinematicCanvas setupScene={setupScene} tintColor={[0.6, 1.3, 1.8]} />
            <div className="hidden"><LearningLayout ui={{ title: '', sub: '', cta: '', accent: '' }} /></div>
        </>
    );
};