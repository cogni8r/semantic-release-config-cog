const fs = require('fs');
const path = require('path');

/**
 *
 * @param isMonorepository {boolean}
 */
function getConfig(isMonorepository) {
    const npmPlugins = isMonorepository
        ? getNpmPlugins()
        : ["@semantic-release/npm"];

    return {
        branches: [
            "main"
        ],
        plugins: [
            "@semantic-release/commit-analyzer",
            "@semantic-release/release-notes-generator",
            [
                "@semantic-release/changelog",
                {
                    "changelogTitle": "# Changelog",
                    "changelogFile": "CHANGELOG.md"
                }
            ],
            ...npmPlugins,
            "@semantic-release/github",
            [
                "@semantic-release/git",
                {
                    "assets": ["CHANGELOG.md"]
                }
            ]
        ]
    };
}

function getNpmPlugins() {
    const plugins = [["@semantic-release/exec", {
        "prepareCmd": "npx replace '0.0.0-development' '${nextRelease.version}' ./packages -r --include=\"package.json\""
    }]];

    const packages = getPackages();

    for (const packageName of packages) {
        plugins.push(["@semantic-release/npm", {
            "pkgRoot": `packages/${packageName}`
        }]);
    }

    return plugins;
}

/**
 *
 * @returns {string[]}
 */
function getPackages() {
    const cwd = process.cwd();

    const packagesFolder = path.join(cwd, 'packages');

    const directoryItems = fs.readdirSync(packagesFolder, {withFileTypes: true});

    return getFoldersOnly(directoryItems);
}

/**
 * @param folderContent {Dirent[]}
 * @returns {string[]}
 */
function getFoldersOnly(folderContent) {
    const result = [];

    for (const item of folderContent) {
        if (item.isDirectory()) {
            result.push(item.name);
        }
    }

    return result;
}

module.exports = getConfig;
