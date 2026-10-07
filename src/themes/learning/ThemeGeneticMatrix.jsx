import React from 'react';
import * as THREE from 'three';
import { CinematicCanvas, LearningLayout } from '../SharedEngine';

export const ThemeGeneticMatrix = () => {
    const setupScene = (ctx) => {
        ctx.scene.background = new THREE.Color('#000000');
        const helixGroup = new THREE.Group();
        const particleMat = new THREE.MeshBasicMaterial({ color: 0x00ffaa, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
        const coreMat = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });

        for (let i = 0; i < 80; i++) {
            const t = i * 0.3;
            const x = Math.cos(t) * 3;
            const z = Math.sin(t) * 3;
            const y = (i - 40) * 0.4;

            const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), particleMat);
            p1.position.set(x, y, z);
            const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), coreMat);
            p2.position.set(-x, y, -z);

            if (i % 2 === 0) {
                const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, y, z), new THREE.Vector3(-x, y, -z)]);
                const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x00ffaa, transparent: true, opacity: 0.3 }));
                helixGroup.add(line);
            }
            helixGroup.add(p1, p2);
        }
        ctx.scene.add(helixGroup);
        ctx.animatedObjects.push({ obj: helixGroup, type: 'rotate-slow-y', speed: 0.5 });
        ctx.animatedObjects.push({ obj: helixGroup, type: 'float-spin-slow' });

        ctx.addGlowingRing(6, 0x00ffaa, 0.05).rotation.x = Math.PI / 2;
        ctx.addGlowingRing(8, 0x00aaff, 0.02).rotation.x = Math.PI / 2;

        const light = new THREE.PointLight(0x00ffaa, 200, 50); ctx.scene.add(light);
        ctx.addParticles(0x00ffaa, 2000, 0.05, 'stars', 0.6);
    };

    return (
        <>
            <CinematicCanvas setupScene={setupScene} tintColor={[0.5, 1.5, 1.2]} />
            <div className="hidden">
                <LearningLayout ui={{ title: '', sub: '', cta: '', accent: '' }} />
            </div>
        </>
    );
};