import * as THREE from "three";

export const KENNEY_COLORMAP = "/assets/kenney-3d/Textures/colormap.png";

let sharedColormap: THREE.Texture | null = null;

export function getKenneyColormap(): THREE.Texture {
  if (!sharedColormap) {
    sharedColormap = new THREE.TextureLoader().load(KENNEY_COLORMAP);
    sharedColormap.colorSpace = THREE.SRGBColorSpace;
    sharedColormap.flipY = false;
    sharedColormap.magFilter = THREE.NearestFilter;
    sharedColormap.minFilter = THREE.NearestFilter;
    sharedColormap.generateMipmaps = false;
  }
  return sharedColormap;
}

export function fixKenneyMaterials(object: THREE.Object3D) {
  const fallbackMap = getKenneyColormap();

  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];

    const newMaterials = materials.map((mat) => {
      const map = ("map" in mat && mat.map) || fallbackMap;

      if (map) {
        map.colorSpace = THREE.SRGBColorSpace;
        map.flipY = false;
        map.needsUpdate = true;
      }

      return new THREE.MeshBasicMaterial({
        map,
        color: 0xffffff,
        toneMapped: false,
      });
    });

    child.material =
      newMaterials.length === 1 ? newMaterials[0] : newMaterials;
  });
}

export function cloneKenneyScene(scene: THREE.Object3D) {
  const clone = scene.clone(true);
  fixKenneyMaterials(clone);
  return clone;
}
