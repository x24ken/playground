import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'node:path';

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
  "framework": "@storybook/react-vite",
  // composition は Storybook UI/MCP 上での統合。実コードで design-system を
  // 再利用するため、MCP が示す import 名 "design-system" を実ソースへ解決する。
  "viteFinal": async (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "design-system": resolve(process.cwd(), "../design-system/src/index.ts"),
    };
    return config;
  },
};
export default config;