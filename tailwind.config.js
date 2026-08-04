import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                "primary": "#000000",
                "on-primary": "#ffffff",
                "background": "#f9f9f9",
                "surface": "#f9f9f9",
                "surface-bright": "#f9f9f9",
                "surface-container-lowest": "#ffffff",
                "surface-container-low": "#f3f3f4",
                "surface-container": "#eeeeee",
                "surface-container-high": "#e8e8e8",
                "surface-container-highest": "#e2e2e2",
                "on-surface": "#1a1c1c",
                "on-surface-variant": "#444748",
                "outline": "#747878",
                "outline-variant": "#c4c7c7",
                "secondary-container": "#dce2f3",
                "secondary": "#585f6c",
                "on-secondary": "#ffffff",
                "error": "#ba1a1a",
                "error-container": "#ffdad6",
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                serif: ['EB Garamond', ...defaultTheme.fontFamily.serif],
                'display-lg': ['Inter', 'sans-serif'],
                'headline-lg': ['Inter', 'sans-serif'],
                'headline-md': ['Inter', 'sans-serif'],
                'body-md': ['Inter', 'sans-serif'],
                'body-lg': ['Inter', 'sans-serif'],
                'label-sm': ['Inter', 'sans-serif'],
            },
        },
    },

    plugins: [forms],
};
