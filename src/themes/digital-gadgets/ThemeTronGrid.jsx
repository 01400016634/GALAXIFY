import React from 'react';
import * as THREE from 'three';
import { CinematicCanvas, GadgetLayout } from '../SharedEngine';

export const ThemeTronGrid = () => {
    const setupScene = (ctx) => {
        ctx.scene.background = new THREE.Color('#000000');

        // Massive Tron neon landscape grid
        const gridGroup = new THREE.Group();
        const gridHelper = new THREE.GridHelper(80, 40, 0x00ffff, 0x002233);
        gridHelper.position.y = -4;
        gridGroup.add(gridHelper);
        ctx.scene.add(gridGroup);

        // Add horizontal scanning Tron walls
        const wallGeo = new THREE.PlaneGeometry(80, 20);
        const wallMat = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            wireframe: true,
            transparent: true,
            opacity: 0.05,
            side: THREE.DoubleSide
        });
        const leftWall = new THREE.Mesh(wallGeo, wallMat);
        leftWall.position.set(-25, 6, 0);
        leftWall.rotation.y = Math.PI / 2;

        const rightWall = leftWall.clone();
        rightWall.position.x = 25;
        ctx.scene.add(leftWall, rightWall);

        // Floating central cryptographic neon matrix cube
        const cubeGroup = new THREE.Group();
        for (let i = 0; i < 3; i++) {
            const s = 2 + i * 1.2;
            const cube = new THREE.Mesh(
                new THREE.BoxGeometry(s, s, s),
                new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00ffff : 0xff00ff, wireframe: true, transparent: true, opacity: 0.4 })
            );
            cubeGroup.add(cube);
            ctx.animatedObjects.push({ obj: cube, type: 'rotate-complex-slow', speed: 0.5 * (i + 1) });
        }
        ctx.scene.add(cubeGroup);
        ctx.animatedObjects.push({ obj: cubeGroup, type: 'float-spin-slow' });

        // Neon glowing core lights
        const light = new THREE.PointLight(0x00ffff, 200, 50);
        light.position.set(0, 2, 0);
        ctx.scene.add(light);

        ctx.addParticles(0x00ffff, 1800, 0.04, 'dust', 0.7);
    };

    return (
        <>
            <CinematicCanvas setupScene={setupScene} tintColor={[0.6, 1.4, 1.4]} />
            <div className="hidden">
                <GadgetLayout ui={{ title: '', sub: '', cta: '', accent: '' }} />
            </div>
        </>
    );
};