// This file provides 3D model metadata for the lab environment
// These are references to geometries that will be created programmatically
// using Three.js primitives in the actual components

export const labEnvironmentModels = {
  room: {
    type: "group",
    children: [
      {
        type: "floor",
        width: 20,
        depth: 20,
        material: "lab-floor"
      },
      {
        type: "walls",
        height: 3,
        width: 20,
        depth: 20,
        material: "lab-wall"
      },
      {
        type: "ceiling",
        width: 20,
        depth: 20,
        material: "white"
      }
    ]
  },
  
  furniture: {
    type: "group",
    children: [
      {
        type: "lab_bench",
        width: 8,
        depth: 2,
        height: 1,
        position: [0, 0.5, -3],
        material: "lab-table"
      },
      {
        type: "cabinets",
        width: 2,
        depth: 1,
        height: 1.5,
        position: [-4, 0.75, -8],
        material: "wood"
      },
      {
        type: "sink",
        width: 1,
        depth: 1,
        position: [-3, 1, -3],
        material: "metal"
      }
    ]
  }
};
