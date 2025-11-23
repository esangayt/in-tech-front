/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  important: true, // Esto ayuda a que Tailwind tenga prioridad sobre otros estilos

  // Quitar la configuración de corePlugins para que Tailwind funcione completamente
  // corePlugins: {
  //   preflight: false,
  // }
}
