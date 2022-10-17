// -i- Based on: https://github.com/axeldelafosse/expo-next-monorepo-example/blob/main/packages/next/next.config.js
const { withExpo } = require('@expo/next-adapter')
const withFonts = require('next-fonts')
const withImages = require('next-images')

/* --- Transpiled Modules ---------------------------------------------------------------------- */

const transpiledModules = require('config/transpiledModules')
const withTM = require('next-transpile-modules')(transpiledModules)

/* --- Automation Scripts ---------------------------------------------------------------------- */
// -i- This will run the aetherspace automation scripts on local dev builds (comment out what you don't need)
const withAutomation = () => {
    // -i- Clear out autogenerated docs folder so it can be rebuilt
    require('aetherspace/scripts/documentation-reset')
    // -i- Build 'packages/@registries/resolvers.generated.ts':
    // -i- Turns all REST api paths built with aetherResolver into GraphQL resolvers as well
    require('aetherspace/scripts/collect-resolvers')
    // -i- Build 'packages/@registries/assets.generated.ts':
    // -i- Makes regular img src paths like on the web work for AetherImage in Expo
    require('aetherspace/scripts/collect-assets')
    // -i- Autogenerate documentation for all components hooking into the automation script
    // -i- Enable by exporting a 'getDocumentationProps' object or function from a component
    require('aetherspace/scripts/document-components')
}

/* --- PWA Config ------------------------------------------------------------------------------ */

const withPWA = require('next-pwa')({
    // https://github.com/shadowwalker/next-pwa#available-options
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    // -i- Enable these to make the app a full PWA with service worker
    // register: true,
    // scope: '/app',
    // sw: 'service-worker.js',
})

/* --- Build Next Config ----------------------------------------------------------------------- */

const projectRoot = __dirname
const workspaceRoot = `${projectRoot}/../..`

// -i- Next specific config, e.g. https://nextjs.org/docs/api-reference/next.config.js/introduction
/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    webpack: (config, { isServer }) => {
        // -i- Run aetherspace automation scripts
        if (!isServer && process.env.NODE_ENV === 'development') withAutomation()
        // Enable top level await in API handlers
        config.experiments.topLevelAwait = true
        // Silence warnings about "unexpected" resolutions (file-loader)
        config.infrastructureLogging = { level: "error" }
        // Return config
        return config
    },
}

// Apply plugins to next config, avoiding next-compose-plugins:
// -i- https://github.com/cyrilwanner/next-compose-plugins/issues/59#issuecomment-1209152211
// -i- https://github.com/cyrilwanner/next-compose-plugins/issues/59#issuecomment-1220739666
const plugins = [withTM, withFonts, withImages, withPWA, [withExpo, { projectRoot: workspaceRoot }]]
const withPlugins = (_phase /*, { defaultConfig } */) => {
    // Build final config
    const finalConfig = plugins.reduce(
        (acc, plugin) => {
            // Handle plugins with options
            if (Array.isArray(plugin)) return { ...acc, ...plugin[0](acc, plugin[1]) }
            // Handle plugins without options
            return { ...acc, ...plugin(acc) }
        },
        { ...nextConfig }
    )
    // Return final config
    return finalConfig;
}

/* --- Exports --------------------------------------------------------------------------------- */

module.exports = withPlugins
