/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                black: 'rgb(var(--color-black) / <alpha-value>)',
                white: 'rgb(var(--color-white) / <alpha-value>)',
                background: 'rgb(var(--color-background) / <alpha-value>)',
                surface: 'rgb(var(--color-surface) / <alpha-value>)',
                primary: 'rgb(var(--color-primary) / <alpha-value>)',
                secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
                accent1: 'rgb(var(--color-accent1) / <alpha-value>)',
                accent2: 'rgb(var(--color-accent2) / <alpha-value>)',
                gold: {
                    light: '#d4c3b0',
                    DEFAULT: '#c2a07a',
                    dark: '#8b7355',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
                ethnocentric: ['ethnocentric', 'sans-serif'],
                serif: ['"Playfair Display"', 'Georgia', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out forwards',
                'typing': 'typing 2s steps(40, end)',
                'blink': 'blink .75s step-end infinite',
                'spin-slow': 'spin 12s linear infinite',
                'gradient': 'gradient 6s ease infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0, transform: 'translateY(15px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                typing: {
                    from: { width: '0' },
                    to: { width: '100%' },
                },
                blink: {
                    'from, to': { borderColor: 'transparent' },
                    '50%': { borderColor: '#c2a07a' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                }
            }
        },
    },
    plugins: [],
}
