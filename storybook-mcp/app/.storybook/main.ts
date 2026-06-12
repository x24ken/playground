import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  // composition: デザインシステム用Storybook(別ポート)を refs で取り込む
  "refs": {
    "design-system": {
      "title": "Design System",
      "url": "http://localhost:6007",
    },
  },
  "framework": "@storybook/react-vite"
};
export default config;