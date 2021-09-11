# Semantic-release config

[Semantic Release](https://semantic-release.gitbook.io/semantic-release/) configuration file for personal projects.

## Usage

Install:

```shell
npm install --save-dev @gearsjs/semantic-release-config 
```

Add file `release.config.cjs`

```javascript
const getConfig = require('@gearsjs/semantic-release-config');

module.exports = getConfig(true);
```

Add  **GitHub Action**:

```yaml
name: Semantic Release
on:
  workflow_dispatch
jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2.3.4
      - name: Setup Node.js
        uses: actions/setup-node@v2.4.0
        with:
          node-version: 16
      - name: Import GPG key
        uses: crazy-max/ghaction-import-gpg@v4
        with:
          gpg_private_key: ${{ secrets.GPG_PRIVATE_KEY }}
          passphrase: ${{ secrets.GPG_PASSPHRASE }}
          git_user_signingkey: true
          git_commit_gpgsign: true
      - name: Install dependencies
        run: npm ci
      - name: Install semantic-release plugins
        run: npm i @semantic-release/changelog @semantic-release/git @semantic-release/exec replace
      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.BOT_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          GIT_AUTHOR_NAME: ${{ secrets.GIT_AUTHOR_NAME }}
          GIT_AUTHOR_EMAIL: ${{ secrets.GIT_AUTHOR_EMAIL }}
          GIT_COMMITTER_NAME:  ${{ secrets.GIT_AUTHOR_NAME }}
          GIT_COMMITTER_EMAIL:  ${{ secrets.GIT_AUTHOR_EMAIL }}
        run: npx semantic-release
```

You can trigger it from the GitHub UI.
