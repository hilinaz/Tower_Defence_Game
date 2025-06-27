import * as THREE from "three";

export const pathPoints = [
    new THREE.Vector3(-15, 0.1, 0),
    new THREE.Vector3(-5, 0.1, 0),
    new THREE.Vector3(-5, 0.1, 10),
    new THREE.Vector3(5, 0.1, 10),
    new THREE.Vector3(5, 0.1, -5),
    new THREE.Vector3(15, 0.1, -5)
];

export function createPath(scene) {
    const pathTexture = new THREE.TextureLoader().load("https://placehold.co/256x256/444444/FFFFFF?text=PathTexture",
        (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(5, 1);
        },
        undefined,
        (error) => console.error('Error loading path texture:', error)
    );
    const pathMaterial = new THREE.MeshPhongMaterial({ map: pathTexture });
    for (let i = 0; i < pathPoints.length - 1; i++) {
        const start = pathPoints[i];
        const end = pathPoints[i + 1];
        const direction = new THREE.Vector3().subVectors(end, start);
        const distance = direction.length();
        direction.normalize();
        const pathGeometry = new THREE.BoxGeometry(2.5, 0.1, distance);
        const pathSegment = new THREE.Mesh(pathGeometry, pathMaterial);
        pathSegment.position.lerpVectors(start, end, 0.5);
        pathSegment.position.y = 0.05;
        const angle = Math.atan2(direction.x, direction.z);
        pathSegment.rotation.y = angle;
        pathSegment.receiveShadow = true;
        scene.add(pathSegment);
    }
} 