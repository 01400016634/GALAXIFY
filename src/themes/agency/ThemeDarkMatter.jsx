import React from 'react';
import * as THREE from 'three';
import { CinematicCanvas, AgencyLayout } from '../SharedEngine';

export const ThemeDarkMatter = () => {
    const setupScene = (ctx) => {
        ctx.scene.background = new THREE.Color('#000000');
        const coreMat = new THREE.MeshPhysicalMaterial({ color: 0x000000, metalness: 1.0, roughness: 0.0, clearcoat: 1.0 });
        const core = new THREE.Mesh(new THREE.SphereGeometry(3.5, 64, 64), coreMat);
        ctx.scene.add(core);

        const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(4.2, 2), new THREE.MeshBasicMaterial({ color: 0xaa00ff, wireframe: true, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending }));
        ctx.scene.add(shell);
        ctx.animatedObjects.push({ obj: shell, type: 'rotate-complex-slow' });

        const ringGroup = new THREE.Group();
        for (let i = 0; i < 3; i++) {
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(5 + i * 1.2, 0.05 + i * 0.02, 16, 100),
                new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xff00ff : 0x00ffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending })
            );
            ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
            ring.rotation.y = (Math.random() - 0.5) * 0.5;
            ringGroup.add(ring);
            ctx.animatedObjects.push({ obj: ring, type: 'rotate-random', speed: 1.5 + i });
        }
        ctx.scene.add(ringGroup);

        const light1 = new THREE.PointLight(0xff00ff, 400, 50); light1.position.set(10, 10, 10);
        const light2 = new THREE.PointLight(0x00ffff, 400, 50); light2.position.set(-10, -10, -10);
        ctx.scene.add(light1, light2);

        ctx.addParticles(0xaa00ff, 3000, 0.05, 'dust', 0.6);
    };

    return (
        <>
            <CinematicCanvas setupScene={setupScene} tintColor={[1.2, 0.9, 1.5]} />
            <div className="hidden">
                <AgencyLayout ui={{ title: '', sub: '', cta: '', accent: '' }} />
            </div>
        </>
    );
};