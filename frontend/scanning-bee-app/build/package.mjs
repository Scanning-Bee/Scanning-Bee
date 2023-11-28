#!/usr/bin/env zx

const packageJson = require(path.join(process.cwd(), 'package.json'));

let version = process.env.SCANNING_BEE_VERSION;
if (version && version.length >= 1 && version[0] === 'v') {
    version = version.slice(1);
}

await $`rimraf build/code build/output`;
// ! warning: creating the assets folder changes the cp -r behavior on windows. It will cause the assets path to be assets/assets.
// await $`mkdir -p build/code/assets/`;

await $`yarn run build`;
await $`yarn run bundle`;

const newPackageJson = {
    name: packageJson.name,
    description: packageJson.description,
    author: packageJson.author,
    version: version || packageJson.version,
    main: './dist/main/index.js',
};
await $`echo ${JSON.stringify(newPackageJson, null, 4)} > build/code/package.json`;

//! see above warning.
await $`cp -r build/assets/ build/code/assets/`;

await $`zx build/prepare-modules.mjs`;

await $`yarn run electron-builder build --publish never`;

if (process.env.CI && process.platform === 'darwin') {
    // We need to rebuild some modules
    await $`npm rebuild --platform=darwin --arch=arm64 --force`;
    await $`npx electron-rebuild --arch=arm64 -f -w -o better-sqlite3`;
    // skia-canvas needs a manual rebuild
    await $`cd node_modules/skia-canvas/ && yarn node-pre-gyp install --update-binary --target_arch=arm64`;

    await $`ARCH=arm64 zx build/prepare-modules.mjs`;

    await $`yarn run electron-builder build --arm64 --publish never`;
}
