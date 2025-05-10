import { Experiment } from "../stores/useLabStore";

export const initialExperiments: Experiment[] = [
  {
    id: "exp_acid_base",
    name: "Acid-Base Neutralization",
    description: "Learn about pH and acid-base reactions by neutralizing an acid with a base",
    difficulty: "beginner",
    subject: "chemistry",
    completed: false,
    active: false,
    steps: [
      {
        id: "step1_acid_base",
        description: "Add 20ml of hydrochloric acid (HCl) to a beaker",
        requiredEquipment: ["chemical1", "beaker1"],
        requiredActions: [
          {
            action: "mix",
            equipmentId: "chemical1",
            targetIds: ["beaker1"]
          }
        ],
        hint: "Click on the HCl bottle, then click on the small beaker to pour it",
        completed: false
      },
      {
        id: "step2_acid_base",
        description: "Add a few drops of phenolphthalein indicator to the beaker",
        requiredEquipment: ["chemical4", "beaker1"],
        requiredActions: [
          {
            action: "mix",
            equipmentId: "chemical4",
            targetIds: ["beaker1"]
          }
        ],
        hint: "Click on the phenolphthalein bottle, then click on the beaker with acid",
        completed: false
      },
      {
        id: "step3_acid_base",
        description: "Slowly add sodium hydroxide (NaOH) until the solution turns pink",
        requiredEquipment: ["chemical2", "beaker1"],
        requiredActions: [
          {
            action: "mix",
            equipmentId: "chemical2",
            targetIds: ["beaker1"]
          }
        ],
        hint: "Click on the NaOH bottle, then click on the beaker with acid and indicator",
        completed: false
      },
      {
        id: "step4_acid_base",
        description: "Observe the color change indicating neutralization",
        requiredEquipment: ["beaker1"],
        requiredActions: [
          {
            action: "observe",
            equipmentId: "beaker1"
          }
        ],
        hint: "Click on the beaker to observe it closely",
        completed: false
      }
    ]
  },
  
  {
    id: "exp_copper_precipitation",
    name: "Copper Precipitation",
    description: "Observe a chemical reaction that creates a precipitate",
    difficulty: "intermediate",
    subject: "chemistry",
    completed: false,
    active: false,
    steps: [
      {
        id: "step1_precipitation",
        description: "Add copper sulfate solution to a test tube",
        requiredEquipment: ["chemical3", "test_tube1"],
        requiredActions: [
          {
            action: "mix",
            equipmentId: "chemical3",
            targetIds: ["test_tube1"]
          }
        ],
        hint: "Click on the copper sulfate bottle, then click on a test tube",
        completed: false
      },
      {
        id: "step2_precipitation",
        description: "Heat the test tube gently with the bunsen burner",
        requiredEquipment: ["test_tube1", "bunsen_burner"],
        requiredActions: [
          {
            action: "heat",
            equipmentId: "test_tube1",
            value: 60
          }
        ],
        hint: "Move the test tube near the bunsen burner and click to heat it",
        completed: false
      },
      {
        id: "step3_precipitation",
        description: "Add a small amount of sodium hydroxide solution",
        requiredEquipment: ["chemical2", "test_tube1"],
        requiredActions: [
          {
            action: "mix",
            equipmentId: "chemical2",
            targetIds: ["test_tube1"]
          }
        ],
        hint: "Click on the NaOH bottle, then click on the test tube",
        completed: false
      },
      {
        id: "step4_precipitation",
        description: "Observe the formation of blue copper hydroxide precipitate",
        requiredEquipment: ["test_tube1"],
        requiredActions: [
          {
            action: "observe",
            equipmentId: "test_tube1"
          }
        ],
        hint: "Click on the test tube to observe it closely",
        completed: false
      }
    ]
  },
  
  {
    id: "exp_thermal_expansion",
    name: "Thermal Expansion",
    description: "Investigate how materials expand when heated",
    difficulty: "intermediate",
    subject: "physics",
    completed: false,
    active: false,
    steps: [
      {
        id: "step1_thermal",
        description: "Fill a beaker with water and note the level",
        requiredEquipment: ["beaker2"],
        requiredActions: [
          {
            action: "observe",
            equipmentId: "beaker2"
          }
        ],
        hint: "Click on the large beaker to observe it",
        completed: false
      },
      {
        id: "step2_thermal",
        description: "Heat the beaker using the bunsen burner",
        requiredEquipment: ["beaker2", "bunsen_burner"],
        requiredActions: [
          {
            action: "heat",
            equipmentId: "beaker2",
            value: 80
          }
        ],
        hint: "Place the beaker near the bunsen burner and click to heat it",
        completed: false
      },
      {
        id: "step3_thermal",
        description: "Observe the change in water level due to thermal expansion",
        requiredEquipment: ["beaker2"],
        requiredActions: [
          {
            action: "observe",
            equipmentId: "beaker2"
          }
        ],
        hint: "Click on the beaker to observe it closely after heating",
        completed: false
      },
      {
        id: "step4_thermal",
        description: "Measure the temperature of the water",
        requiredEquipment: ["beaker2"],
        requiredActions: [
          {
            action: "measure",
            equipmentId: "beaker2"
          }
        ],
        hint: "Click on the beaker to measure the temperature",
        completed: false
      }
    ]
  }
];
