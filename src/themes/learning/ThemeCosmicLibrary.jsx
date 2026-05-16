import React from 'react';
import * as THREE from 'three';
import { CinematicCanvas, LearningLayout } from '../SharedEngine';

export const ThemeCosmicLibrary = () => {
    const setupScene = (ctx) => {
        ctx.scene.background = new THREE.Color('#000000');
        const astrolabe = new THREE.Group();
        const matGold = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, metalness: 1, roughness: 0.1, clearcoat: 1 });

        for (let i = 0; i < 6; i++) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(6 - i * 0.5, 0.1, 64, 256), matGold);
            ring.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            astrolabe.add(ring);
            ctx.animatedObjects.push({ obj: ring, type: 'rotate-random', speed: 0.8 });
        }

        const energyCore = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }));
        astrolabe.add(energyCore);
        ctx.scene.add(astrolabe);

        const runeGroup = new THREE.Group();
        for (let i = 0; i < 150; i++) {
            const rune = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.1), new THREE.MeshBasicMaterial({ color: i % 4 === 0 ? 0xffffff : 0xffaa00, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending }));
            runeGroup.add(rune);
        }
        ctx.scene.add(runeGroup);

        ctx.customUpdate = (t) => {
            runeGroup.children.forEach((r, i) => {
                const angle = t * 1.2 + i * 0.4;
                const radius = 8 + Math.sin(i) * 3;
                r.position.set(Math.cos(angle) * radius, (i * 0.1) - 7 + (t * 4) % 14, Math.sin(angle) * radius);
                r.rotation.set(angle, angle, angle);
            });
            energyCore.scale.setScalar(1 + Math.sin(t * 5) * 0.1);
        };

        ctx.addParticles(0xffaa00, 3000, 0.1, 'stars', 0.8);
        const centerLight = new THREE.PointLight(0xffffff, 200, 50); ctx.scene.add(centerLight);
    };

    return (
        <>
            <CinematicCanvas setupScene={setupScene} tintColor={[1.5, 1.1, 0.7]} />
            <div className="hidden">
                <LearningLayout ui={{ title: '', sub: '', cta: '', accent: '' }} />
            </div>
        </>
    );
};