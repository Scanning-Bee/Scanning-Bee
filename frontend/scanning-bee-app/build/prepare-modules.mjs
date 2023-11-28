#!/usr/bin/env zx

const readdirp = require('readdirp');
const ignore = require('ignore');
const { ModClean } = require('modclean');

const PLATFORM = process.env.PLATFORM || process.platform;
const ARCH = process.env.ARCH || process.arch;

// Platform string is a prebuiltify compatible string that includes platform and arch
// such as: win32-x64, darwin-x64, darwin-arm64, linux-x64 are the most common ones.
// Note that win32 does not mean 32bit.
const PLATFORM_STRING = `${PLATFORM}-${ARCH}`;
console.log('platform', PLATFORM_STRING);

const ELECTRON_ABI = (await $`yarn run electron --abi`).stdout.trim();

async function deleteItemsExceptOne(targetPath, keepFile) {
    const promises = [];

    const items = await fs.readdir(targetPath);
    for (const item of items) {
        if (path.basename(item) !== keepFile && item.endsWith('.node')) {
            console.log('removing', path.join(targetPath, item));
            promises.push(fs.remove(path.join(targetPath, item)));
        }
    }

    await Promise.allSettled(promises);
}

await $`mkdir -p build/code/`;
await $`rimraf build/code/node_modules`;
await $`cp -r node_modules/ build/code/node_modules/`;

const promises = [];

const nodeModulesPath = path.join(process.cwd(), 'build/code/node_modules');

// first we collect all modules that have prebuilds (which use prebuildify)
const prebuildModules = new Set();
for await (const entry of readdirp(nodeModulesPath, { fileFilter: '*.node' })) {
    if (entry.fullPath.includes('prebuilds')) {
        prebuildModules.add(path.dirname(path.dirname(entry.fullPath)));
    }
}

// we first iterate over all prebuilds and delete all that do not match the platform
for (const prebuildModule of prebuildModules) {
    for await (const entry of readdirp(prebuildModule, { fileFilter: '*.node' })) {
        if (!entry.path.includes(PLATFORM_STRING)) {
            promises.push(fs.remove(entry.fullPath));
            console.log('removing', entry.fullPath);
        }
    }
}

await Promise.allSettled(promises);

// clean some unused node files.
// if there is a electron.napi.node file, we delete all other files
// else if there is a electron.abiXX.node file, we delete all other files
// else if there is a node.abiXX.node file, we delete all other files
// there is no match, then there is no need to delete anything
// check prebuildify code for more info
for (const prebuildModule of prebuildModules) {
    const targetPath = path.join(prebuildModule, PLATFORM_STRING);

    if (await fs.pathExists(path.join(targetPath, 'electron.napi.node'))) {
        await deleteItemsExceptOne(targetPath, 'electron.napi.node');
    } else if (await fs.pathExists(path.join(targetPath, `electron.abi${ELECTRON_ABI}.node`))) {
        await deleteItemsExceptOne(targetPath, `electron.abi${ELECTRON_ABI}.node`);
    } else if (await fs.pathExists(path.join(targetPath, `node.abi${ELECTRON_ABI}.node`))) {
        await deleteItemsExceptOne(targetPath, `node.abi${ELECTRON_ABI}.node`);
    }
}

// we clean some unnecessary files with modclean
let mc = new ModClean({
    cwd: nodeModulesPath,
    patterns: ["default:safe", "default:caution"],
});
await mc._process(await mc._find());
