import * as THREE from "three";
import { pathPoints } from "./path.js";
import { increaseScore } from "./gameState.js";

export function createTower(scene, position, towers) {
    const snappedX = Math.round(position.x / 3) * 3;
    const snappedZ = Math.round(position.z / 3) * 3;
    const isOnPath = pathPoints.some((pathPoint, index) => {
        if (index < pathPoints.length - 1) {
            const start = pathPoints[index];
            const end = pathPoints[index + 1];
            const segmentCenter = new THREE.Vector3().lerpVectors(start, end, 0.5);
            const angle = Math.atan2(end.x - start.x, end.z - start.z);
            const localX = (snappedX - segmentCenter.x) * Math.cos(angle) - (snappedZ - segmentCenter.z) * Math.sin(angle);
            const localZ = (snappedX - segmentCenter.x) * Math.sin(angle) + (snappedZ - segmentCenter.z) * Math.cos(angle);
            return Math.abs(localX) < 1.5 && Math.abs(localZ) < start.distanceTo(end) / 2 + 1;
        }
        return false;
    });
    if (isOnPath) return;
    const existingTower = towers.find(t =>
        Math.abs(t.position.x - snappedX) < 0.1 &&
        Math.abs(t.position.z - snappedZ) < 0.1
    );
    if (existingTower) return;
    const tower = new THREE.Group();
    tower.position.set(snappedX, 0, snappedZ);
    tower.userData.isTower = true;
    tower.userData.range = 7;
    tower.userData.fireRate = 1.2;
    tower.userData.lastShotTime = 0;
    tower.castShadow = true;
    const baseGeo = new THREE.BoxGeometry(2, 1.5, 2);
    const baseMat = new THREE.MeshPhongMaterial({ color: 0x6D4C41 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.75;
    base.castShadow = true;
    tower.add(base);
    const bodyGeo = new THREE.CylinderGeometry(0.8, 0.9, 1.5, 16);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0x8D6E63 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.5 + 0.75;
    body.castShadow = true;
    tower.add(body);
    const turretGroup = new THREE.Group();
    turretGroup.position.y = 1.5 + 1.5 + 0.2;
    const turretHeadGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const turretHeadMat = new THREE.MeshPhongMaterial({ color: 0xbb3333 });
    const turretHead = new THREE.Mesh(turretHeadGeo, turretHeadMat);
    turretHead.castShadow = true;
    turretGroup.add(turretHead);
    const barrelGeo = new THREE.CylinderGeometry(0.15, 0.2, 1.5, 8);
    const barrelMat = new THREE.MeshPhongMaterial({ color: 0x555555 });
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    barrel.position.set(0, 0, 0.75);
    barrel.rotation.x = Math.PI / 2;
    barrel.castShadow = true;
    turretGroup.add(barrel);
    tower.add(turretGroup);
    tower.userData.turret = turretGroup;
    scene.add(tower);
    towers.push(tower);
}

export function updateTowers(scene, camera, deltaTime, towers, enemies, createParticleSystem) {
    const livingEnemies = enemies.filter(e => e.visible);
    towers.forEach(tower => {
        const now = performance.now();
        if (now - tower.userData.lastShotTime > (1000 / tower.userData.fireRate)) {
            let targetEnemy = null;
            let minDistance = tower.userData.range * tower.userData.range;
            for (const enemy of livingEnemies) {
                const distSq = tower.position.distanceToSquared(enemy.position);
                if (distSq < minDistance) {
                    minDistance = distSq;
                    targetEnemy = enemy;
                }
            }
            if (targetEnemy) {
                tower.userData.turret.lookAt(targetEnemy.position);
                const projectileGeo = new THREE.SphereGeometry(0.1, 8, 8);
                const projectileMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                const projectile = new THREE.Mesh(projectileGeo, projectileMat);
                const barrelWorldPos = new THREE.Vector3();
                tower.userData.turret.children[1].getWorldPosition(barrelWorldPos);
                projectile.position.copy(barrelWorldPos);
                projectile.userData.isProjectile = true;
                projectile.userData.velocity = targetEnemy.position.clone().sub(projectile.position).normalize().multiplyScalar(0.4);
                projectile.userData.target = targetEnemy;
                projectile.userData.damage = 20;
                scene.add(projectile);
                tower.userData.lastShotTime = now;
            }
        }
    });
    const projectilesToRemove = [];
    scene.traverse(object => {
        if (object.userData.isProjectile) {
            object.position.add(object.userData.velocity);
            if (object.userData.target && object.userData.target.visible && object.position.distanceTo(object.userData.target.position) < 0.7) {
                object.userData.target.userData.hits = (object.userData.target.userData.hits || 0) + 1;
                createParticleSystem(scene, object.userData.target.position, 0xFF0000, 20, 0.1);
                if (object.userData.target.userData.hits >= (object.userData.target.userData.maxHits || 3)) {
                    object.userData.target.visible = false;
                    createParticleSystem(scene, object.userData.target.position, 0x00FF00, 50, 0.2);
                    increaseScore(10);
                }
                projectilesToRemove.push(object);
            } else if (object.position.distanceTo(camera.position) > 100) {
                projectilesToRemove.push(object);
            }
        }
    });
    projectilesToRemove.forEach(p => scene.remove(p));
} 