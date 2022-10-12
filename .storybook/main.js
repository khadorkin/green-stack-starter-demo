const path = require('path')
const { withUnimodules } = require('@expo/webpack-config/addons')

module.exports = {
    stories: [
        '../README.stories.mdx',
        '../apps/**/*.stories.mdx', 
        '../apps/**/*.stories.@(js|jsx|ts|tsx)',
        '../features/**/*.stories.mdx', 
        '../features/**/*.stories.@(js|jsx|ts|tsx)',
        '../packages/**/*.stories.mdx', 
        '../packages/**/*.stories.@(js|jsx|ts|tsx)',
        './LICENSE.stories.mdx',
    ],
    addons: [
      { name: '@storybook/addon-essentials', options: { transcludeMarkdown: true } },
      { name: '@storybook/addon-docs', options: { transcludeMarkdown: true } },
      '@a110/storybook-expand-all',
      'aetherspace/docs/addons',
    ],
    webpackFinal: (config) => {
        // Add TS & react-native-web support
        config.module.rules.push({
          test: /\.tsx?$/,
          use: [
            {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-typescript', '@babel/preset-react'],
                },
            },
          ],
        })
        // Aliases
        config.resolve.alias['react-native$'] = require.resolve('react-native-web')
        config.resolve.extensions.push('.ts', '.tsx')
        // Compatibility
        config.optimization = {
          ...config.optimization,
          sideEffects: false,
        }
        // Export updated webpack config
        return withUnimodules(config, {
          projectRoot: path.resolve(__dirname, '../'),
        })
    },
    core: {
        builder: 'webpack5',
    },
    features: {
      previewMdx2: true, // 👈 MDX 2 enabled here (https://storybook.js.org/docs/react/writing-docs/mdx#mdx-2)
    },
    framework: '@storybook/react',
}
