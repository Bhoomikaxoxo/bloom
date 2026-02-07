/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'glass': {
                    light: 'rgba(255, 255, 255, 0.1)',
                    dark: 'rgba(0, 0, 0, 0.2)'
                },
                border: "hsl(var(--border))",
                // Custom Theme Colors
                cream: {
                    50: '#fffcf5',
                    100: '#fff9e6',
                    200: '#fef2d0',
                    300: '#fde6aa',
                    400: '#fcd580', // Warm beige/skin tone
                    500: '#fbc25e',
                    600: '#f5a438',
                    700: '#cc7d24',
                    800: '#a36224',
                    900: '#855123',
                    950: '#482810',
                },
                cottage: {
                    50: '#f2fcf5',  // Very light sage
                    100: '#e3f9e9',
                    200: '#c2f2cf',
                    300: '#90e5aa',
                    400: '#4ade80',
                    500: '#22c55e', // Standard green base
                    600: '#16a34a', // Forest
                    700: '#15803d', // Deep Moss
                    800: '#166534',
                    900: '#14532d', // Dark Pine
                    950: '#052e16',
                },
                // Aliases for seamless replacement
                indigo: {
                    50: '#f2fcf5', // cottage-50
                    100: '#e3f9e9',
                    200: '#c2f2cf',
                    300: '#90e5aa',
                    400: '#4ade80',
                    500: '#16a34a', // cottage-600 (Primary branding - slightly darker for contrast)
                    600: '#15803d',
                    700: '#166534',
                    800: '#14532d',
                    900: '#052e16',
                    950: '#022c22',
                },
                slate: {
                    50: '#fafaf9', // stone-50
                    100: '#f5f5f4', // stone-100
                    200: '#e7e5e4',
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    500: '#78716c',
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',
                    900: '#1c1917',
                    950: '#0c0a09',
                }
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-in': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
