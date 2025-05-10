import * as THREE from "three";
import { LabEquipment } from "../stores/useLabStore";

export const initialEquipment: LabEquipment[] = [
  // Beakers
  {
    id: "beaker1",
    name: "Small Beaker",
    type: "beaker",
    position: new THREE.Vector3(-2, 1, -3),
    rotation: new THREE.Euler(0, 0, 0),
    description: "A 100ml beaker for holding and mixing chemicals",
    available: true,
    interactive: true,
    contents: [],
    temperature: 22,
    color: "#a0c8ff"
  },
  {
    id: "beaker2",
    name: "Large Beaker",
    type: "beaker",
    position: new THREE.Vector3(-1.5, 1, -3),
    rotation: new THREE.Euler(0, 0, 0),
    description: "A 250ml beaker for larger volume reactions",
    available: true,
    interactive: true,
    contents: ["Water"],
    temperature: 22,
    color: "#a0c8ff"
  },
  
  // Test Tubes
  {
    id: "test_tube1",
    name: "Test Tube A",
    type: "test_tube",
    position: new THREE.Vector3(-0.8, 1, -3),
    rotation: new THREE.Euler(0, 0, 0),
    description: "Glass test tube for small-scale experiments",
    available: true,
    interactive: true,
    contents: [],
    temperature: 22,
    color: "transparent"
  },
  {
    id: "test_tube2",
    name: "Test Tube B",
    type: "test_tube",
    position: new THREE.Vector3(-0.5, 1, -3),
    rotation: new THREE.Euler(0, 0, 0),
    description: "Glass test tube with a rounded bottom",
    available: true,
    interactive: true,
    contents: [],
    temperature: 22,
    color: "transparent"
  },
  
  // Bunsen Burner
  {
    id: "bunsen_burner",
    name: "Bunsen Burner",
    type: "bunsen_burner",
    position: new THREE.Vector3(2, 0.9, -3),
    rotation: new THREE.Euler(0, 0, 0),
    description: "A gas burner for heating substances",
    available: true,
    interactive: true,
    temperature: 30
  },
  
  // Microscope
  {
    id: "microscope",
    name: "Compound Microscope",
    type: "microscope",
    position: new THREE.Vector3(0, 1, -4),
    rotation: new THREE.Euler(0, 0, 0),
    description: "Used for viewing small samples at high magnification",
    available: true,
    interactive: true
  },
  
  // Scale
  {
    id: "scale",
    name: "Digital Scale",
    type: "scale",
    position: new THREE.Vector3(3, 1, -3),
    rotation: new THREE.Euler(0, 0, 0),
    description: "Precision scale for measuring mass",
    available: true,
    interactive: true
  },
  
  // Chemicals
  {
    id: "chemical1",
    name: "Hydrochloric Acid (HCl)",
    type: "chemical",
    position: new THREE.Vector3(-3, 1.2, -2.5),
    rotation: new THREE.Euler(0, 0, 0),
    description: "Dilute hydrochloric acid solution (0.1M)",
    available: true,
    interactive: true,
    contents: ["Acid"],
    color: "#f0f8ff"
  },
  {
    id: "chemical2",
    name: "Sodium Hydroxide (NaOH)",
    type: "chemical",
    position: new THREE.Vector3(-2.5, 1.2, -2.5),
    rotation: new THREE.Euler(0, 0, 0),
    description: "Sodium hydroxide solution (0.1M)",
    available: true,
    interactive: true,
    contents: ["Base", "Sodium Hydroxide"],
    color: "#f0f8ff"
  },
  {
    id: "chemical3",
    name: "Copper Sulfate (CuSO4)",
    type: "chemical",
    position: new THREE.Vector3(-2, 1.2, -2.5),
    rotation: new THREE.Euler(0, 0, 0),
    description: "Copper sulfate solution",
    available: true,
    interactive: true,
    contents: ["Copper Sulfate"],
    color: "#0984e3"
  },
  {
    id: "chemical4",
    name: "Phenolphthalein",
    type: "chemical",
    position: new THREE.Vector3(-1.5, 1.2, -2.5),
    rotation: new THREE.Euler(0, 0, 0),
    description: "pH indicator that turns pink in basic solutions",
    available: true,
    interactive: true,
    contents: ["Phenolphthalein"],
    color: "#ffffff"
  }
];
