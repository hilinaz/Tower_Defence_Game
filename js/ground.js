import * as THREE from "three";

export function createGround(scene) {
  // --- Textures ---
  // You'll want to replace these with actual high-quality textures
  // from sources like ambientCG, Poly Haven, or similar.
  const grassColorTexture = new THREE.TextureLoader().load(
    "https://placehold.co/1024x1024/7CFC00/FFFFFF?text=GrassColor",
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10, 10);
    },
    undefined,
    (error) => console.error("Error loading grass color texture:", error)
  );
  const grassNormalTexture = new THREE.TextureLoader().load(
    "https://placehold.co/1024x1024/0000FF/FFFFFF?text=GrassNormal", // Blueish for normal maps
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10, 10);
    },
    undefined,
    (error) => console.error("Error loading grass normal texture:", error)
  );
  const grassRoughnessTexture = new THREE.TextureLoader().load(
    "https://placehold.co/1024x1024/808080/FFFFFF?text=GrassRoughness", // Grayish for roughness
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10, 10);
    },
    undefined,
    (error) => console.error("Error loading grass roughness texture:", error)
  );

  const rockColorTexture = new THREE.TextureLoader().load(
    "https://placehold.co/1024x1024/A9A9A9/FFFFFF?text=RockColor",
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(5, 5);
    }, // Rocks might repeat less often
    undefined,
    (error) => console.error("Error loading rock color texture:", error)
  );
  const rockNormalTexture = new THREE.TextureLoader().load(
    "https://placehold.co/1024x1024/0000FF/FFFFFF?text=RockNormal",
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(5, 5);
    },
    undefined,
    (error) => console.error("Error loading rock normal texture:", error)
  );
  const rockRoughnessTexture = new THREE.TextureLoader().load(
    "https://placehold.co/1024x1024/808080/FFFFFF?text=RockRoughness",
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(5, 5);
    },
    undefined,
    (error) => console.error("Error loading rock roughness texture:", error)
  );

  // --- Ground Material ---
  const groundMaterial = new THREE.ShaderMaterial({
    uniforms: {
        // Using a hardcoded light direction that matches the scene's directional light
        u_light_direction: { value: new THREE.Vector3(20, 30, 20).normalize() },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;

      // Noise functions to generate procedural values
      float random(in vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(in vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vUv = uv;
        vec3 pos = position;
        // Displace the vertex's Y position using noise to create bumps
        float displacement = noise(uv * 15.0) * 0.3;
        pos.y += displacement;
        
        // Recalculate normals for correct lighting on the bumpy surface
        float offset = 0.01;
        vec3 neighbor1 = pos + vec3(offset, noise((uv + vec2(offset, 0.0)) * 15.0) * 0.3 - displacement, 0.0);
        vec3 neighbor2 = pos + vec3(0.0, noise((uv + vec2(0.0, offset)) * 15.0) * 0.3 - displacement, offset);
        vec3 tangent = neighbor1 - pos;
        vec3 bitangent = neighbor2 - pos;
        vNormal = normalize(cross(bitangent, tangent));
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      uniform vec3 u_light_direction;

      // Noise functions (must match vertex shader)
      float random(in vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(in vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        // Generate procedural grass color
        vec2 st = vUv * 50.0; 
        float n = noise(st);
        vec3 grassColorLight = vec3(0.4, 0.7, 0.2);
        vec3 grassColorDark = vec3(0.2, 0.5, 0.1);
        vec3 color = mix(grassColorDark, grassColorLight, n);
        
        // Apply diffuse lighting to show the bumps
        float diffuse = max(0.0, dot(vNormal, u_light_direction));
        vec3 finalColor = color * (0.5 + 0.5 * diffuse);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
  });

  const groundGeometry = new THREE.PlaneGeometry(50, 50, 100, 100);
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.userData.isGround = true;
  scene.add(ground);

  // --- Adding rocks (simplified - for more advanced, use instancing or geometry manipulation) ---
  // This is a simple way to add some rocks. For a truly realistic scene,
  // you'd typically have more sophisticated terrain generation or instancing.

  const rockGeometry = new THREE.SphereGeometry(0.5, 16, 16); // Simple sphere for a rock
  const rockMaterial = new THREE.MeshStandardMaterial({
    map: rockColorTexture,
    normalMap: rockNormalTexture,
    roughnessMap: rockRoughnessTexture,
  });

  for (let i = 0; i < 20; i++) {
    // Add 20 rocks
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.position.x = (Math.random() - 0.5) * 45; // Random position within the ground area
    rock.position.z = (Math.random() - 0.5) * 45;
    rock.position.y = 0.25; // Slightly above the ground
    rock.castShadow = true;
    rock.receiveShadow = true;
    rock.scale.setScalar(0.5 + Math.random() * 1.5); // Vary rock size
    scene.add(rock);
  }
}
