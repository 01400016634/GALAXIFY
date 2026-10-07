import React from 'react';
import * as THREE from 'three';
import { CinematicCanvas, GadgetLayout } from '../SharedEngine';

export const ThemeCyberLab = () => {
    const setupScene = (ctx) => {
        ctx.scene.background = new THREE.Color('#000000');
        const coreGroup = new THREE.Group();
        const l1 = new THREE.Mesh(new THREE.IcosahedronGeometry(2, 2), new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }));
        const l2 = new THREE.Mesh(new THREE.IcosahedronGeometry(2.5, 1), new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 1, roughness: 0.1, transmission: 0.9, ior: 1.5 }));
        const l3 = new THREE.Mesh(new THREE.IcosahedronGeometry(3.2, 3), new THREE.MeshBasicMaterial({ color: 0x0088ff, wireframe: true, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending }));
        coreGroup.add(l1, l2, l3);
        ctx.scene.add(coreGroup);

        ctx.animatedObjects.push({ obj: l1, type: 'rotate-complex-slow', speed: 2 });
        ctx.animatedObjects.push({ obj: l2, type: 'rotate-complex-slow', speed: -1 });
        ctx.animatedObjects.push({ obj: l3, type: 'rotate-complex-slow', speed: 0.5 });

        for (let i = 0; i < 6; i++) {
            const scan = new THREE.Mesh(new THREE.TorusGeometry(4 + i * 0.8, 0.05, 16, 200), new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending }));
            scan.rotation.x = Math.PI / 2;
            ctx.scene.add(scan);
            ctx.animatedObjects.push({ obj: scan, type: 'scan-y-large', offset: i });
        }

        const light = new THREE.PointLight(0x00ffff, 150, 50); ctx.scene.add(light);
        ctx.addParticles(0x00ffff, 2000, 0.05, 'dust', 0.8);
    };

    return (
        <>
            <CinematicCanvas setupScene={setupScene} tintColor={[0.5, 1.5, 1.5]} />
            <div className="hidden">
                <GadgetLayout ui={{ title: '', sub: '', cta: '', accent: '' }} />
            </div>
        </>
    );
};