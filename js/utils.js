import * as THREE from "three";

export function createParticleSystem(scene, position, color, count = 50, size = 0.1, speed = 0.1, duration = 1000) {
    const particles = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ color: color });
    for (let i = 0; i < count; i++) {
        const geometry = new THREE.SphereGeometry(size * (0.5 + Math.random() * 0.5), 6, 6);
        const particle = new THREE.Mesh(geometry, material);
        particle.position.copy(position);
        particle.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * speed,
            (Math.random() - 0.5) * speed,
            (Math.random() - 0.5) * speed
        );
        particle.userData.life = Math.random() * duration;
        particles.add(particle);
    }
    scene.add(particles);
    const animationId = requestAnimationFrame(function animateParticles() {
        if (!particles.children.length) {
            scene.remove(particles);
            return;
        }
        particles.children.forEach(p => {
            p.position.add(p.userData.velocity);
            p.userData.velocity.multiplyScalar(0.95);
            p.material.opacity -= 0.02;
            p.material.transparent = true;
            if (p.material.opacity <= 0) {
                 p.geometry.dispose();
                 p.material.dispose();
                 particles.remove(p);
            }
        });
        requestAnimationFrame(animateParticles);
    });
    setTimeout(() => {
        scene.remove(particles);
    }, duration);
} 