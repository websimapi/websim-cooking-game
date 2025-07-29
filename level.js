import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
const loadedTextures = new Map();

function getTexture(url) {
    if (!loadedTextures.has(url)) {
        const texture = textureLoader.load(url);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        loadedTextures.set(url, texture);
    }
    return loadedTextures.get(url);
}

export async function loadLevel(scene, levelUrl) {
    try {
        const response = await fetch(levelUrl);
        const levelData = await response.json();

        levelData.blocks.forEach(blockData => {
            const geometry = new THREE.BoxGeometry(1, 0.5, 1);
            
            // For now, we use the first material for all faces.
            const materialInfo = blockData.materials[0];
            const color = new THREE.Color(`#${materialInfo.color}`);
            const texture = getTexture(materialInfo.textureUrl);

            const material = new THREE.MeshStandardMaterial({
                color: color,
                map: texture,
            });

            const block = new THREE.Mesh(geometry, material);
            // Adjust y position for half-slab height
            block.position.set(blockData.x, blockData.y + 0.25, blockData.z);
            block.castShadow = true;
            block.receiveShadow = true;
            
            scene.add(block);
        });
        
    } catch (error) {
        console.error('Error loading level:', error);
    }
}

