import { defineBrand } from "@/lib/brand/validation";

const basePath = "/brand/brainbots" as const;

export const brainbotsBrand = defineBrand({
  slug: "brainbots",
  name: "Brainbots",
  guidelinesLabel: "Brand guidelines",
  summary:
    "A playful, trustworthy learning brand that helps young people turn curiosity into real digital projects.",
  year: 2026,
  assetsBasePath: basePath,
  metadata: {
    title: "Brainbots Brand Guidelines",
    description:
      "The Brainbots identity, color, typography, motion, voice, imagery, applications, and downloadable brand assets.",
  },
  theme: {
    background: "#FFFFFF",
    foreground: "#0A0A0A",
    accent: "#2201FF",
    accentForeground: "#FFFFFF",
    surface: "#F2F2F2",
    muted: "#747474",
    border: "#D8D8D8",
  },
  introduction: {
    heroAlt: "A Brainbots learner seated in a workshop",
    statement: "Curious minds create what comes next.",
    facts: [
      { label: "Audience", value: "Ages 5–18" },
      { label: "Region", value: "The Gulf" },
      { label: "Format", value: "Live classes" },
      { label: "Outcome", value: "Real projects" },
    ],
    heading: "Play, code, innovate.",
    lead: "Brainbots helps children and teenagers move from using technology to creating with it.",
    body: "Live, project-based learning turns big technical ideas into approachable experiences. Every touchpoint should feel energetic and optimistic for learners while remaining specific, transparent, and reassuring for parents.",
  },
  logo: {
    heading: "A clear space for the Brainbots identity.",
    description:
      "The Brainbots primary logo and logomark combine an energetic symbol with a clear, approachable wordmark.",
    primary: {
      title: "Primary logo",
      description:
        "Use the complete wordmark for introductions, campaign sign-offs, and layouts with enough horizontal space.",
      alt: "Brainbots primary logo",
      clearSpaceLabel: "1x = half the logo height",
    },
    mark: {
      title: "Logomark",
      description:
        "Use the compact mark only where the brand is already established or available space is constrained.",
      alt: "Brainbots logomark",
      clearSpaceLabel: "1x = half the logo height",
    },
  },
  colors: {
    heading: "Color",
    description:
      "Electric Ultramarine anchors the system, supporting colors add discovery and playfulness.",
    proportionsNote: "Example UI distribution—not official",
    items: [
      {
        name: "White",
        hex: "#FFFFFF",
        foreground: "dark",
        proportion: 46,
        mosaic: { columnStart: 4, columnSpan: 3, rowStart: 1, rowSpan: 1 },
      },
      {
        name: "Vampire Black",
        hex: "#0A0A0A",
        foreground: "light",
        proportion: 34,
        mosaic: { columnStart: 1, columnSpan: 3, rowStart: 1, rowSpan: 1 },
      },
      {
        name: "Electric Ultramarine",
        hex: "#2201FF",
        foreground: "light",
        proportion: 8,
        mosaic: { columnStart: 3, columnSpan: 4, rowStart: 2, rowSpan: 1 },
      },
      {
        name: "Spring Bud",
        hex: "#AEFF02",
        foreground: "dark",
        proportion: 4,
        mosaic: { columnStart: 1, columnSpan: 2, rowStart: 2, rowSpan: 2 },
      },
      {
        name: "Shocking Pink",
        mosaicLabel: "Pink",
        hex: "#FE06BE",
        foreground: "dark",
        proportion: 3,
        mosaic: { columnStart: 3, columnSpan: 1, rowStart: 3, rowSpan: 1 },
      },
      {
        name: "Vivid Yellow",
        mosaicLabel: "Yellow",
        hex: "#FFE600",
        foreground: "dark",
        proportion: 2,
        mosaic: { columnStart: 4, columnSpan: 1, rowStart: 3, rowSpan: 1 },
      },
      {
        name: "Lavender Indigo",
        mosaicLabel: "Purple",
        hex: "#A44AFE",
        foreground: "dark",
        proportion: 2,
        mosaic: { columnStart: 5, columnSpan: 1, rowStart: 3, rowSpan: 1 },
      },
      {
        name: "Vivid Red",
        mosaicLabel: "Red",
        hex: "#FE3649",
        foreground: "dark",
        proportion: 1,
        mosaic: { columnStart: 6, columnSpan: 1, rowStart: 3, rowSpan: 1 },
      },
    ],
  },
  typography: {
    heading: "Typography",
    description:
      "Sora carries the Latin system with geometric confidence. Tajawal gives Arabic the same friendly clarity and range.",
    defaultSystemId: "latin",
    typefaces: [
      {
        id: "sora",
        displayName: "Sora",
        cssFamily: '"Sora", sans-serif',
        source: "Google Fonts",
        styleCount: "Variable 100–800",
        weights: [
          { name: "Thin", value: 100 },
          { name: "Light", value: 300 },
          { name: "Regular", value: 400 },
          { name: "Medium", value: 500 },
          { name: "Semibold", value: 600 },
          { name: "Bold", value: 700 },
          { name: "ExtraBold", value: 800 },
        ],
      },
      {
        id: "tajawal",
        displayName: "Tajawal",
        nativeName: "تجول",
        cssFamily: '"Tajawal", sans-serif',
        source: "Google Fonts",
        styleCount: "4 styles",
        weights: [
          { name: "Regular", value: 400 },
          { name: "Medium", value: 500 },
          { name: "Bold", value: 700 },
          { name: "ExtraBold", value: 800 },
        ],
      },
    ],
    systems: [
      {
        id: "latin",
        label: "Latin",
        lang: "en",
        direction: "ltr",
        heading: {
          typefaceId: "sora",
          role: "Latin typeface",
          description:
            "Open forms keep Latin display and text technical, never cold.",
          charset:
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 &?!@#%",
          specimenGlyph: "a",
          specimenWeightValues: [500, 600, 700],
        },
        body: { mode: "shared" },
        scale: [
          {
            role: "Display",
            usage: "heading",
            sizePx: 48,
            lineHeightPx: 48,
            letterSpacing: "-0.04em",
            weight: 700,
            sample: "Future in every idea.",
          },
          {
            role: "Heading 1",
            usage: "heading",
            sizePx: 30,
            lineHeightPx: 36,
            letterSpacing: "-0.04em",
            weight: 700,
            sample: "Little minds, big bots.",
          },
          {
            role: "Heading 2",
            usage: "heading",
            sizePx: 24,
            lineHeightPx: 32,
            letterSpacing: "-0.04em",
            weight: 700,
            sample: "Create something real.",
          },
          {
            role: "Heading 3",
            usage: "heading",
            sizePx: 20,
            lineHeightPx: 28,
            letterSpacing: "-0.04em",
            weight: 600,
            sample: "Start with curiosity.",
          },
          {
            role: "Lead",
            usage: "body",
            sizePx: 18,
            lineHeightPx: 28,
            weight: 400,
            sample: "Live learning with real instructors.",
          },
          {
            role: "Body large",
            usage: "body",
            sizePx: 16,
            lineHeightPx: 28,
            weight: 400,
            sample: "Plan, create, check, and explain.",
          },
          {
            role: "Body",
            usage: "body",
            sizePx: 16,
            lineHeightPx: 24,
            weight: 400,
            sample: "Every class leads to a project.",
          },
          {
            role: "UI",
            usage: "body",
            sizePx: 14,
            lineHeightPx: 24,
            weight: 500,
            sample: "Start the journey",
          },
          {
            role: "Detail",
            usage: "body",
            sizePx: 12,
            lineHeightPx: 20,
            weight: 500,
            sample: "LIVE INTERACTIVE CLASS",
          },
        ],
      },
      {
        id: "arabic",
        label: "Arabic",
        lang: "ar",
        direction: "rtl",
        heading: {
          typefaceId: "tajawal",
          role: "Arabic typeface",
          description:
            "Tajawal supports confident Arabic headlines and clear, readable learning content.",
          charset:
            "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي\n٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩",
          specimenGlyph: "ع",
          specimenWeightValues: [400, 500, 700],
        },
        body: { mode: "shared" },
        scale: [
          {
            role: "Display",
            usage: "heading",
            sizePx: 48,
            lineHeightPx: 48,
            weight: 700,
            sample: "المستقبل في كل فكرة.",
          },
          {
            role: "Heading 1",
            usage: "heading",
            sizePx: 30,
            lineHeightPx: 36,
            weight: 700,
            sample: "عقول صغيرة، أفكار كبيرة.",
          },
          {
            role: "Heading 2",
            usage: "heading",
            sizePx: 24,
            lineHeightPx: 32,
            weight: 700,
            sample: "اصنع شيئًا حقيقيًا.",
          },
          {
            role: "Heading 3",
            usage: "heading",
            sizePx: 20,
            lineHeightPx: 28,
            weight: 500,
            sample: "ابدأ بالفضول.",
          },
          {
            role: "Lead",
            usage: "body",
            sizePx: 18,
            lineHeightPx: 28,
            weight: 400,
            sample: "تعلّم مباشر مع مدربين حقيقيين.",
          },
          {
            role: "Body large",
            usage: "body",
            sizePx: 16,
            lineHeightPx: 28,
            weight: 400,
            sample: "خطّط، اصنع، راجع، واشرح.",
          },
          {
            role: "Body",
            usage: "body",
            sizePx: 16,
            lineHeightPx: 24,
            weight: 400,
            sample: "كل حصة تنتهي بمشروع.",
          },
          {
            role: "UI",
            usage: "body",
            sizePx: 14,
            lineHeightPx: 24,
            weight: 500,
            sample: "ابدأ الرحلة",
          },
          {
            role: "Detail",
            usage: "body",
            sizePx: 12,
            lineHeightPx: 20,
            weight: 500,
            sample: "حصة تفاعلية مباشرة",
          },
        ],
      },
    ],
  },
  motion: {
    heading: "Motion",
    description:
      "Motion should feel quick, playful, and purposeful. Eases keep every arrival and transition recognizably Brainbots.",
    labels: {
      demonstrations: "In motion",
      examples: "In real use",
      curves: "The curve",
    },
    eases: [
      {
        id: "enter",
        name: "Enter",
        description: "Scaling in, opening. Content arriving into view.",
        bezier: [0.16, 1, 0.3, 1],
        durationMs: 720,
        staggerMs: 80,
      },
      {
        id: "move",
        name: "Move",
        description:
          "Reordering, shuffling. The system responding to a gesture.",
        bezier: [0.7, 0, 0.16, 1],
        durationMs: 840,
        staggerMs: 25,
      },
    ],
    examples: [
      {
        id: "exchange",
        kind: "exchange",
        label: "Exchange",
        easeId: "move",
        imageAlts: ["Brainbots student portrait", "Brainbots student portrait"],
      },
      {
        id: "carousel",
        kind: "carousel",
        label: "Carousel",
        easeId: "move",
        imageAlts: [
          "Brainbots website creation artwork",
          "Brainbots image creation artwork",
          "Brainbots planning artwork",
        ],
      },
      {
        id: "toggle",
        kind: "toggle",
        label: "Toggle",
        easeId: "enter",
      },
      {
        id: "reveal",
        kind: "reveal",
        label: "Reveal",
        easeId: "enter",
      },
    ],
    curveNarrative: [
      "Brainbots motion is quick enough to feel responsive and soft enough to stay welcoming. Enter handles arrival; Move handles change.",
      "Use these curves consistently across components. Adjust duration and stagger before introducing another ease.",
    ],
  },
  voiceAndTone: {
    heading: "Voice and tone",
    description:
      "Speak clearly to parents . Celebrate possibility and show real experience and outcomes.",
    principles: [
      {
        example: "AI creation you can show.",
        label: "Make outcomes visible",
        explanation:
          "Name the websites, designs, apps, plans, and dashboards learners create.",
      },
      {
        example: "Live instructors. Real feedback.",
        label: "Be clear and trustworthy",
        explanation:
          "Use concrete proof and plain language instead of broad claims.",
      },
      {
        example: "Curiosity turns into something real.",
        label: "Playful, not childish",
        explanation:
          "Keep the energy bright and imaginative without talking down to young learners.",
      },
      {
        example: "Your child plans, creates, checks, and explains.",
        label: "Reassure with specifics",
        explanation:
          "Help parents understand the learning process and the confidence it builds.",
      },
    ],
    usageExamples: [
      {
        context: "Campaign line",
        do: "Where Curiosity Meets Technology.",
        dont: "Unleash limitless innovation today!",
      },
      {
        context: "Product specification",
        do: "Live interactive classes, not pre-recorded.",
        dont: "The world’s most revolutionary classes!",
      },
      {
        context: "Error message",
        do: "Something went wrong. Please try again.",
        dont: "Oopsie! The bot broke.",
      },
      {
        context: "Call to action",
        do: "Start the journey.",
        dont: "Click here now!!!",
      },
    ],
  },
  moodboard: {
    heading: "Moodboard",
    description:
      "Warm, candid learning moments alongside bold product imagery and graphic expressions.",
    imageAlts: [
      "Brainbots student portrait",
      "A Brainbots learner seated in a workshop",
      "Student participating in a Brainbots session",
      "Website creation learning category",
      "Image creation learning category",
      "Plan creation learning category",
      "Dashboard creation learning category",
      "Websites and web apps graphic",
      "Images and graphic designs graphic",
      "Dashboards and AI helpers graphic",
    ],
  },
  applications: {
    heading: "Applications",
    description:
      "The Brainbots identity supports public discovery, focused learning, and clear operational tools across every role.",
    titles: [
      "Track catalog",
      "Student dashboard",
      "Parent dashboard",
      "Instructor dashboard",
      "Admin classes",
    ],
  },
  assets: {
    heading: "Assets",
    description:
      "Download the local typefaces, implementation-ready color files, and approved imagery used in this guide.",
    fontStylesheetSrc: `${basePath}/fonts.css`,
    motionStylesheetSrc: `${basePath}/motion.css`,
    completePackSrc: `${basePath}/brainbots-brand-assets.zip`,
    imageryLabels: [
      // "Student portrait",
      // "Collaborative workshop",
      // "Student workshop portrait",
      // "Website creation",
      // "Image creation",
      // "Planning creation",
      // "Dashboard creation",
      // "Websites and web apps",
      // "Images and graphic designs",
      // "Dashboards and AI helpers",
    ],
    typefaces: [
      { label: "Sora variable", src: `${basePath}/fonts/Sora-Variable.ttf` },
      {
        label: "Tajawal Regular",
        src: `${basePath}/fonts/Tajawal-Regular.ttf`,
      },
      { label: "Tajawal Medium", src: `${basePath}/fonts/Tajawal-Medium.ttf` },
      { label: "Tajawal Bold", src: `${basePath}/fonts/Tajawal-Bold.ttf` },
      {
        label: "Tajawal ExtraBold",
        src: `${basePath}/fonts/Tajawal-ExtraBold.ttf`,
      },
    ],
    colorFiles: [
      { label: "CSS color variables", src: `${basePath}/colors.css` },
      { label: "Design tokens", src: `${basePath}/tokens.json` },
    ],
  },
});
