import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcss100vhFix from 'postcss-100vh-fix';

export default {
  plugins: [
    tailwindcss,
    postcss100vhFix,
    autoprefixer,
  ],
};
