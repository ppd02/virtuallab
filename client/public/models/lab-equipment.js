// This file provides 3D model metadata for the lab equipment
// These are references to geometries that will be created programmatically
// using Three.js primitives in the actual components

export const labEquipmentModels = {
  beaker: {
    type: "cylinder",
    radiusTop: 0.15,
    radiusBottom: 0.13,
    height: 0.25,
    material: "glass",
    interactive: true
  },
  
  test_tube: {
    type: "cylinder",
    radiusTop: 0.05,
    radiusBottom: 0.05,
    height: 0.3,
    material: "glass",
    interactive: true
  },
  
  bunsen_burner: {
    type: "group",
    children: [
      {
        type: "cylinder",
        radiusTop: 0.15,
        radiusBottom: 0.2,
        height: 0.1,
        material: "metal",
      },
      {
        type: "cylinder",
        radiusTop: 0.03,
        radiusBottom: 0.03,
        height: 0.3,
        position: [0, 0.2, 0],
        material: "metal",
      }
    ],
    interactive: true
  },
  
  microscope: {
    type: "group",
    children: [
      {
        type: "box",
        width: 0.25,
        height: 0.05,
        depth: 0.3,
        material: "metal_dark",
      },
      {
        type: "cylinder",
        radius: 0.02,
        height: 0.3,
        position: [0, 0.15, -0.05],
        material: "metal",
      },
      {
        type: "cylinder",
        radius: 0.03,
        height: 0.15,
        position: [0, 0.3, 0],
        rotation: [30, 0, 0],
        material: "metal_dark",
      }
    ],
    interactive: true
  },
  
  scale: {
    type: "group",
    children: [
      {
        type: "box",
        width: 0.25,
        height: 0.05,
        depth: 0.2,
        material: "metal",
      },
      {
        type: "box",
        width: 0.15,
        height: 0.01,
        depth: 0.15,
        position: [0, 0.03, 0],
        material: "metal_light",
      }
    ],
    interactive: true
  },
  
  chemical_bottle: {
    type: "group",
    children: [
      {
        type: "cylinder",
        radiusTop: 0.05,
        radiusBottom: 0.05,
        height: 0.2,
        material: "glass_dark",
      },
      {
        type: "cylinder",
        radiusTop: 0.03,
        radiusBottom: 0.03,
        height: 0.04,
        position: [0, 0.12, 0],
        material: "plastic",
      }
    ],
    interactive: true
  }
};
