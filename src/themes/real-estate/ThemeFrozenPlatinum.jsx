import React from 'react';
import * as THREE from 'three';
import { CinematicCanvas, RealEstateLayout } from '../SharedEngine';

export const ThemeFrozenPlatinum = () => {
    const setupScene = (ctx) => {
        ctx.scene.background = new THREE.Color('#000000');
        const platMat = new THREE.MeshPhysicalMaterial({ color: 0xaaccff, transmission: 1, opacity: 1, ior: 2.4, metalness: 0.6, roughness: 0.0, clearcoat: 1 });
        const core = new THREE.Mesh(new THREE.IcosahedronGeometry(5, 1), platMat);
        ctx.scene.add(core);
        ctx.animatedObjects.push({ obj: core, type: 'float-spin-slow' });

        const shardGroup = new THREE.Group();
        const geo = new THREE.TetrahedronGeometry(0.8, 1);
        for (let i = 0; i < 80; i++) {
            const shard = new THREE.Mesh(geo, platMat);
            shard.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30);
            shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            shardGroup.add(shard);
            ctx.animatedObjects.push({ obj: shard, type: 'float-spin', speed: Math.random() + 0.5 });
        }
        ctx.scene.add(shardGroup);
        ctx.animatedObjects.push({ obj: shardGroup, type: 'rotate-slow-y', speed: 0.05 });

        const light1 = new THREE.PointLight(0x00ffff, 300, 50); light1.position.set(10, 10, 5);
        const light2 = new THREE.PointLight(0xffffff, 200, 50); light2.position.set(-10, -10, 5);
        ctx.scene.add(light1, light2);
        ctx.addParticles(0xffffff, 4000, 0.05, 'snow', 0.9);
    };

    return (
        <>
            <CinematicCanvas setupScene={setupScene} tintColor={[0.7, 1.2, 1.7]} />
            <div className="hidden">
                <RealEstateLayout ui={{ title: '', sub: '', cta: '', accent: '' }} />
            </div>
        </>
    );
};