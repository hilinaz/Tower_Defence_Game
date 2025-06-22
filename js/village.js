import * as THREE from "three";
import { pathPoints } from "./path.js";

function _createHouseType1() {
    const house = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(2.5, 1.8, 2.8);
    const baseMat = new THREE.MeshPhongMaterial({ color: 0xffe082 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.9;
    base.castShadow = true;
    house.add(base);
    const roofGeo = new THREE.ConeGeometry(1.8, 1.5, 4);
    const roofMat = new THREE.MeshPhongMaterial({ color: 0x8d6e63 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 1.8 + 0.75;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    house.add(roof);
    const doorGeo = new THREE.BoxGeometry(0.5, 1, 0.1);
    const doorMat = new THREE.MeshPhongMaterial({ color: 0x4E342E });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 0.5, 1.4);
    house.add(door);
    return house;
}

function _createHouseType2() {
    const house = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(3, 2, 2.5);
    const baseMat = new THREE.MeshPhongMaterial({ color: 0xc2a884 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 1;
    base.castShadow = true;
    house.add(base);
    const roofShape = new THREE.Shape();
    roofShape.moveTo(0, 1);
    roofShape.lineTo(1.8, 0);
    roofShape.lineTo(-1.8, 0);
    roofShape.lineTo(0, 1);
    const extrudeSettings = {
        steps: 1,
        depth: 2.7,
        bevelEnabled: false,
    };
    const roofGeo = new THREE.ExtrudeGeometry(roofShape, extrudeSettings);
    const roofMat = new THREE.MeshPhongMaterial({ color: 0x6d4c41 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 2, -1.35);
    roof.rotation.x = -Math.PI / 2;
    roof.castShadow = true;
    house.add(roof);
    const windowGeo = new THREE.PlaneGeometry(0.8, 0.8);
    const windowMat = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.DoubleSide });
    const window1 = new THREE.Mesh(windowGeo, windowMat);
    window1.position.set(0.8, 1.2, 1.26);
    house.add(window1);
    const window2 = new THREE.Mesh(windowGeo, windowMat);
    window2.position.set(-0.8, 1.2, 1.26);
    house.add(window2);
    return house;
}

function _createHouseType3() {
    const house = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(2, 2.5, 2);
    const baseMat = new THREE.MeshPhongMaterial({ color: 0x9e9e9e });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 1.25;
    base.castShadow = true;
    house.add(base);
    const roofGeo = new THREE.BoxGeometry(2.2, 0.4, 2.2);
    const roofMat = new THREE.MeshPhongMaterial({ color: 0x424242 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 2.7;
    roof.castShadow = true;
    house.add(roof);
    return house;
}

function _createTreeType1() {
    const tree = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.2, 8);
    const trunkMat = new THREE.MeshPhongMaterial({ color: 0x8d6e63 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 0.6;
    trunk.castShadow = true;
    tree.add(trunk);
    const foliageGeo = new THREE.SphereGeometry(0.8 + Math.random() * 0.3, 12, 12);
    const foliageMat = new THREE.MeshPhongMaterial({ color: 0x388e3c });
    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.y = 1.5;
    foliage.castShadow = true;
    tree.add(foliage);
    return tree;
}

function _createTreeType2() {
    const tree = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.15, 0.25, 1.5, 6);
    const trunkMat = new THREE.MeshPhongMaterial({ color: 0x795548 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 0.75;
    trunk.castShadow = true;
    tree.add(trunk);
    const foliageGeo = new THREE.ConeGeometry(1, 2, 10);
    const foliageMat = new THREE.MeshPhongMaterial({ color: 0x2e7d32 });
    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.y = 2.2;
    foliage.castShadow = true;
    tree.add(foliage);
    return tree;
}

function _createBigTree() {
    const tree = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.5, 0.7, 4, 12);
    const trunkMat = new THREE.MeshPhongMaterial({ color: 0x5D4037 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 2;
    trunk.castShadow = true;
    tree.add(trunk);
    const foliageGeo = new THREE.SphereGeometry(2.5 + Math.random() * 0.5, 16, 16);
    const foliageMat = new THREE.MeshPhongMaterial({ color: 0x1B5E20 });
    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.y = 5;
    foliage.castShadow = true;
    tree.add(foliage);
    return tree;
}

function _createFountain() {
    const fountain = new THREE.Group();
    const basinGeo = new THREE.CylinderGeometry(3, 3.5, 0.8, 32);
    const basinMat = new THREE.MeshPhongMaterial({ color: 0x81d4fa, shininess: 80 });
    const basin = new THREE.Mesh(basinGeo, basinMat);
    basin.position.y = 0.4;
    basin.castShadow = true;
    fountain.add(basin);
    const midTierGeo = new THREE.CylinderGeometry(1.5, 1.8, 0.6, 24);
    const midTierMat = new THREE.MeshPhongMaterial({ color: 0x81d4fa, shininess: 80 });
    const midTier = new THREE.Mesh(midTierGeo, midTierMat);
    midTier.position.y = 0.8 + 0.3;
    midTier.castShadow = true;
    fountain.add(midTier);
    const topTierGeo = new THREE.CylinderGeometry(0.8, 1, 0.4, 16);
    const topTierMat = new THREE.MeshPhongMaterial({ color: 0x81d4fa, shininess: 80 });
    const topTier = new THREE.Mesh(topTierGeo, topTierMat);
    topTier.position.y = 0.8 + 0.6 + 0.2;
    topTier.castShadow = true;
    fountain.add(topTier);
    const waterJetGeo = new THREE.CylinderGeometry(0.15, 0.05, 1.5, 8);
    const waterJetMat = new THREE.MeshBasicMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.7 });
    const waterJet = new THREE.Mesh(waterJetGeo, waterJetMat);
    waterJet.position.y = 0.8 + 0.6 + 0.4 + 0.75;
    waterJet.userData.isWaterJet = true;
    fountain.add(waterJet);
    for (let i = 0; i < 8; i++) {
        const splashGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const splashMat = new THREE.MeshBasicMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.8 });
        const splash = new THREE.Mesh(splashGeo, splashMat);
        splash.position.set(
            (Math.random() - 0.5) * 0.5,
            waterJet.position.y - 0.5 + Math.random() * 0.5,
            (Math.random() - 0.5) * 0.5
        );
        fountain.add(splash);
    }
    return fountain;
}

function _createBench() {
    const bench = new THREE.Group();
    const seatGeo = new THREE.BoxGeometry(1.5, 0.1, 0.5);
    const seatMat = new THREE.MeshPhongMaterial({ color: 0x8d6e63 });
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.y = 0.3;
    seat.castShadow = true;
    bench.add(seat);
    const legGeo = new THREE.BoxGeometry(0.1, 0.3, 0.1);
    const legMat = new THREE.MeshPhongMaterial({ color: 0x6d4c41 });
    const leg1 = new THREE.Mesh(legGeo, legMat);
    leg1.position.set(0.6, 0.15, 0.2);
    leg1.castShadow = true;
    bench.add(leg1);
    const leg2 = new THREE.Mesh(legGeo, legMat);
    leg2.position.set(-0.6, 0.15, 0.2);
    leg2.castShadow = true;
    bench.add(leg2);
    const leg3 = new THREE.Mesh(legGeo, legMat);
    leg3.position.set(0.6, 0.15, -0.2);
    leg3.castShadow = true;
    bench.add(leg3);
    const leg4 = new THREE.Mesh(legGeo, legMat);
    leg4.position.set(-0.6, 0.15, -0.2);
    leg4.castShadow = true;
    bench.add(leg4);
    return bench;
}

function _createLamppost() {
    const lamppost = new THREE.Group();
    const poleGeo = new THREE.CylinderGeometry(0.05, 0.08, 3, 8);
    const poleMat = new THREE.MeshPhongMaterial({ color: 0x424242 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 1.5;
    pole.castShadow = true;
    lamppost.add(pole);
    const lightFixtureGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const lightFixtureMat = new THREE.MeshBasicMaterial({ color: 0xffffaa, emissive: 0xffffaa, emissiveIntensity: 0.8 });
    const lightFixture = new THREE.Mesh(lightFixtureGeo, lightFixtureMat);
    lightFixture.position.set(0, 3.2, 0);
    lamppost.add(lightFixture);
    const pointLight = new THREE.PointLight(0xffffbb, 1.5, 10);
    pointLight.position.set(0, 3.5, 0);
    pointLight.castShadow = true;
    lamppost.add(pointLight);
    return lamppost;
}

function _createWallSegment() {
    const wall = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(3, 2.5, 1);
    const baseMat = new THREE.MeshPhongMaterial({ color: 0x757575 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 1.25;
    base.castShadow = true;
    wall.add(base);
    const toothGeo = new THREE.BoxGeometry(0.5, 0.5, 1.2);
    const toothMat = new THREE.MeshPhongMaterial({ color: 0x616161 });
    const tooth1 = new THREE.Mesh(toothGeo, toothMat);
    tooth1.position.set(-1, 2.75, 0);
    tooth1.castShadow = true;
    wall.add(tooth1);
    const tooth2 = new THREE.Mesh(toothGeo, toothMat);
    tooth2.position.set(1, 2.75, 0);
    tooth2.castShadow = true;
    wall.add(tooth2);
    return wall;
}

// Mark all obstacles with userData.isObstacle = true
function markAsObstacle(obj) {
    obj.userData.isObstacle = true;
    return obj;
}

// Wrapper functions
function createHouseType1() { return markAsObstacle(_createHouseType1()); }
function createHouseType2() { return markAsObstacle(_createHouseType2()); }
function createHouseType3() { return markAsObstacle(_createHouseType3()); }
function createTreeType1() { return markAsObstacle(_createTreeType1()); }
function createTreeType2() { return markAsObstacle(_createTreeType2()); }
function createBigTree() { return markAsObstacle(_createBigTree()); }
function createFountain() { return markAsObstacle(_createFountain()); }
function createBench() { return markAsObstacle(_createBench()); }
function createLamppost() { return markAsObstacle(_createLamppost()); }
function createWallSegment() { return markAsObstacle(_createWallSegment()); }

export function createVillage(scene) {
    const houseTypes = [createHouseType1, createHouseType2, createHouseType3];
    const treeTypes = [createTreeType1, createTreeType2];
    for (let i = 0; i < 10; i++) {
        const houseCreator = houseTypes[Math.floor(Math.random() * houseTypes.length)];
        const house = houseCreator();
        let angle, radius, x, z;
        let attempts = 0;
        do {
            angle = Math.random() * Math.PI * 2;
            radius = 15 + Math.random() * 12;
            x = Math.cos(angle) * radius;
            z = Math.sin(angle) * radius;
            attempts++;
            if (attempts > 50) {
                break;
            }
        } while (new THREE.Vector2(x, z).distanceTo(new THREE.Vector2(0, 0)) < 8 ||
                 pathPoints.some((pathPoint, idx) => {
                    if (idx < pathPoints.length - 1) {
                        const start = pathPoints[idx];
                        const end = pathPoints[idx + 1];
                        const segmentCenter = new THREE.Vector3().lerpVectors(start, end, 0.5);
                        const currentPos = new THREE.Vector3(x, 0, z);
                        const distToSegment = currentPos.distanceTo(segmentCenter);
                        return distToSegment < 7;
                    }
                    return false;
                 })
                );
        if (attempts <= 50) {
            house.position.set(x, 0, z);
            house.rotation.y = Math.random() * Math.PI * 2;
            scene.add(house);
        }
    }
    for (let i = 0; i < 25; i++) {
        const treeCreator = treeTypes[Math.floor(Math.random() * treeTypes.length)];
        const tree = treeCreator();
        let angle, radius, x, z;
        let attempts = 0;
        do {
            angle = Math.random() * Math.PI * 2;
            radius = 8 + Math.random() * 20;
            x = Math.cos(angle) * radius;
            z = Math.sin(angle) * radius;
            attempts++;
            if (attempts > 50) {
                break;
            }
        } while (new THREE.Vector2(x, z).distanceTo(new THREE.Vector2(0, 0)) < 6 ||
                 pathPoints.some((pathPoint, idx) => {
                    if (idx < pathPoints.length - 1) {
                        const start = pathPoints[idx];
                        const end = pathPoints[idx + 1];
                        const segmentCenter = new THREE.Vector3().lerpVectors(start, end, 0.5);
                        const currentPos = new THREE.Vector3(x, 0, z);
                        const distToSegment = currentPos.distanceTo(segmentCenter);
                        return distToSegment < 4;
                    }
                    return false;
                 })
                );
        if (attempts <= 50) {
            tree.position.set(x, 0, z);
            scene.add(tree);
        }
    }
    for (let i = 0; i < 8; i++) {
        const tree = createBigTree();
        let x, z;
        let attempts = 0;
        do {
            const edge = Math.floor(Math.random() * 4);
            const positionOnEdge = (Math.random() * 40) - 20;

            switch(edge) {
                case 0: // Top
                    x = positionOnEdge;
                    z = 22 + (Math.random() - 0.5) * 4;
                    break;
                case 1: // Bottom
                    x = positionOnEdge;
                    z = -22 + (Math.random() - 0.5) * 4;
                    break;
                case 2: // Right
                    x = 22 + (Math.random() - 0.5) * 4;
                    z = positionOnEdge;
                    break;
                case 3: // Left
                    x = -22 + (Math.random() - 0.5) * 4;
                    z = positionOnEdge;
                    break;
            }
            
            attempts++;
            if (attempts > 50) {
                break;
            }
        } while (pathPoints.some((pathPoint, idx) => {
                    if (idx < pathPoints.length - 1) {
                        const start = pathPoints[idx];
                        const end = pathPoints[idx + 1];
                        const segmentCenter = new THREE.Vector3().lerpVectors(start, end, 0.5);
                        const currentPos = new THREE.Vector3(x, 0, z);
                        const distToSegment = currentPos.distanceTo(segmentCenter);
                        return distToSegment < 6;
                    }
                    return false;
                 })
                );
        if (attempts <= 50) {
            tree.position.set(x, 0, z);
            scene.add(tree);
        }
    }
    const fountain = createFountain();
    fountain.position.set(0, 0, 0);
    scene.add(fountain);
    for (let i = 0; i < 4; i++) {
        const bench = createBench();
        const angle = Math.PI * 2 * (i / 4) + Math.PI / 4;
        const radius = 6;
        bench.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        bench.rotation.y = angle + Math.PI / 2;
        scene.add(bench);
    }
    for (let i = 0; i < 6; i++) {
        const lamppost = createLamppost();
        const angle = Math.PI * 2 * (i / 6);
        const radius = 10;
        lamppost.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        scene.add(lamppost);
    }
    const wallPositions = [
        new THREE.Vector3(-12, 0, -12),
        new THREE.Vector3(-9, 0, -12),
        new THREE.Vector3(-6, 0, -12),
        new THREE.Vector3(12, 0, 12),
        new THREE.Vector3(9, 0, 12),
        new THREE.Vector3(6, 0, 12),
    ];
    wallPositions.forEach(pos => {
        const wall = createWallSegment();
        wall.position.copy(pos);
        scene.add(wall);
    });
}

export function getObstacles(scene) {
    // Return all objects in the scene with userData.isObstacle
    const obstacles = [];
    scene.traverse(obj => {
        if (obj.userData && obj.userData.isObstacle) {
            obstacles.push(obj);
        }
    });
    return obstacles;
} 