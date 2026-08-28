import { defineBrand } from "@/lib/brand/validation";

const basePath = "/brand/evexa" as const;

export const evexaBrand = defineBrand({
  slug: "evexa",
  name: "Evexa",
  guidelinesLabel: "Brand guidelines",
  summary:
    "An AI-focused digital solutions company building intelligent assistants, automation, and scalable digital platforms for businesses across MENA.",
  year: 2026,
  assetsBasePath: basePath,
  metadata: {
    title: "Evexa Brand Guidelines",
    description:
      "The Evexa identity, color, multilingual typography, motion, voice, imagery, applications, and downloadable brand assets.",
  },
  theme: {
    background: "#050505",
    foreground: "#EBEBEB",
    accent: "#0032D6",
    accentForeground: "#EBEBEB",
    surface: "#0E0E0E",
    muted: "#8F8F8F",
    border: "#333333",
  },
  introduction: {
    heroSrc: `${basePath}/imagery/evexa-preview.png`,
    heroAlt:
      "White Evexa wordmark and blue signal dot on a black textured field",
    statement: "AI-Powered Systems for Businesses in MENA.",
    facts: [
      { label: "Audience", value: "Growing businesses" },
      { label: "Region", value: "MENA" },
      { label: "Offices", value: "Alexandria · Riyadh" },
      { label: "Focus", value: "AI-powered systems" },
    ],
    heading:
      "We build digital products with AI adopted into the way we think, design, and ship.",
    lead: "Evexa is a MENA-focused digital solutions company with offices in Alexandria, Egypt, and Riyadh, Saudi Arabia. We bring branding, UX, web development, mobile apps, automation, and custom software into one product-minded team.",
    body: "Our edge is not forcing AI into every product. It is using AI carefully across research, strategy, content, prototyping, engineering, QA, and the product features where intelligence creates measurable value.",
  },
  logo: {
    heading: "A precise signature for intelligent systems.",
    description:
      "The Evexa identity pairs a directional signal mark with a geometric wordmark. Preserve the supplied artwork, proportions, and calculated clear space.",
    primary: {
      title: "Primary logo",
      description:
        "Use the complete logo as the default signature when horizontal space allows. Use black artwork on light fields and white artwork on dark fields.",
      src: `${basePath}/logos/logo-black.svg`,
      darkSrc: `${basePath}/logos/logo-white.svg`,
      alt: "Evexa primary logo",
      clearSpaceLabel: "1x = half the logo height",
    },
    mark: {
      title: "Logomark",
      description:
        "Use the signal mark in compact spaces, avatars, favicons, and product touchpoints where the Evexa name is already established.",
      src: `${basePath}/logos/logomark-black.svg`,
      darkSrc: `${basePath}/logos/logomark-white.svg`,
      alt: "Evexa logomark",
      clearSpaceLabel: "1x = half the logomark height",
    },
  },
  colors: {
    heading: "Color",
    description:
      "Deep black creates focus while Evexa Blue signals action. Cyan and azure add energy to intelligent products and data-rich interfaces.",
    proportionsNote: "Example UI distribution—not official",
    items: [
      {
        name: "Void Black",
        hex: "#050505",
        foreground: "light",
        proportion: 44,
        mosaic: { columnStart: 1, columnSpan: 3, rowStart: 1, rowSpan: 1 },
      },
      {
        name: "Signal White",
        hex: "#EBEBEB",
        foreground: "dark",
        proportion: 30,
        mosaic: { columnStart: 4, columnSpan: 3, rowStart: 1, rowSpan: 1 },
      },
      {
        name: "Evexa Blue",
        hex: "#0032D6",
        foreground: "light",
        proportion: 14,
        mosaic: { columnStart: 3, columnSpan: 4, rowStart: 2, rowSpan: 1 },
      },
      {
        name: "Electric Cyan",
        hex: "#00BBE0",
        foreground: "dark",
        proportion: 5,
        mosaic: { columnStart: 1, columnSpan: 2, rowStart: 2, rowSpan: 2 },
      },
      {
        name: "System Azure",
        mosaicLabel: "Azure",
        hex: "#1FA5FF",
        foreground: "dark",
        proportion: 3,
        mosaic: { columnStart: 3, columnSpan: 1, rowStart: 3, rowSpan: 1 },
      },
      {
        name: "Graphite",
        hex: "#474747",
        foreground: "light",
        proportion: 2,
        mosaic: { columnStart: 4, columnSpan: 1, rowStart: 3, rowSpan: 1 },
      },
      {
        name: "Interface Gray",
        mosaicLabel: "Gray",
        hex: "#8F8F8F",
        foreground: "dark",
        proportion: 1,
        mosaic: { columnStart: 5, columnSpan: 1, rowStart: 3, rowSpan: 1 },
      },
      {
        name: "Alert Red",
        mosaicLabel: "Red",
        hex: "#FF000D",
        foreground: "dark",
        proportion: 1,
        mosaic: { columnStart: 6, columnSpan: 1, rowStart: 3, rowSpan: 1 },
      },
    ],
  },
  typography: {
    heading: "Typography",
    description:
      "Mayeka gives English headlines a technical signature, DM Sans keeps body content clear, and PNU Arabic carries the same system across Arabic communication.",
    defaultSystemId: "english",
    typefaces: [
      {
        id: "mayeka",
        displayName: "Mayeka",
        cssFamily: '"Mayeka", sans-serif',
        source: "Local Evexa font",
        styleCount: "5 styles",
        weights: [
          { name: "Thin", value: 200 },
          { name: "Light", value: 300 },
          { name: "Regular", value: 400 },
          { name: "Semibold", value: 600 },
          { name: "Bold", value: 700 },
        ],
      },
      {
        id: "dm-sans",
        displayName: "DM Sans",
        cssFamily: '"DM Sans", sans-serif',
        source: "Google Fonts",
        styleCount: "Variable 100–1000",
        weights: [
          { name: "Thin", value: 100 },
          { name: "Light", value: 300 },
          { name: "Regular", value: 400 },
          { name: "Medium", value: 500 },
          { name: "Semibold", value: 600 },
          { name: "Bold", value: 700 },
          { name: "Black", value: 900 },
        ],
      },
      {
        id: "pnu-arabic",
        displayName: "PNU Arabic",
        nativeName: "بي إن يو العربية",
        cssFamily: '"PNU Arabic", sans-serif',
        source: "Local Evexa font",
        styleCount: "4 styles",
        weights: [
          { name: "Light", value: 300 },
          { name: "Regular", value: 400 },
          { name: "Medium", value: 500 },
          { name: "Bold", value: 700 },
        ],
      },
    ],
    systems: [
      {
        id: "english",
        label: "English",
        lang: "en",
        direction: "ltr",
        heading: {
          typefaceId: "mayeka",
          role: "Display and heading typeface",
          description:
            "A geometric display face for direct, technical headlines and high-signal brand moments.",
          charset:
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 &?!@#%",
          specimenGlyph: "a",
          specimenWeightValues: [300, 400, 600],
        },
        body: {
          mode: "separate",
          typefaceId: "dm-sans",
          role: "Body and interface typeface",
          description:
            "DM Sans keeps detailed product language, interfaces, and longer explanations calm and readable.",
          sample:
            "Intelligent systems should feel clear enough to use every day.",
          specimenWeightValues: [400, 500, 600],
        },
        scale: [
          {
            role: "Display",
            usage: "heading",
            sizePx: 48,
            lineHeightPx: 48,
            weight: 600,
            sample: "Intelligence with a job to do",
          },
          {
            role: "Heading 1",
            usage: "heading",
            sizePx: 40,
            lineHeightPx: 40,
            weight: 600,
            sample: "AI-powered systems for MENA",
          },
          {
            role: "Heading 2",
            usage: "heading",
            sizePx: 30,
            lineHeightPx: 36,
            weight: 600,
            sample: "Clear products, Scalable foundations",
          },
          {
            role: "Heading 3",
            usage: "heading",
            sizePx: 24,
            lineHeightPx: 32,
            weight: 600,
            sample: "Build for real operations",
          },
          {
            role: "Lead",
            usage: "body",
            sizePx: 20,
            lineHeightPx: 28,
            weight: 600,
            sample: "AI-assisted, human-led execution",
          },
          {
            role: "Body large",
            usage: "body",
            sizePx: 18,
            lineHeightPx: 28,
            weight: 600,
            sample:
              "Turn complex workflows into systems teams can use every day.",
          },
          {
            role: "Body",
            usage: "body",
            sizePx: 16,
            lineHeightPx: 28,
            weight: 500,
            sample:
              "Strategy, design, engineering, and practical AI adoption work as one product system.",
          },
          {
            role: "UI",
            usage: "body",
            sizePx: 16,
            lineHeightPx: 24,
            weight: 500,
            sample: "Request Free Consultation",
          },
          {
            role: "Detail",
            usage: "body",
            sizePx: 12,
            lineHeightPx: 14,
            weight: 500,
            sample: "We usually respond within one business day.",
          },
        ],
      },
      {
        id: "arabic",
        label: "العربية",
        lang: "ar",
        direction: "rtl",
        heading: {
          typefaceId: "pnu-arabic",
          role: "خط العناوين والنصوص العربية",
          description:
            "يحافظ خط PNU Arabic على الوضوح والثقة في العناوين والنصوص وواجهات المنتجات العربية.",
          charset:
            "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي ء أ إ آ ؤ ئ ة\n٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩",
          specimenGlyph: "ع",
          specimenWeightValues: [300, 500, 700],
        },
        body: { mode: "shared" },
        scale: [
          {
            role: "Display",
            usage: "heading",
            sizePx: 48,
            lineHeightPx: 57.6,
            weight: 700,
            sample: "أنظمة ذكية لأعمال أوضح.",
          },
          {
            role: "Heading 1",
            usage: "heading",
            sizePx: 40,
            lineHeightPx: 48,
            weight: 700,
            sample: "الذكاء الاصطناعي له وظيفة واضحة.",
          },
          {
            role: "Heading 2",
            usage: "heading",
            sizePx: 30,
            lineHeightPx: 43.2,
            weight: 700,
            sample: "نبني منتجات رقمية قابلة للتوسع.",
          },
          {
            role: "Heading 3",
            usage: "heading",
            sizePx: 24,
            lineHeightPx: 38.4,
            weight: 700,
            sample: "جودة يقودها الإنسان.",
          },
          {
            role: "Lead",
            usage: "body",
            sizePx: 20,
            lineHeightPx: 28,
            weight: 500,
            sample: "حلول عملية مصممة للشركات في المنطقة.",
          },
          {
            role: "Body large",
            usage: "body",
            sizePx: 18,
            lineHeightPx: 28,
            weight: 500,
            sample: "نحوّل سير العمل المعقد إلى أنظمة يستخدمها فريقك كل يوم.",
          },
          {
            role: "Body",
            usage: "body",
            sizePx: 16,
            lineHeightPx: 28,
            weight: 500,
            sample:
              "نربط الاستراتيجية والتصميم والهندسة بالذكاء الاصطناعي حيث يضيف قيمة حقيقية.",
          },
          {
            role: "UI",
            usage: "body",
            sizePx: 16,
            lineHeightPx: 24,
            weight: 500,
            sample: "اطلب استشارة مجانية",
          },
          {
            role: "Detail",
            usage: "body",
            sizePx: 12,
            lineHeightPx: 14,
            weight: 500,
            sample: "نرد عادة خلال يوم عمل واحد.",
          },
        ],
      },
    ],
  },
  motion: {
    heading: "Motion",
    description:
      "Evexa motion is deliberate, technical, and responsive. It clarifies arrival, state, and spatial change without becoming decorative.",
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
        bezier: [0.18, 0.9, 0.24, 1],
        durationMs: 640,
        staggerMs: 70,
      },
      {
        id: "move",
        name: "Move",
        description:
          "Reordering, shuffling. The system responding to a gesture.",
        bezier: [0.76, 0, 0.24, 1],
        durationMs: 840,
        staggerMs: 22,
      },
    ],
    examples: [
      {
        id: "exchange",
        kind: "exchange",
        label: "Exchange",
        easeId: "move",
        images: [
          {
            src: `${basePath}/moodboard/ai-circuit-eye.png`,
            alt: "Blue artificial intelligence circuit artwork",
          },
          {
            src: `${basePath}/moodboard/ai-systems.png`,
            alt: "Evexa artificial intelligence systems artwork",
          },
        ],
      },
      {
        id: "carousel",
        kind: "carousel",
        label: "Carousel",
        easeId: "move",
        images: [
          {
            src: `${basePath}/moodboard/ai-01.jpg`,
            alt: "Artificial intelligence technology study",
          },
          {
            src: `${basePath}/moodboard/ai-02.jpg`,
            alt: "Artificial intelligence systems study",
          },
          {
            src: `${basePath}/moodboard/architecture-03.png`,
            alt: "Contemporary architecture in the MENA region",
          },
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
        images: [
          {
            src: `${basePath}/imagery/evexa-preview.png`,
            alt: "Evexa identity preview",
          },
          {
            src: `${basePath}/moodboard/why-ai-now.png`,
            alt: "Numeric eye artwork about artificial intelligence",
          },
          {
            src: `${basePath}/moodboard/alexandria-01.png`,
            alt: "Alexandria architectural study",
          },
          {
            src: `${basePath}/moodboard/architecture-02.png`,
            alt: "Regional architecture study",
          },
        ],
      },
    ],
    curveNarrative: [
      "Enter is a fast, assured arrival that settles cleanly. Use it for opening, revealing, loading, and introducing new information.",
      "Move creates deliberate, symmetrical travel that preserves spatial continuity. Use it for reordering, carousel movement, and state transitions.",
    ],
  },
  voiceAndTone: {
    heading: "Voice and tone",
    description:
      "Evexa explains intelligent systems through clear business value, accountable delivery, and specific operational outcomes.",
    principles: [
      {
        example: "AI with a job to do.",
        label: "Purposeful",
        explanation:
          "Name the process, decision, or outcome AI improves instead of treating intelligence as the outcome itself.",
      },
      {
        example: "AI-assisted, human-led.",
        label: "Accountable",
        explanation:
          "Make human oversight, product judgment, security, and ownership visible in how the work is described.",
      },
      {
        example: "From complex workflows to systems teams use every day.",
        label: "Operational",
        explanation:
          "Describe real workflows and daily use rather than relying on abstract promises or broad transformation claims.",
      },
      {
        example: "Built for MENA. Ready to scale.",
        label: "Regional",
        explanation:
          "Reflect bilingual and regional context while avoiding unsupported claims about universal or global leadership.",
      },
    ],
    usageExamples: [
      {
        context: "Campaign line",
        do: "AI-Powered Systems for Businesses in MENA.",
        dont: "Revolutionize everything with limitless AI.",
      },
      {
        context: "Product specification",
        do: "Custom AI assistants for support, sales, onboarding, and internal teams.",
        dont: "The world’s smartest chatbot for every business.",
      },
      {
        context: "Error message",
        do: "Something went wrong. Please try again or contact us directly.",
        dont: "Oops! The AI failed.",
      },
      {
        context: "Call to action",
        do: "Request Free Consultation.",
        dont: "Unlock the future now!!!",
      },
    ],
  },
  moodboard: {
    heading: "Moodboard",
    description:
      "Dark technical environments, electric signals, intelligent systems, and regional architecture create a focused visual world for Evexa.",
    images: [
      {
        src: `${basePath}/imagery/evexa-preview.png`,
        alt: "Evexa wordmark and blue signal dot on a dark textured field",
        width: 1920,
        height: 1080,
      },
      {
        src: `${basePath}/moodboard/why-ai-now.png`,
        alt: "Monochrome eye formed from numbers and symbols",
        width: 979,
        height: 976,
      },
      {
        src: `${basePath}/moodboard/ai-circuit-eye.png`,
        alt: "Blue artificial intelligence circuit eye",
        width: 992,
        height: 992,
      },
      {
        src: `${basePath}/moodboard/ai-systems.png`,
        alt: "Blue artificial intelligence systems artwork",
        width: 1200,
        height: 1200,
      },
      {
        src: `${basePath}/moodboard/ai-01.jpg`,
        alt: "Artificial intelligence technology study",
        width: 2000,
        height: 1333,
      },
      {
        src: `${basePath}/moodboard/ai-02.jpg`,
        alt: "Artificial intelligence systems study",
        width: 2000,
        height: 1333,
      },
      {
        src: `${basePath}/moodboard/alexandria-01.png`,
        alt: "Alexandria architectural study",
        width: 1878,
        height: 1878,
      },
      {
        src: `${basePath}/moodboard/architecture-02.png`,
        alt: "Regional architecture study",
        width: 1333,
        height: 1333,
      },
      {
        src: `${basePath}/moodboard/architecture-03.png`,
        alt: "Contemporary architecture in the MENA region",
        width: 1921,
        height: 2048,
      },
    ],
  },
  applications: {
    heading: "Applications",
    description:
      "The Evexa identity scales from company positioning and thought leadership to service education and focused consultation journeys.",
    items: [
      {
        title: "Homepage",
        src: `${basePath}/applications/homepage.png`,
      },
      {
        title: "About",
        src: `${basePath}/applications/about.png`,
      },
      {
        title: "AI Assistants",
        src: `${basePath}/applications/ai-assistants.png`,
      },
      {
        title: "Blog",
        src: `${basePath}/applications/blog.png`,
      },
      {
        title: "Free AI Consultation",
        src: `${basePath}/applications/free-ai-consultation.png`,
      },
    ],
  },
  assets: {
    heading: "Assets",
    description:
      "Download the Evexa signatures, multilingual typefaces, implementation tokens, motion values, and approved imagery used throughout this guide.",
    fontStylesheetSrc: `${basePath}/fonts.css`,
    motionStylesheetSrc: `${basePath}/motion.css`,
    completePackSrc: `${basePath}/evexa-brand-assets.zip`,
    logoFiles: [
      { name: "Full logo", src: `${basePath}/logos/logo-black.svg` },
      // { name: "Primary logo — white", src: `${basePath}/logos/logo-white.svg` },
      {
        name: "Logomark",
        src: `${basePath}/logos/logomark-black.svg`,
      },
      // {
      //   name: "Logomark — white",
      //   src: `${basePath}/logos/logomark-white.svg`,
      // },
      {
        name: "Wordmark",
        src: `${basePath}/logos/logotext-black.svg`,
      },
      // {
      //   name: "Wordmark — white",
      //   src: `${basePath}/logos/logotext-white.svg`,
      // },
    ],
    typefaces: [
      { label: "Mayeka Thin", src: `${basePath}/fonts/MayekaThin.otf` },
      { label: "Mayeka Light", src: `${basePath}/fonts/MayekaLight.otf` },
      { label: "Mayeka Regular", src: `${basePath}/fonts/MayekaRegular.otf` },
      {
        label: "Mayeka Semibold",
        src: `${basePath}/fonts/MayekaSemiBold.otf`,
      },
      { label: "Mayeka Bold", src: `${basePath}/fonts/MayekaBold.otf` },
      {
        label: "DM Sans variable",
        src: `${basePath}/fonts/DMSans-Variable.ttf`,
      },
      { label: "PNU Arabic Light", src: `${basePath}/fonts/PNU-Light.ttf` },
      {
        label: "PNU Arabic Regular",
        src: `${basePath}/fonts/PNU-Regular.ttf`,
      },
      { label: "PNU Arabic Medium", src: `${basePath}/fonts/PNU-Medium.ttf` },
      { label: "PNU Arabic Bold", src: `${basePath}/fonts/PNU-Bold.ttf` },
      // {
      //   label: "DM Sans OFL license",
      //   src: `${basePath}/fonts/OFL-DMSans.txt`,
      // },
      // {
      //   label: "Font provenance and rights",
      //   src: `${basePath}/fonts/font-provenance.md`,
      // },
    ],
    colorFiles: [
      { label: "CSS color variables", src: `${basePath}/colors.css` },
      { label: "Design tokens", src: `${basePath}/tokens.json` },
    ],
    imagery: [
      {
        label: "Evexa identity preview",
        src: `${basePath}/imagery/evexa-preview.png`,
      },
      {
        label: "Why AI Now",
        src: `${basePath}/moodboard/why-ai-now.png`,
      },
      {
        label: "AI circuit eye",
        src: `${basePath}/moodboard/ai-circuit-eye.png`,
      },
      {
        label: "AI systems artwork",
        src: `${basePath}/moodboard/ai-systems.png`,
      },
      { label: "AI study 01", src: `${basePath}/moodboard/ai-01.jpg` },
      { label: "AI study 02", src: `${basePath}/moodboard/ai-02.jpg` },
      {
        label: "Alexandria architecture",
        src: `${basePath}/moodboard/alexandria-01.png`,
      },
      {
        label: "Regional architecture",
        src: `${basePath}/moodboard/architecture-02.png`,
      },
      {
        label: "Contemporary MENA architecture",
        src: `${basePath}/moodboard/architecture-03.png`,
      },
    ],
  },
});
