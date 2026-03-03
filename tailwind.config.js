/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#1a1a1a",
            },
            animation: {
                // Slow, continuous flow
                flow: "flow 15s ease-in-out infinite",
                flowReverse: "flowReverse 20s ease-in-out infinite",
            },
            keyframes: {
                flow: {
                    "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
                    "50%": { transform: "translate(50px, -50px) scale(1.1)" },
                },
                flowReverse: {
                    "0%, 100%": { transform: "translate(0px, 0px)" },
                    "50%": { transform: "translate(-50px, 50px)" },
                }
            },
        },
    },
    plugins: [],
}
