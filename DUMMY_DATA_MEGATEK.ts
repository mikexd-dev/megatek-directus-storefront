export const DUMMY_CATEGORIES = [
  {
    id: "1",
    title: "Industry Seatings",
    slug: "industry-seatings",
    description: "", //WYSIWYG,
    images: [],
    subcategory: [
      { id: 1, title: "Chairs" },
      { id: 2, title: "Stools" },
      { id: 3, title: "Chair Components" },
    ],
    accordion: {
      reliability: {
        description: "",
        image: "",
      },
      functionality: {
        description: "",
        image: "",
      },
      ergonomics: {
        description: "",
        image: "",
      },
    }, // deprioritised
  },
];

export const DUMMY_SUBCATEGORIES = [
  {
    id: "1",
    title: "Industrial Chairs Seating",
    slug: "industry-chairs-seating",
    description: "", //WYSIWYG,
    images: "",
    products: [
      { id: 1, title: "5P Series Cleanroom ESD Chair" },
      { id: 2, title: "7P Series Cleanroom ESD Chair" },
      { id: 3, title: "9P Series Cleanroom ESD Chair" },
      { id: 4, title: "P8 Series Cleanroom ESD PU Chair" },
      { id: 5, title: "9G Series Conductive Chair" },
      { id: 6, title: "PU Moulded Laboratory Chair" },
    ],
    category: { id: 1, title: "Industry Seatings" },
  },
  {
    id: "2",
    title: "Chair Components",
    slug: "chair-components",
    description: "", //WYSIWYG,
    images: "",
    products: [
      { id: 1, title: "Chair Base" },
      { id: 2, title: "Chair Gas Lift" },
      { id: 3, title: "Chair Footring" },
      { id: 4, title: "Chair Castor" },
    ],
    category: { id: 3, title: "Industry Seatings" },
  },
];

export const DUMMY_PRODUCT = [
  {
    id: "1",
    title: "5P Series Cleanroom ESD Chair",
    slug: "5p-series-cleanroom-esd-chair",
    description: "", //WYSIWYG,
    images: "",
    features: "", //WYSIWYG
    specifications: "", //WYSIWYG
    video: "", // De-prioritised
    hasVariants: false,
    selections: [
      { id: 1, title: "Select Seat Height" },
      { id: 2, title: "Select Environment" },
      { id: 3, title: "Select Color" },
      { id: 4, title: "Select Upholstery" },
      { id: 5, title: "Select Mechanism" },
      { id: 6, title: "Select Base" },
    ],
    subcategory: { id: 1, title: "Industrial Chairs Seating" },
  },
  {
    id: "2",
    title: "Chair Base",
    slug: "chair-base",
    description: "", //WYSIWYG,
    images: "",
    features: "", //WYSIWYG
    specifications: "", //WYSIWYG
    video: "", // De-prioritised
    hasVariants: true,
    variants: [
      { id: 1, title: "Die-cast Aluminium Polished Chair Base" },
      { id: 2, title: "Reinforced Nylon Chair Base" },
      { id: 3, title: "5-prong Tubular Welded Chair Base" },
      { id: 4, title: "Polished Trumpet Base" },
    ],
    subcategory: { id: 2, title: "Chairs Components" },
  },
];

export const DUMMY_VARIANTS = [
  {
    id: "1",
    title: "Die-cast Aluminium Polished Chair Base",
    description: "", //WYSIWYG,
    image: "",
    features: "", //WYSIWYG
    specifications: "", //WYSIWYG
    video: "", // De-prioritised
    selections: [{ id: 2, title: "Select Base" }],
    product: { id: 2, title: "Chair Base" },
  },
];

export const DUMMY_SELECTION = [
  {
    id: "1",
    title: "Select Upholstery",
    description: "", //WYSIWYG,
    image: "",
    selection_options: [
      { id: 1, title: "Heavy Duty Industrial Grade Fabric" },
      { id: 2, title: "Heavy Duty Industrial Grade Vinyl" },
    ],
  },
  {
    id: "2",
    title: "Select Base",
    description: "", //WYSIWYG,
    image: "",
    selection_options: [
      { id: 1, title: "Die-cast Aluminium Dia.600mm" },
      { id: 2, title: "Die-cast Aluminium Dia.660mm" },
    ],
  },
];

export const DUMMY_SELCTION_OPTION = [
  {
    id: "1",
    title: "Heavy Duty Industrial Grade Vinyl",
    description: "", //WYSIWYG,
    image: "",
    shouldHide: { id: 1, title: "Class 10 Cleanroom" },
    selection: { id: 1, title: "Select Upholstery" },
  },
  {
    id: "2",
    title: "Die-cast Aluminium Dia.600mm",
    description: "", //WYSIWYG,
    image: "",
    shouldHide: {},
    selection: { id: 22, title: "Select Base" },
  },
];
