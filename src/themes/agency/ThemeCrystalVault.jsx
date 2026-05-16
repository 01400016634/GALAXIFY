import React from 'react';
import * as THREE from 'three';
import { CinematicCanvas, AgencyLayout } from '../SharedEngine';

export const ThemeCrystalVault = () => {
    const setupScene = (ctx) => {
        ctx.scene.background = new THREE.Color('#000000');
        const diamondMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, ior: 2.4, roughness: 0, metalness: 0.1, clearcoat: 1 });
        const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(4, 0), diamondMat);
        ctx.scene.add(diamond);
        ctx.animatedObjects.push({ obj: diamond, type: 'float-spin-slow' });

        const vaultGroup = new THREE.Group();
        const pillarMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });
        for (let i = 0; i < 8; i++) {
            const pillar = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 50, 64), pillarMat);
            const angle = (i / 8) * Math.PI * 2;
            pillar.position.set(Math.cos(angle) * 12, 0, Math.sin(angle) * 12);
            vaultGroup.add(pillar);
        }
        ctx.scene.add(vaultGroup);
        ctx.animatedObjects.push({ obj: vaultGroup, type: 'rotate-slow-y', speed: 0.02 });

        const spot1 = new THREE.SpotLight(0xffaa00, 300); spot1.position.set(15, 25, 15); spot1.lookAt(diamond.position);
        const spot2 = new THREE.SpotLight(0xffffff, 200); spot2.position.set(-15, -25, -15); spot2.lookAt(diamond.position);
        ctx.scene.add(spot1, spot2);
        ctx.addParticles(0xffaa00, 3000, 0.1, 'snow', 0.9);
    };

    return (
        <>
            <CinematicCanvas setupScene={setupScene} tintColor={[1.4, 1.2, 0.9]} />
            <div className="hidden">
                <AgencyLayout ui={{ title: '', sub: '', cta: '', accent: '' }} />
            </div>
        </>
    );
};