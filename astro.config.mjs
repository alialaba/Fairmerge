// @ts-check
import { defineConfig } from 'astro/config';

// Pages that exist only on the dev server (never in the production build).
// /hero-image is the composition that `npm run export:hero` screenshots.
const devOnlyPages = {
  name: 'dev-only-pages',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command === 'dev') {
        injectRoute({ pattern: '/hero-image', entrypoint: './src/dev/hero-image.astro' });
      }
    },
  },
};

// https://astro.build/config
export default defineConfig({
  integrations: [devOnlyPages],
});
