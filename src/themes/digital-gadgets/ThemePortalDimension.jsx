import React from 'react';
import * as THREE from 'three';
import { CinematicCanvas, GadgetLayout } from '../SharedEngine';

export const ThemePortalDimension = () => {
    const setupScene = (ctx) => {
        ctx.scene.background = new THREE.Color('#000000');

        // Portal Frame
        const portalGroup = new THREE.Group();
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x330066, metalness: 0.9, roughness: 0.2 });
        const frame = new THREE.Mesh(new THREE.TorusGeometry(5, 0.4, 16, 100), frameMat);
        portalGroup.add(frame);

        // Dynamic Swirl Core
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            wireframe: true,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });
        const core = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 4.8, 0.2, 64), coreMat);
        core.rotation.x = Math.PI / 2;
        portalGroup.add(core);
        ctx.scene.add(portalGroup);

        ctx.animatedObjects.push({ obj: portalGroup, type: 'rotate-z-fast', speed: 0.5 });
        ctx.animatedObjects.push({ obj: core, type: 'rotate-z-fast', speed: -1.5 });

        // Floating debris being sucked in
        const floatingGroup = new THREE.Group();
        const boxGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const boxMat = new THREE.MeshBasicMaterial({ color: 0xaa00ff, wireframe: true });
        for (let i = 0; i < 40; i++) {
            const item = new THREE.Mesh(boxGeo, boxMat);
            item.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, Math.random() * 20);
            floatingGroup.add(item);
            ctx.animatedObjects.push({ obj: item, type: 'suck-into-portal', speed: 0.1 + Math.random() * 0.1 });
        }
        ctx.scene.add(floatingGroup);

        const light = new THREE.PointLight(0x00ffff, 250, 50);
        light.position.set(0, 0, 5);
        ctx.scene.add(light);

        ctx.addParticles(0xaa00ff, 2500, 0.06, 'dust', 0.8);
    };

    return (
        <>
            <CinematicCanvas setupScene={setupScene} tintColor={[1.3, 0.7, 1.8]} />
            <div className="hidden">
                <GadgetLayout ui={{ title: '', sub: '', cta: '', accent: '' }} />
            </div>
        </>
    );
};