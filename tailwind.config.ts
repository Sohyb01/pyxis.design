import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "string"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: "var(--font-sans)",
      mono: "var(--font-mono)",
      serif: "var(--font-serif)",
      mayeka: "var(--font-mayeka)",
    },
    fontSize: {
      xl: [
        "1.25rem",
        {
          lineHeight: "1.75rem",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
      "2xl": [
        "1.5rem",
        {
          lineHeight: "2rem",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
      "3xl": [
        "1.875rem",
        {
          lineHeight: "2.25rem",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
      "4xl": [
        "2.25rem",
        {
          lineHeight: "2.5rem",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
      "5xl": [
        "3rem",
        {
          lineHeight: "1",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
      "6xl": [
        "3.75rem",
        {
          lineHeight: "1",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
      "7xl": [
        "4.5rem",
        {
          lineHeight: "1",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
      "8xl": [
        "6rem",
        {
          lineHeight: "1",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
      "9xl": [
        "8rem",
        {
          lineHeight: "1",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
      h1: [
        "48px",
        {
          lineHeight: "48px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
      h2: [
        "40px",
        {
          lineHeight: "40px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
      h3: [
        "30px",
        {
          lineHeight: "36px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
      h4: [
        "24px",
        {
          lineHeight: "32px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
      h5: [
        "20px",
        {
          lineHeight: "28px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
      large: [
        "18px",
        {
          lineHeight: "28px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
      lead: [
        "20px",
        {
          lineHeight: "28px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
      p: [
        "16px",
        {
          lineHeight: "28px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "400",
        },
      ],
      p_ui: [
        "16px",
        {
          lineHeight: "24px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "400",
        },
      ],
      p_ui_medium: [
        "16px",
        {
          lineHeight: "24px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "500",
        },
      ],
      list: [
        "16px",
        {
          lineHeight: "24px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "400",
        },
      ],
      body: [
        "14px",
        {
          lineHeight: "24px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "400",
        },
      ],
      body_medium: [
        "14px",
        {
          lineHeight: "24px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "500",
        },
      ],
      subtle: [
        "14px",
        {
          lineHeight: "20px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "400",
        },
      ],
      subtle_medium: [
        "14px",
        {
          lineHeight: "20px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "500",
        },
      ],
      subtle_semibold: [
        "14px",
        {
          lineHeight: "20px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
      small: [
        "14px",
        {
          lineHeight: "14px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "400",
        },
      ],
      detail: [
        "12px",
        {
          lineHeight: "20px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "400",
        },
      ],
      badge: [
        "12px",
        {
          lineHeight: "16px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "400",
        },
      ],
      blockquote: [
        "16px",
        {
          lineHeight: "24px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "400",
        },
      ],
      table_head: [
        "16px",
        {
          lineHeight: "24px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "700",
        },
      ],
      table_item: [
        "16px",
        {
          lineHeight: "24px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "400",
        },
      ],
      kb_shortcut: [
        "12px",
        {
          lineHeight: "20px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "400",
        },
      ],
      card_title: [
        "24px",
        {
          lineHeight: "24px",
          letterSpacing: "var(--tracking-normal)",
          fontWeight: "600",
        },
      ],
    },
    letterSpacing: {
      normal: "var(--tracking-normal)",
    },
    container: {
      center: true,
      padding: "8px",
      screens: {
        lg: "1280px",
      },
    },
    screens: {
      sm: "360px",
      md: "744px",
      lg: "1280px",
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        "color-1": "var(--color-1)",
        "color-2": "var(--color-2)",
        "color-3": "var(--color-3)",
        "color-4": "var(--color-4)",
        "color-5": "var(--color-5)",
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 12px)",
        "4xl": "calc(var(--radius) + 16px)",
      },
      boxShadow: {
        "2xs": "var(--shadow-2xs)",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
      },
      keyframes: {
        rainbow: {
          "0%": { backgroundPosition: "0%" },
          "100%": { backgroundPosition: "200%" },
        },
        gradient: {
          to: { backgroundPosition: "var(--bg-size, 300%) 0" },
        },
        marquee_ar: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(50%)" },
        },
        marquee_en: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        rainbow: "rainbow var(--speed, 2s) infinite linear",
        gradient: "gradient 8s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee_ar: "marquee_ar 30s linear infinite",
        marquee_en: "marquee_en 30s linear infinite",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
};
export default config;
