/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "var(--color-success)",
          foreground: "var(--color-success-foreground)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          foreground: "var(--color-warning-foreground)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          foreground: "var(--color-error-foreground)",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        "login-background": "hsl(20 14% 4%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Geist Sans", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
      fontSize: {
        xs: [
          "0.75rem",
          {
            lineHeight: "1rem",
          },
        ],
        sm: [
          "0.875rem",
          {
            lineHeight: "1.25rem",
          },
        ],
        base: [
          "1rem",
          {
            lineHeight: "1.5rem",
          },
        ],
        lg: [
          "1.125rem",
          {
            lineHeight: "1.75rem",
          },
        ],
        xl: [
          "1.25rem",
          {
            lineHeight: "1.75rem",
          },
        ],
        "2xl": [
          "1.5rem",
          {
            lineHeight: "2rem",
          },
        ],
        "3xl": [
          "1.875rem",
          {
            lineHeight: "2.25rem",
          },
        ],
        "4xl": [
          "2.25rem",
          {
            lineHeight: "2.5rem",
          },
        ],
        "5xl": [
          "3rem",
          {
            lineHeight: "1",
          },
        ],
        "6xl": [
          "3.75rem",
          {
            lineHeight: "1",
          },
        ],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
      },
      animation: {
        "fade-in": "fadeIn 250ms ease-out",
        "fade-out": "fadeOut 250ms ease-out",
        "slide-in": "slideIn 250ms ease-out",
        "slide-down": "slideDown 250ms ease-out",
        "menu-down": "menuDown 200ms ease-out",
        "slide-up": "slideUp 400ms ease-out",
        "scale-in": "scaleIn 150ms ease-out",
        "bounce-subtle": "bounceSubtle 400ms ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        fadeOut: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
        slideIn: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        slideDown: {
          "0%": {
            transform: "translateY(-100%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        menuDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-0.5rem)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideUp: {
          "0%": {
            transform: "translateY(100%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        scaleIn: {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        bounceSubtle: {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.02)",
          },
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      zIndex: {
        1000: "1000",
        1050: "1050",
        1100: "1100",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")],
};
