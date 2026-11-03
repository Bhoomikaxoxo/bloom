/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                serif: ['Newsreader', 'Georgia', 'serif'],
                display: ['Newsreader', 'Georgia', 'serif'],
                mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
            },
            colors: {
                bloom: {
                    50: '#FDF8F5',
                    100: '#F9EFE9',
                    200: '#F2DDD1',
                    300: '#E5C2AE',
                    400: '#D29672',
                    500: '#C2531C', // Signature Terracotta Accent
                    600: '#A63E0F',
                    700: '#872E0A',
                    800: '#662409',
                    900: '#421805',
                },
                energy: {
                    focus: '#244A38',    // Deep Forest (High Cognitive Work)
                    urgent: '#A63E0F',   // Terracotta (Active Attention)
                    routine: '#7D5E29',  // Ochre Sand (Low-energy Admin)
                    calm: '#58446B',     // Heather Plum (Reflection & Sanctuary)
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-in-out',
                'slide-in': 'slideIn 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateY(-6px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
