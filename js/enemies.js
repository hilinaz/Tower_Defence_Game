import * as THREE from "three";
import { pathPoints } from "./path.js";
import { decreaseHealth, increaseScore } from "./gameState.js";

const DEFAULT_MAX_HITS = 3;

export function createEnemies(scene, count, speed, spawnPos, endPos, enemies, currentWave) {
    for (let i = 0; i < count; i++) {
        const enemy = new THREE.Group();
        enemy.userData.isEnemy = true;
        enemy.userData.speed = speed;
        enemy.userData.health = 100 + currentWave * 10;
        enemy.userData.hits = 0;
        enemy.userData.maxHits = DEFAULT_MAX_HITS;
        enemy.castShadow = true;
        const bodyGeo = new THREE.BoxGeometry(0.8, 1.2, 0.6);
        const bodyMat = new THREE.MeshPhongMaterial({ color: 0x008000 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.6;
        body.castShadow = true;
        enemy.add(body);
        const headGeo = new THREE.SphereGeometry(0.4, 8, 8);
        const headMat = new THREE.MeshPhongMaterial({ color: 0x8B0000 });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.2 + 0.4;
        head.castShadow = true;
        enemy.add(head);
        const armGeo = new THREE.BoxGeometry(0.2, 0.8, 0.2);
        const armMat = new THREE.MeshPhongMaterial({ color: 0x006400 });
        const armLeft = new THREE.Mesh(armGeo, armMat);
        armLeft.position.set(-0.5, 0.6, 0);
        armLeft.castShadow = true;
        enemy.add(armLeft);
        const armRight = new THREE.Mesh(armGeo, armMat);
        armRight.position.set(0.5, 0.6, 0);
        armRight.castShadow = true;
        enemy.add(armRight);
        // Stagger each enemy's starting progress so they don't overlap
        enemy.userData.pathIndex = 0;
        enemy.userData.pathProgress = i * 0.15; // space out by 0.15 along the first segment
        if (enemy.userData.pathProgress >= 1) {
            // If too many, move to next segment
            enemy.userData.pathIndex = 1;
            enemy.userData.pathProgress = (i * 0.15) - 1;
        }
        const start = pathPoints[enemy.userData.pathIndex];
        const end = pathPoints[enemy.userData.pathIndex + 1];
        enemy.position.copy(new THREE.Vector3().lerpVectors(start, end, enemy.userData.pathProgress));
        enemies.push(enemy);
        scene.add(enemy);
    }
}

export function animateEnemies(scene, deltaTime, enemies, decreaseHealth, nextWave, startWave, playerHealth, gameRunning, currentWave, towers=[], createParticleSystem) {
    const enemiesToRemove = [];
    enemies.forEach(enemy => {
        if (!enemy.visible) {
            enemiesToRemove.push(enemy);
            return;
        }
        let idx = enemy.userData.pathIndex;
        if (idx >= pathPoints.length - 1) {
            decreaseHealth(10);
            enemiesToRemove.push(enemy);
            return;
        }
        const start = pathPoints[idx];
        const end = pathPoints[idx + 1];
        const segmentLength = start.distanceTo(end);
        // Advance progress along the segment
        let progress = enemy.userData.pathProgress;
        const distanceToMove = enemy.userData.speed;
        const deltaProgress = distanceToMove / segmentLength;
        progress += deltaProgress;
        if (progress >= 1) {
            // Move to next segment
            enemy.userData.pathIndex++;
            if (enemy.userData.pathIndex >= pathPoints.length - 1) {
                decreaseHealth(10);
                enemiesToRemove.push(enemy);
                return;
            }
            enemy.userData.pathProgress = 0;
            // Snap to the next segment's start
            enemy.position.copy(pathPoints[enemy.userData.pathIndex]);
        } else {
            // Interpolate position along the segment
            enemy.userData.pathProgress = progress;
            enemy.position.lerpVectors(start, end, progress);
            enemy.lookAt(end);
        }
    });
    enemiesToRemove.forEach(enemy => {
        const index = enemies.indexOf(enemy);
        if (index > -1) {
            enemies.splice(index, 1);
        }
        scene.remove(enemy);
    });
    if (enemies.length === 0 && gameRunning) {
        // if (playerHealth > 0) {
        //     nextWave();
        //     startWave();
        // }
        // Now, new waves only start when the user clicks the button
    }
} 