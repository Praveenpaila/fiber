require('dotenv').config();
const mongoose = require('mongoose');

const Apparatus = require('./models/Apparatus');
const ProcedureStep = require('./models/ProcedureStep');
const Precaution = require('./models/Precaution');
const Application = require('./models/Application');
const QuizQuestion = require('./models/QuizQuestion');
const Observation = require('./models/Observation');

const apparatusData = [
  {
    key: 'laser_source',
    name: 'Laser Diode Source (650 nm)',
    purpose: 'Provides monochromatic coherent red light for transmission through the optical fiber.',
    specs: [
      'Wavelength: 650 nm (red)',
      'Output power: 2 to 3 mW',
      'Port type: SMA / ST optical fiber connector',
      'Laser classification: Class 2 diode'
    ],
    dimensions: '12 cm x 4 cm x 4 cm',
    hotspotLabels: ['Optical Aperture', 'Power Switch', 'Focus Collimator'],
    order: 1
  },
  {
    key: 'optical_fiber',
    name: 'Step-Index Multimode Optical Fiber Cable',
    purpose: 'Guides the coupled laser beam via total internal reflection from input to output.',
    specs: [
      'Core diameter: 50 or 62.5 um',
      'Cladding diameter: 125 um',
      'Cable length: 1 meter patch cord',
      'Numerical aperture rating: 0.22 to 0.37'
    ],
    dimensions: '100 cm length, 3 mm outer protective jacket',
    hotspotLabels: ['Connector Ferrule', 'Fiber Core', 'Cladding Buffer'],
    order: 2
  },
  {
    key: 'fiber_holder',
    name: 'Fiber Holder with V-Clamp',
    purpose: 'Secures and aligns the output end of the optical fiber perpendicular to the target screen.',
    specs: [
      'Precision machined V-groove clamp',
      'Upright mounting post with height adjustment collar',
      'Knurled thumb screw for zero-damage clamping'
    ],
    dimensions: '8 cm post height, 3.5 cm clamp width',
    hotspotLabels: ['V-Groove Bed', 'Thumb Screw', 'Vertical Mount Post'],
    order: 3
  },
  {
    key: 'screen',
    name: 'Screen with Concentric Circles',
    purpose: 'Provides calibrated millimeter graduation rings to measure the spot diameter D.',
    specs: [
      'Concentric circles spaced at 2 mm radial intervals',
      'Matte white non-reflective surface',
      'Center cross-hair alignment mark'
    ],
    dimensions: '15 cm x 15 cm square target plate',
    hotspotLabels: ['Center Cross-hair', 'Concentric Rings', 'Millimeter Scale'],
    order: 4
  },
  {
    key: 'optical_bench',
    name: 'Optical Bench with Movable Sliders',
    purpose: 'Provides rigid linear alignment and adjustable positioning for source, fiber, and screen.',
    specs: [
      'Twin-rail extruded aluminum construction',
      'Three sliding riders with brass locking thumbscrews',
      'Dual leveling thumbscrews at bench ends'
    ],
    dimensions: '100 cm rail length, 10 cm width',
    hotspotLabels: ['Guide Rails', 'Locking Rider', 'Leveling Base'],
    order: 5
  },
  {
    key: 'meter_scale',
    name: 'Precision Meter Scale',
    purpose: 'Measures the separation distance L between the fiber output tip and the projection screen.',
    specs: [
      'Stainless steel with etched millimeter divisions',
      'Zero-error calibration index',
      'Anti-glare satin chrome finish'
    ],
    dimensions: '100 cm length, 2.5 cm width',
    hotspotLabels: ['Millimeter Divisions', 'Centimeter Numerals', 'Reference Edge'],
    order: 6
  }
];

const procedureData = [
  {
    stepNumber: 1,
    title: 'Align Optical Bench Components',
    description: 'Arrange the laser source, fiber holder, and screen in a straight coaxial line on the optical bench.',
    detailedNotes: 'Ensure that the riders glide smoothly and can be locked firmly at desired positions.'
  },
  {
    stepNumber: 2,
    title: 'Clean and Connect Fiber Input',
    description: 'Clean both fiber connector ends with optical tissue. Connect one end securely to the laser diode output port.',
    detailedNotes: 'Do not touch the polished glass ferrule tips with bare fingers.'
  },
  {
    stepNumber: 3,
    title: 'Mount the Output Tip in the V-Clamp',
    description: 'Mount the free output end of the optical fiber into the V-clamp holder facing the screen perpendicularly.',
    detailedNotes: 'The fiber tip must protrude approximately 5 mm past the clamp face.'
  },
  {
    stepNumber: 4,
    title: 'Power On and Inspect Spot',
    description: 'Switch on the laser diode power supply. Confirm a sharp circular red spot appears centered on the screen.',
    detailedNotes: 'Align the fiber holder height so the central beam hits the center cross-hair of the screen.'
  },
  {
    stepNumber: 5,
    title: 'Set Initial Distance L',
    description: 'Position the screen at an initial distance L (such as 2.0 cm) from the fiber output tip using the bench scale.',
    detailedNotes: 'Take the distance measurement directly from the fiber tip plane to the front screen surface.'
  },
  {
    stepNumber: 6,
    title: 'Measure Spot Diameter D',
    description: 'Measure the diameter of the illuminated circular spot along both horizontal and vertical axes, and record the mean diameter D.',
    detailedNotes: 'Maintain consistent brightness boundary criteria for each measurement.'
  },
  {
    stepNumber: 7,
    title: 'Repeat for Increasing Distances',
    description: 'Increase distance L in steps (such as 3.0 cm, 4.0 cm, 5.0 cm, and 6.0 cm) and measure the corresponding spot diameter D at each position.',
    detailedNotes: 'Collect at least 5 sets of readings to calculate a reliable statistical average.'
  },
  {
    stepNumber: 8,
    title: 'Calculate Numerical Aperture for Each Reading',
    description: 'Calculate the half diameter D/2, the hypotenuse sqrt(L^2 + (D/2)^2), and the numerical aperture NA for each reading, then compute the average NA.',
    detailedNotes: 'Use the formula NA = (D / 2) / sqrt(L^2 + (D / 2)^2).'
  },
  {
    stepNumber: 9,
    title: 'Calculate the Acceptance Angle',
    description: 'Determine the acceptance angle theta_0 using theta_0 = arcsin(average NA) and calculate the full cone angle 2 * theta_0.',
    detailedNotes: 'Express the final acceptance angle in degrees with two decimal precision.'
  }
];

const precautionsData = [
  {
    order: 1,
    title: 'Laser Radiation Safety',
    description: 'Never look directly into the laser beam or into the optical fiber output tip while the power is switched on.',
    iconName: 'ShieldAlert',
    isLaserSafety: true
  },
  {
    order: 2,
    title: 'Avoid Sharp Bends',
    description: 'Keep the optical fiber cable straight without tight loops or sharp bends that cause macrobending losses or core fracture.',
    iconName: 'Spline',
    isLaserSafety: false
  },
  {
    order: 3,
    title: 'Clean Polished Tips',
    description: 'Clean fiber connector tips with lint-free optical lens tissue. Avoid touching the polished glass face with fingers.',
    iconName: 'Sparkles',
    isLaserSafety: false
  },
  {
    order: 4,
    title: 'Perpendicular Alignment',
    description: 'Ensure the output tip of the fiber is strictly perpendicular to the flat surface of the projection screen.',
    iconName: 'Compass',
    isLaserSafety: false
  },
  {
    order: 5,
    title: 'Ambient Lighting Control',
    description: 'Dim the ambient room lighting so the outer perimeter of the projected red laser spot is clearly distinguishable.',
    iconName: 'SunDim',
    isLaserSafety: false
  },
  {
    order: 6,
    title: 'Consistent Boundary Criteria',
    description: 'Measure the diameter D consistently from the same visual perimeter intensity threshold across all distance steps.',
    iconName: 'Ruler',
    isLaserSafety: false
  },
  {
    order: 7,
    title: 'Gentle Cable Handling',
    description: 'Handle the optical patch cord gently without pulling or twisting the strain-relief boots at the connectors.',
    iconName: 'HandMetal',
    isLaserSafety: false
  },
  {
    order: 8,
    title: 'Intermittent Laser Operation',
    description: 'Turn off the laser diode between reading sets to prevent diode junction overheating and preserve calibration.',
    iconName: 'PowerOff',
    isLaserSafety: true
  }
];

const applicationsData = [
  {
    order: 1,
    title: 'Optical Fiber Communication and Internet Backbone',
    description: 'High capacity undersea and terrestrial glass fiber cables transmit digital voice, video, and data across continents with minimal optical attenuation.',
    whyNaMatters: 'A controlled numerical aperture balances light gathering efficiency with low modal dispersion to sustain multi-gigabit data transmission rates.',
    imagePath: '/images/telecom_fiber.jpg',
    sourceInfo: {
      author: 'Wikimedia Commons / Hustvedt',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fiber_optic_illuminated.jpg',
      license: 'CC BY-SA 3.0'
    }
  },
  {
    order: 2,
    title: 'Medical Endoscopy and Arthroscopy',
    description: 'Flexible coherent fiber bundles deliver high intensity illumination and return high resolution optical images from internal body cavities during surgeries.',
    whyNaMatters: 'A high numerical aperture collects diffuse reflected light from internal tissue, providing brighter clinical imagery inside tight cavities.',
    imagePath: '/images/endoscopy_scope.jpg',
    sourceInfo: {
      author: 'Wikimedia Commons / B. Wellum',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Flexible_endoscope.jpg',
      license: 'CC BY-SA 3.0'
    }
  },
  {
    order: 3,
    title: 'Fiber Optic Sensors in Civil Infrastructure',
    description: 'Optical fibers embedded inside bridges, dams, and tunnels monitor structural strain, temperature variations, and acoustic events in real time.',
    whyNaMatters: 'Specific numerical aperture values ensure stable light coupling into Fiber Bragg Gratings and interferometric sensing zones.',
    imagePath: '/images/fiber_sensor.jpg',
    sourceInfo: {
      author: 'Wikimedia Commons / G. Schierholz',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fiber_optic_cable_bundle.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    order: 4,
    title: 'Defense and Aerospace Communication',
    description: 'Fly-by-light flight control links and naval communication buses utilize fiber optics because glass conductors are immune to electromagnetic interference (EMI).',
    whyNaMatters: 'Tightly controlled numerical aperture fibers maintain coupling stability under intense mechanical vibration and thermal extremes.',
    imagePath: '/images/aerospace_fiber.jpg',
    sourceInfo: {
      author: 'NASA / Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Optical_fiber_laser_experiment.jpg',
      license: 'Public Domain'
    }
  },
  {
    order: 5,
    title: 'Illumination and Decorative Lighting',
    description: 'Optical fibers guide bright light from remote illuminators to display cabinets and architectural landmarks without carrying heat or electrical current.',
    whyNaMatters: 'A wide acceptance angle enables high optical coupling efficiency from broad halogen or solid-state LED light engines.',
    imagePath: '/images/decorative_fiber.jpg',
    sourceInfo: {
      author: 'Wikimedia Commons / Fir0002',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fibreoptic.jpg',
      license: 'GFDL 1.2 / CC BY-SA 3.0'
    }
  },
  {
    order: 6,
    title: 'Industrial Inspection and Factory Data Networks',
    description: 'Optical fibers carry sensor telemetry and video feeds through harsh industrial manufacturing cells containing heavy electromagnetic motors.',
    whyNaMatters: 'Optimized numerical aperture values permit forgiving connector alignment in dusty, vibrating industrial environments.',
    imagePath: '/images/industrial_fiber.jpg',
    sourceInfo: {
      author: 'Wikimedia Commons / David Monniaux',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fiber_optic_patch_panel.jpg',
      license: 'CC BY-SA 3.0'
    }
  }
];

const quizData = [
  {
    order: 1,
    question: 'What is the physical meaning of the Numerical Aperture of an optical fiber?',
    options: [
      'The physical diameter of the outer protective jacket',
      'The dimensionless figure of merit measuring the light gathering capacity of the fiber',
      'The attenuation rate of light per kilometer of fiber',
      'The electrical conductivity of the glass core'
    ],
    correctIndex: 1,
    explanation: 'Numerical Aperture (NA) is a dimensionless parameter that characterizes the range of angles over which the fiber can accept and propagate light by total internal reflection.'
  },
  {
    order: 2,
    question: 'What condition is required for Total Internal Reflection to occur inside an optical fiber?',
    options: [
      'Light must travel from core to cladding, and the core refractive index must be greater than the cladding refractive index',
      'The refractive index of the cladding must be greater than the core refractive index',
      'The incident angle inside the core must be smaller than the critical angle',
      'The fiber must be coated with a metallic reflective silver film'
    ],
    correctIndex: 0,
    explanation: 'Total internal reflection requires light to travel in an optically denser medium (core, n1) toward an optically rarer medium (cladding, n2, where n1 > n2) with an angle of incidence greater than the critical angle.'
  },
  {
    order: 3,
    question: 'If the core refractive index is n1 = 1.50 and cladding refractive index is n2 = 1.45, what is the theoretical Numerical Aperture?',
    options: [
      'NA = 0.384',
      'NA = 0.520',
      'NA = 0.200',
      'NA = 0.707'
    ],
    correctIndex: 0,
    explanation: 'NA = sqrt(n1^2 - n2^2) = sqrt(1.50^2 - 1.45^2) = sqrt(2.25 - 2.1025) = sqrt(0.1475) = 0.384.'
  },
  {
    order: 4,
    question: 'How is the acceptance angle theta_0 related to the Numerical Aperture (NA) in air?',
    options: [
      'theta_0 = arccos(NA)',
      'theta_0 = arcsin(NA)',
      'theta_0 = arctan(NA)',
      'theta_0 = 1 / NA'
    ],
    correctIndex: 1,
    explanation: 'For light entering from air (n0 = 1.0), the acceptance angle theta_0 is defined by sin(theta_0) = NA, which gives theta_0 = arcsin(NA).'
  },
  {
    order: 5,
    question: 'In this experiment, how is the spot diameter D related to the distance L from fiber tip to screen?',
    options: [
      'Spot diameter D decreases linearly as distance L increases',
      'Spot diameter D remains completely constant regardless of distance L',
      'Spot diameter D increases linearly with distance L as light diverges in a cone',
      'Spot diameter D oscillates sinusoidally with distance L'
    ],
    correctIndex: 2,
    explanation: 'Light exits the fiber end face in a conical beam of half-angle theta_0. As distance L increases, the spot diameter D increases proportionally according to D = 2 * L * tan(theta_0).'
  }
];

const exampleObservation = {
  studentName: 'Demo Student',
  rollNo: 'PH2026-001',
  readings: [
    { sNo: 1, L: 2.0, D: 1.6, halfD: 0.8, hypotenuse: 2.1541, NA: 0.371, theta: 21.8 },
    { sNo: 2, L: 3.0, D: 2.4, halfD: 1.2, hypotenuse: 3.2311, NA: 0.371, theta: 21.8 },
    { sNo: 3, L: 4.0, D: 3.2, halfD: 1.6, hypotenuse: 4.3081, NA: 0.371, theta: 21.8 },
    { sNo: 4, L: 5.0, D: 4.0, halfD: 2.0, hypotenuse: 5.3852, NA: 0.371, theta: 21.8 },
    { sNo: 5, L: 6.0, D: 4.8, halfD: 2.4, hypotenuse: 6.4622, NA: 0.371, theta: 21.8 }
  ],
  averageNA: 0.371,
  acceptanceAngle: 21.8,
  acceptanceCone: 43.6
};

async function seedDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fiberlab';
  console.log('Connecting to MongoDB for seeding at:', uri);

  await mongoose.connect(uri);

  console.log('Clearing existing content collections...');
  await Apparatus.deleteMany({});
  await ProcedureStep.deleteMany({});
  await Precaution.deleteMany({});
  await Application.deleteMany({});
  await QuizQuestion.deleteMany({});

  console.log('Inserting Apparatus records...');
  await Apparatus.insertMany(apparatusData);

  console.log('Inserting Procedure steps...');
  await ProcedureStep.insertMany(procedureData);

  console.log('Inserting Precautions...');
  await Precaution.insertMany(precautionsData);

  console.log('Inserting Applications...');
  await Application.insertMany(applicationsData);

  console.log('Inserting Quiz questions...');
  await QuizQuestion.insertMany(quizData);

  const existingDemo = await Observation.findOne({ rollNo: exampleObservation.rollNo });
  if (!existingDemo) {
    console.log('Inserting sample Observation record...');
    await Observation.create(exampleObservation);
  }

  console.log('Seeding completed successfully.');
  await mongoose.disconnect();
}

if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Database seeding process finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error seeding database:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
