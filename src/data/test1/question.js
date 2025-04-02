const generateQuestionId = (
  mainSection,
  subSection,
  index
) => {
  const mainSectionIndex = ["Physics", "Chemistry", "Mathematics"].indexOf(
    mainSection
  );
  const subSectionIndex = ["Section 1", "Section 2", "Section 3"].indexOf(
    subSection
  );
  return mainSectionIndex * 18 + subSectionIndex * 6 + index + 1;
};

// Physics Section 1 Images
const physicsSection1Images = {
  q1: {
    question: "/images/questions/q1.png",
    options: [
      "/images/options/option1.png",
      "/images/options/option2.png",
      "/images/options/option3.png",
      "/images/options/option4.png",
    ],
  },
  q2: {
    question:
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=500&auto=format&fit=crop&q=60",
    options: [
      "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1527409335569-f0e5c91fa707?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&auto=format&fit=crop&q=60",
    ],
  },
};

// Physics Section 2 Images
const physicsSection2Images = {
  q1: {
    question:
      "https://images.unsplash.com/photo-1527168027773-0cc890c4f42e?w=500&auto=format&fit=crop&q=60",
    options: [
      "https://images.unsplash.com/photo-1527168027773-0cc890c4f42e?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1527409335569-f0e5c91fa707?w=200&auto=format&fit=crop&q=60",
    ],
  },
};

// Physics Section 3 Images
const physicsSection3Images = {
  q1: {
    question:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&auto=format&fit=crop&q=60",
  },
};

// Chemistry Section 1 Images
const chemistrySection1Images = {
  q1: {
    question:
      "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=500&auto=format&fit=crop&q=60",
    options: [
      "https://images.unsplash.com/photo-1527409335569-f0e5c91fa707?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1535813547-3e2d1c815a91?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=200&auto=format&fit=crop&q=60",
    ],
  },
};

// Chemistry Section 2 Images
const chemistrySection2Images = {
  q1: {
    question:
      "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=500&auto=format&fit=crop&q=60",
    options: [
      "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1535813547-3e2d1c815a91?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1527409335569-f0e5c91fa707?w=200&auto=format&fit=crop&q=60",
    ],
  },
};

// Chemistry Section 3 Images
const chemistrySection3Images = {
  q1: {
    question:
      "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=500&auto=format&fit=crop&q=60",
  },
};

// Mathematics Section 1 Images
const mathematicsSection1Images = {
  q1: {
    question:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60",
    options: [
      "https://images.unsplash.com/photo-1614633833026-0820452b4170?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1527168027773-0cc890c4f42e?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=200&auto=format&fit=crop&q=60",
    ],
  },
};

// Mathematics Section 2 Images
const mathematicsSection2Images = {
  q1: {
    question:
      "https://images.unsplash.com/photo-1614633833026-0820452b4170?w=500&auto=format&fit=crop&q=60",
    options: [
      "https://images.unsplash.com/photo-1614633833026-0820452b4170?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1527168027773-0cc890c4f42e?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=200&auto=format&fit=crop&q=60",
    ],
  },
};

// Mathematics Section 3 Images
const mathematicsSection3Images = {
  q1: {
    question:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60",
  },
};

export const questions = [
  // Physics Section 1 (Single Correct MCQ)
  {
    id: generateQuestionId("Physics", "Section 1", 0),
    text: "Small amplitude standing waves of wavelength $\\lambda$ occur on a string with tension $T$, mass per unit length $\\mu$, and length $L$. One end of the string is fixed, and the other end is attached to a ring of mass $M$ that slides on a frictionless rod, as shown in the figure above. When gravity is neglected, which of the following conditions correctly determines the wavelength?",
    type: "mcq-single",
    image: physicsSection1Images.q1.question,
    options: [
      {
        text: "A",
        value: "Newton",
        image: physicsSection1Images.q1.options[0],
      },
      { text: "B", value: "Joule", image: physicsSection1Images.q1.options[1] },
      { text: "C", value: "Watt", image: physicsSection1Images.q1.options[2] },
      {
        text: "D",
        value: "Pascal",
        image: physicsSection1Images.q1.options[3],
      },
    ],
    correctAnswer: "Newton",
    mainSection: "Physics",
    subSection: "Section 1",
  },
  {
    id: generateQuestionId("Physics", "Section 1", 1),
    text: "Which physical quantity is a measure of inertia?",
    type: "mcq-single",
    image: physicsSection1Images.q2.question,
    options: [
      {
        text: "Mass",
        value: "Mass",
        image: physicsSection1Images.q2.options[0],
      },
      {
        text: "Weight",
        value: "Weight",
        image: physicsSection1Images.q2.options[1],
      },
      {
        text: "Velocity",
        value: "Velocity",
        image: physicsSection1Images.q2.options[2],
      },
      {
        text: "Acceleration",
        value: "Acceleration",
        image: physicsSection1Images.q2.options[3],
      },
    ],
    correctAnswer: "Mass",
    mainSection: "Physics",
    subSection: "Section 1",
  },
  {
    id: generateQuestionId("Physics", "Section 1", 2),
    text: "Which of these is a scalar quantity?",
    type: "mcq-single",
    options: [
      { text: "Speed", value: "Speed" },
      { text: "Velocity", value: "Velocity" },
      { text: "Force", value: "Force" },
      { text: "Momentum", value: "Momentum" },
    ],
    correctAnswer: "Speed",
    mainSection: "Physics",
    subSection: "Section 1",
  },
  {
    id: generateQuestionId("Physics", "Section 1", 3),
    text: "What is the unit of electric current?",
    type: "mcq-single",
    options: [
      { text: "Ampere", value: "Ampere" },
      { text: "Volt", value: "Volt" },
      { text: "Ohm", value: "Ohm" },
      { text: "Watt", value: "Watt" },
    ],
    correctAnswer: "Ampere",
    mainSection: "Physics",
    subSection: "Section 1",
  },
  {
    id: generateQuestionId("Physics", "Section 1", 4),
    text: "Which mirror always forms a virtual image?",
    type: "mcq-single",
    options: [
      { text: "Convex mirror", value: "Convex mirror" },
      { text: "Concave mirror", value: "Concave mirror" },
      { text: "Plane mirror", value: "Plane mirror" },
      { text: "None of these", value: "None of these" },
    ],
    correctAnswer: "Convex mirror",
    mainSection: "Physics",
    subSection: "Section 1",
  },
  {
    id: generateQuestionId("Physics", "Section 1", 5),
    text: "What is the SI unit of pressure?",
    type: "mcq-single",
    options: [
      { text: "Pascal", value: "Pascal" },
      { text: "Newton", value: "Newton" },
      { text: "Joule", value: "Joule" },
      { text: "Watt", value: "Watt" },
    ],
    correctAnswer: "Pascal",
    mainSection: "Physics",
    subSection: "Section 1",
  },

  // Physics Section 2 (Multiple Correct MCQ)
  {
    id: generateQuestionId("Physics", "Section 2", 0),
    text: "Which of these are vector quantities?",
    type: "mcq-multiple",
    image: physicsSection2Images.q1.question,
    options: [
      {
        text: "Velocity",
        value: "Velocity",
        image: physicsSection2Images.q1.options[0],
      },
      {
        text: "Force",
        value: "Force",
        image: physicsSection2Images.q1.options[1],
      },
      {
        text: "Displacement",
        value: "Displacement",
        image: physicsSection2Images.q1.options[2],
      },
      {
        text: "Speed",
        value: "Speed",
        image: physicsSection2Images.q1.options[3],
      },
    ],
    correctAnswer: ["Velocity", "Force", "Displacement"],
    mainSection: "Physics",
    subSection: "Section 2",
  },
  {
    id: generateQuestionId("Physics", "Section 2", 1),
    text: "Select all correct statements about waves:",
    type: "mcq-multiple",
    options: [
      { text: "Sound waves are longitudinal", value: "longitudinal" },
      { text: "Light waves are transverse", value: "transverse" },
      { text: "All waves need a medium", value: "medium" },
      { text: "Waves transfer energy", value: "energy" },
    ],
    correctAnswer: ["longitudinal", "transverse", "energy"],
    mainSection: "Physics",
    subSection: "Section 2",
  },
  {
    id: generateQuestionId("Physics", "Section 2", 2),
    text: "Which of these are conservative forces?",
    type: "mcq-multiple",
    options: [
      { text: "Gravitational force", value: "gravity" },
      { text: "Elastic force", value: "elastic" },
      { text: "Friction", value: "friction" },
      { text: "Air resistance", value: "air" },
    ],
    correctAnswer: ["gravity", "elastic"],
    mainSection: "Physics",
    subSection: "Section 2",
  },
  {
    id: generateQuestionId("Physics", "Section 2", 3),
    text: "Select all true statements about nuclear forces:",
    type: "mcq-multiple",
    options: [
      { text: "They are strongest at short distances", value: "short" },
      { text: "They hold nucleons together", value: "nucleons" },
      { text: "They are always attractive", value: "attractive" },
      { text: "They are charge independent", value: "charge" },
    ],
    correctAnswer: ["short", "nucleons", "charge"],
    mainSection: "Physics",
    subSection: "Section 2",
  },
  {
    id: generateQuestionId("Physics", "Section 2", 4),
    text: "Which of these are examples of electromagnetic waves?",
    type: "mcq-multiple",
    options: [
      { text: "X-rays", value: "xray" },
      { text: "Radio waves", value: "radio" },
      { text: "Sound waves", value: "sound" },
      { text: "Microwaves", value: "micro" },
    ],
    correctAnswer: ["xray", "radio", "micro"],
    mainSection: "Physics",
    subSection: "Section 2",
  },
  {
    id: generateQuestionId("Physics", "Section 2", 5),
    text: "Select all correct statements about conductors:",
    type: "mcq-multiple",
    options: [
      { text: "They have free electrons", value: "electrons" },
      { text: "They conduct heat well", value: "heat" },
      { text: "All are solid at room temperature", value: "solid" },
      { text: "They have low resistance", value: "resistance" },
    ],
    correctAnswer: ["electrons", "heat", "resistance"],
    mainSection: "Physics",
    subSection: "Section 2",
  },

  // Physics Section 3 (Integer Type)
  {
    id: generateQuestionId("Physics", "Section 3", 0),
    text: "Calculate the acceleration due to gravity on Earth (rounded to nearest integer, in m/s²)",
    type: "integer",
    image: physicsSection3Images.q1.question,
    correctAnswer: 10,
    mainSection: "Physics",
    subSection: "Section 3",
  },
  {
    id: generateQuestionId("Physics", "Section 3", 1),
    text: "How many electrons are there in the outermost shell of Sodium?",
    type: "integer",
    correctAnswer: 1,
    mainSection: "Physics",
    subSection: "Section 3",
  },
  {
    id: generateQuestionId("Physics", "Section 3", 2),
    text: "What is the atomic number of Carbon?",
    type: "integer",
    correctAnswer: 6,
    mainSection: "Physics",
    subSection: "Section 3",
  },
  {
    id: generateQuestionId("Physics", "Section 3", 3),
    text: "How many significant figures are there in 0.00230?",
    type: "integer",
    correctAnswer: 3,
    mainSection: "Physics",
    subSection: "Section 3",
  },
  {
    id: generateQuestionId("Physics", "Section 3", 4),
    text: "If a body moves with constant velocity, what is its acceleration (in m/s²)?",
    type: "integer",
    correctAnswer: 0,
    mainSection: "Physics",
    subSection: "Section 3",
  },
  {
    id: generateQuestionId("Physics", "Section 3", 5),
    text: "What is the valency of Nitrogen in NH₃?",
    type: "integer",
    correctAnswer: 3,
    mainSection: "Physics",
    subSection: "Section 3",
  },

  // Chemistry Section 1 (Single Correct MCQ)
  {
    id: generateQuestionId("Chemistry", "Section 1", 0),
    text: "Which of these is a noble gas?",
    type: "mcq-single",
    image: chemistrySection1Images.q1.question,
    options: [
      {
        text: "Helium",
        value: "Helium",
        image: chemistrySection1Images.q1.options[0],
      },
      {
        text: "Oxygen",
        value: "Oxygen",
        image: chemistrySection1Images.q1.options[1],
      },
      {
        text: "Nitrogen",
        value: "Nitrogen",
        image: chemistrySection1Images.q1.options[2],
      },
      {
        text: "Hydrogen",
        value: "Hydrogen",
        image: chemistrySection1Images.q1.options[3],
      },
    ],
    correctAnswer: "Helium",
    mainSection: "Chemistry",
    subSection: "Section 1",
  },
  {
    id: generateQuestionId("Chemistry", "Section 1", 1),
    text: "What is the most abundant element in Earth's crust?",
    type: "mcq-single",
    options: [
      { text: "Oxygen", value: "Oxygen" },
      { text: "Silicon", value: "Silicon" },
      { text: "Aluminum", value: "Aluminum" },
      { text: "Iron", value: "Iron" },
    ],
    correctAnswer: "Oxygen",
    mainSection: "Chemistry",
    subSection: "Section 1",
  },
  {
    id: generateQuestionId("Chemistry", "Section 1", 2),
    text: "Which of these is an acid?",
    type: "mcq-single",
    options: [
      { text: "NaOH", value: "NaOH" },
      { text: "KOH", value: "KOH" },
      { text: "HCl", value: "HCl" },
      { text: "NH₃", value: "NH₃" },
    ],
    correctAnswer: "HCl",
    mainSection: "Chemistry",
    subSection: "Section 1",
  },
  {
    id: generateQuestionId("Chemistry", "Section 1", 3),
    text: "What is the charge on an electron?",
    type: "mcq-single",
    options: [
      { text: "+1", value: "+1" },
      { text: "-1", value: "-1" },
      { text: "0", value: "0" },
      { text: "+2", value: "+2" },
    ],
    correctAnswer: "-1",
    mainSection: "Chemistry",
    subSection: "Section 1",
  },
  {
    id: generateQuestionId("Chemistry", "Section 1", 4),
    text: "Which element has the highest electronegativity?",
    type: "mcq-single",
    options: [
      { text: "Fluorine", value: "Fluorine" },
      { text: "Oxygen", value: "Oxygen" },
      { text: "Chlorine", value: "Chlorine" },
      { text: "Nitrogen", value: "Nitrogen" },
    ],
    correctAnswer: "Fluorine",
    mainSection: "Chemistry",
    subSection: "Section 1",
  },
  {
    id: generateQuestionId("Chemistry", "Section 1", 5),
    text: "What is the IUPAC name of CH₃-CH₂-CH₃?",
    type: "mcq-single",
    options: [
      { text: "Propane", value: "Propane" },
      { text: "Ethane", value: "Ethane" },
      { text: "Methane", value: "Methane" },
      { text: "Butane", value: "Butane" },
    ],
    correctAnswer: "Propane",
    mainSection: "Chemistry",
    subSection: "Section 1",
  },

  // Chemistry Section 2 (Multiple Correct MCQ)
  {
    id: generateQuestionId("Chemistry", "Section 2", 0),
    text: "Select all elements that are metals:",
    type: "mcq-multiple",
    image: chemistrySection2Images.q1.question,
    options: [
      {
        text: "Sodium",
        value: "Sodium",
        image: chemistrySection2Images.q1.options[0],
      },
      {
        text: "Iron",
        value: "Iron",
        image: chemistrySection2Images.q1.options[1],
      },
      {
        text: "Aluminum",
        value: "Aluminum",
        image: chemistrySection2Images.q1.options[2],
      },
      {
        text: "Chlorine",
        value: "Chlorine",
        image: chemistrySection2Images.q1.options[3],
      },
    ],
    correctAnswer: ["Sodium", "Iron", "Aluminum"],
    mainSection: "Chemistry",
    subSection: "Section 2",
  },
  {
    id: generateQuestionId("Chemistry", "Section 2", 1),
    text: "Which of these are oxidizing agents?",
    type: "mcq-multiple",
    options: [
      { text: "KMnO₄", value: "KMnO4" },
      { text: "K₂Cr₂O₇", value: "K2Cr2O7" },
      { text: "Na", value: "Na" },
      { text: "H₂O₂", value: "H2O2" },
    ],
    correctAnswer: ["KMnO4", "K2Cr2O7", "H2O2"],
    mainSection: "Chemistry",
    subSection: "Section 2",
  },
  {
    id: generateQuestionId("Chemistry", "Section 2", 2),
    text: "Select all correct statements about alkali metals:",
    type: "mcq-multiple",
    options: [
      { text: "They are soft", value: "soft" },
      { text: "They react with water", value: "water" },
      { text: "They have high melting points", value: "melting" },
      { text: "They form +1 ions", value: "ions" },
    ],
    correctAnswer: ["soft", "water", "ions"],
    mainSection: "Chemistry",
    subSection: "Section 2",
  },
  {
    id: generateQuestionId("Chemistry", "Section 2", 3),
    text: "Which of these are greenhouse gases?",
    type: "mcq-multiple",
    options: [
      { text: "CO₂", value: "CO2" },
      { text: "CH₄", value: "CH4" },
      { text: "N₂O", value: "N2O" },
      { text: "O₂", value: "O2" },
    ],
    correctAnswer: ["CO2", "CH4", "N2O"],
    mainSection: "Chemistry",
    subSection: "Section 2",
  },
  {
    id: generateQuestionId("Chemistry", "Section 2", 4),
    text: "Select all correct statements about transition elements:",
    type: "mcq-multiple",
    options: [
      { text: "They form colored compounds", value: "color" },
      { text: "They show variable oxidation states", value: "oxidation" },
      { text: "They are all gases", value: "gases" },
      { text: "They form complex compounds", value: "complex" },
    ],
    correctAnswer: ["color", "oxidation", "complex"],
    mainSection: "Chemistry",
    subSection: "Section 2",
  },
  {
    id: generateQuestionId("Chemistry", "Section 2", 5),
    text: "Which of these are Lewis acids?",
    type: "mcq-multiple",
    options: [
      { text: "BF₃", value: "BF3" },
      { text: "AlCl₃", value: "AlCl3" },
      { text: "NH₃", value: "NH3" },
      { text: "FeCl₃", value: "FeCl3" },
    ],
    correctAnswer: ["BF3", "AlCl3", "FeCl3"],
    mainSection: "Chemistry",
    subSection: "Section 2",
  },

  // Chemistry Section 3 (Integer Type)
  {
    id: generateQuestionId("Chemistry", "Section 3", 0),
    text: "What is the atomic number of Carbon?",
    type: "integer",
    image: chemistrySection3Images.q1.question,
    correctAnswer: 6,
    mainSection: "Chemistry",
    subSection: "Section 3",
  },
  {
    id: generateQuestionId("Chemistry", "Section 3", 1),
    text: "What is the pH of pure water at 25°C?",
    type: "integer",
    correctAnswer: 7,
    mainSection: "Chemistry",
    subSection: "Section 3",
  },
  {
    id: generateQuestionId("Chemistry", "Section 3", 2),
    text: "How many electrons can the first shell of an atom hold?",
    type: "integer",
    correctAnswer: 2,
    mainSection: "Chemistry",
    subSection: "Section 3",
  },
  {
    id: generateQuestionId("Chemistry", "Section 3", 3),
    text: "What is the atomic number of Sodium?",
    type: "integer",
    correctAnswer: 11,
    mainSection: "Chemistry",
    subSection: "Section 3",
  },
  {
    id: generateQuestionId("Chemistry", "Section 3", 4),
    text: "What is the number of bonds in a nitrogen molecule (N₂)?",
    type: "integer",
    correctAnswer: 3,
    mainSection: "Chemistry",
    subSection: "Section 3",
  },
  {
    id: generateQuestionId("Chemistry", "Section 3", 5),
    text: "What is the oxidation state of Chromium in K₂Cr₂O₇?",
    type: "integer",
    correctAnswer: 6,
    mainSection: "Chemistry",
    subSection: "Section 3",
  },

  // Mathematics Section 1 (Single Correct MCQ)
  {
    id: generateQuestionId("Mathematics", "Section 1", 0),
    text: "Which of these is a prime number?",
    type: "mcq-single",
    image: mathematicsSection1Images.q1.question,
    options: [
      { text: "1", value: "1", image: mathematicsSection1Images.q1.options[0] },
      { text: "2", value: "2", image: mathematicsSection1Images.q1.options[1] },
      { text: "4", value: "4", image: mathematicsSection1Images.q1.options[2] },
      { text: "6", value: "6", image: mathematicsSection1Images.q1.options[3] },
    ],
    correctAnswer: "2",
    mainSection: "Mathematics",
    subSection: "Section 1",
  },
  {
    id: generateQuestionId("Mathematics", "Section 1", 1),
    text: "What is the value of sin(90°)?",
    type: "mcq-single",
    options: [
      { text: "0", value: "0" },
      { text: "1", value: "1" },
      { text: "-1", value: "-1" },
      { text: "undefined", value: "undefined" },
    ],
    correctAnswer: "1",
    mainSection: "Mathematics",
    subSection: "Section 1",
  },
  {
    id: generateQuestionId("Mathematics", "Section 1", 2),
    text: "What is the derivative of x² with respect to x?",
    type: "mcq-single",
    options: [
      { text: "x", value: "x" },
      { text: "2x", value: "2x" },
      { text: "x²", value: "x²" },
      { text: "2", value: "2" },
    ],
    correctAnswer: "2x",
    mainSection: "Mathematics",
    subSection: "Section 1",
  },
  {
    id: generateQuestionId("Mathematics", "Section 1", 3),
    text: "What is the value of log₁₀(1)?",
    type: "mcq-single",
    options: [
      { text: "0", value: "0" },
      { text: "1", value: "1" },
      { text: "10", value: "10" },
      { text: "undefined", value: "undefined" },
    ],
    correctAnswer: "0",
    mainSection: "Mathematics",
    subSection: "Section 1",
  },
  {
    id: generateQuestionId("Mathematics", "Section 1", 4),
    text: "What is the slope of a line parallel to the x-axis?",
    type: "mcq-single",
    options: [
      { text: "0", value: "0" },
      { text: "1", value: "1" },
      { text: "undefined", value: "undefined" },
      { text: "infinity", value: "infinity" },
    ],
    correctAnswer: "0",
    mainSection: "Mathematics",
    subSection: "Section 1",
  },
  {
    id: generateQuestionId("Mathematics", "Section 1", 5),
    text: "What is the value of cos(0°)?",
    type: "mcq-single",
    options: [
      { text: "0", value: "0" },
      { text: "1", value: "1" },
      { text: "-1", value: "-1" },
      { text: "undefined", value: "undefined" },
    ],
    correctAnswer: "1",
    mainSection: "Mathematics",
    subSection: "Section 1",
  },

  // Mathematics Section 2 (Multiple Correct MCQ)
  {
    id: generateQuestionId("Mathematics", "Section 2", 0),
    text: "Select all statements that are true about triangles:",
    type: "mcq-multiple",
    image: mathematicsSection2Images.q1.question,
    options: [
      {
        text: "The sum of interior angles is 180°",
        value: "angle180",
        image: mathematicsSection2Images.q1.options[0],
      },
      {
        text: "The longest side is called the hypotenuse",
        value: "hypotenuse",
        image: mathematicsSection2Images.q1.options[1],
      },
      {
        text: "The altitude to the base bisects it",
        value: "altitude",
        image: mathematicsSection2Images.q1.options[2],
      },
      {
        text: "All triangles are equilateral",
        value: "equilateral",
        image: mathematicsSection2Images.q1.options[3],
      },
    ],
    correctAnswer: ["angle180", "hypotenuse"],
    mainSection: "Mathematics",
    subSection: "Section 2",
  },
  {
    id: generateQuestionId("Mathematics", "Section 2", 1),
    text: "Which of these are even functions?",
    type: "mcq-multiple",
    options: [
      { text: "f(x) = x²", value: "x2" },
      { text: "f(x) = cos(x)", value: "cos" },
      { text: "f(x) = x³", value: "x3" },
      { text: "f(x) = sin(x)", value: "sin" },
    ],
    correctAnswer: ["x2", "cos"],
    mainSection: "Mathematics",
    subSection: "Section 2",
  },
  {
    id: generateQuestionId("Mathematics", "Section 2", 2),
    text: "Select all true statements about matrices:",
    type: "mcq-multiple",
    options: [
      { text: "Matrix multiplication is commutative", value: "commutative" },
      { text: "Identity matrix is square", value: "identity" },
      { text: "Diagonal matrix is square", value: "diagonal" },
      { text: "Addition is associative", value: "addition" },
    ],
    correctAnswer: ["identity", "diagonal", "addition"],
    mainSection: "Mathematics",
    subSection: "Section 2",
  },
  {
    id: generateQuestionId("Mathematics", "Section 2", 3),
    text: "Which of these are irrational numbers?",
    type: "mcq-multiple",
    options: [
      { text: "π", value: "pi" },
      { text: "√2", value: "root2" },
      { text: "e", value: "e" },
      { text: "0.5", value: "half" },
    ],
    correctAnswer: ["pi", "root2", "e"],
    mainSection: "Mathematics",
    subSection: "Section 2",
  },
  {
    id: generateQuestionId("Mathematics", "Section 2", 4),
    text: "Select all true statements about circles:",
    type: "mcq-multiple",
    options: [
      { text: "All radii are equal", value: "radii" },
      { text: "Diameter is twice the radius", value: "diameter" },
      { text: "Area = πr²", value: "area" },
      { text: "All chords are equal", value: "chords" },
    ],
    correctAnswer: ["radii", "diameter", "area"],
    mainSection: "Mathematics",
    subSection: "Section 2",
  },
  {
    id: generateQuestionId("Mathematics", "Section 2", 5),
    text: "Which of these are continuous functions?",
    type: "mcq-multiple",
    options: [
      { text: "f(x) = sin(x)", value: "sin" },
      { text: "f(x) = e^x", value: "exp" },
      { text: "f(x) = 1/x", value: "reciprocal" },
      { text: "f(x) = x²", value: "square" },
    ],
    correctAnswer: ["sin", "exp", "square"],
    mainSection: "Mathematics",
    subSection: "Section 2",
  },

  // Mathematics Section 3 (Integer Type)
  {
    id: generateQuestionId("Mathematics", "Section 3", 0),
    text: "What is the value of 2³?",
    type: "integer",
    image: mathematicsSection3Images.q1.question,
    correctAnswer: 8,
    mainSection: "Mathematics",
    subSection: "Section 3",
  },
  {
    id: generateQuestionId("Mathematics", "Section 3", 1),
    text: "How many diagonals does a pentagon have?",
    type: "integer",
    correctAnswer: 5,
    mainSection: "Mathematics",
    subSection: "Section 3",
  },
  {
    id: generateQuestionId("Mathematics", "Section 3", 2),
    text: "What is the sum of first 5 natural numbers?",
    type: "integer",
    correctAnswer: 15,
    mainSection: "Mathematics",
    subSection: "Section 3",
  },
  {
    id: generateQuestionId("Mathematics", "Section 3", 3),
    text: "What is the value of 5!?",
    type: "integer",
    correctAnswer: 120,
    mainSection: "Mathematics",
    subSection: "Section 3",
  },
  {
    id: generateQuestionId("Mathematics", "Section 3", 4),
    text: "What is the number of edges in a cube?",
    type: "integer",
    correctAnswer: 12,
    mainSection: "Mathematics",
    subSection: "Section 3",
  },
  {
    id: generateQuestionId("Mathematics", "Section 3", 5),
    text: "What is the sum of angles in a hexagon (in degrees)?",
    type: "integer",
    correctAnswer: 720,
    mainSection: "Mathematics",
    subSection: "Section 3",
  },
];
