# foss-simulations
FOSS science simulations

## Prerequisites

- Node.js
  - versions 14 and 16 are known to work
- Yarn
  - version 1.x seems to work, and multiple CC Developers report using it
  - version 2.x, without migrations, may work--but is un-tested!

## First build and browse

```
yarn install
yarn build
yarn serve
```

This will:
- install the top level package.json and dependencies in each subfolder
- copy the static folders to `dist`
- run `lerna build` which runs `yarn build` in each subfolder
- run a local webserver serving the `dist` folder

## Running a single simulation

```
cd [pci folder]
yarn start
```

This runs the webpack dev server. It will automatically rebuild and reload the page when the sources are changed.

## Running all the simulations

In one terminal, run:
```
cd [simulation folder] && yarn watch
```
Repeat that for all the simulations that you want to work on.


In another terminal, run:
```
yarn serve
```

This shows an index page listing the available simulations at: http://127.0.0.1:8080/.

Changes to the files in `[pci folder]` will cause a rebuild.
You need to manually refresh the web browser after the build is complete.

### Testing

Run `yarn test` to run jest tests.

## Mono Repo Setup

This repository is configured with yarn workspaces and lerna to run commands on subfolders.
Individual packages specify their dependencies in their own package.json files.
yarn takes care of 'hoisting' all modules into the top-level node_modules folder. This is done by the `yarn install` command.
Inside of the `<subfolder>/node_modules` folder should only be a .bin folder which contains the usual dev tool executables.

### Installing a new dependency

In a subfolder run `yarn add <new dep>` or `yarn add <new dep> --dev`
If you need to add it to the workspace root run `yarn add <new dep> -W`

### Updating a shared dependency

When updating a dependency that is shared by multiple PCIs, e.g. Webpack, it is easiest to find/replace the relevant dependencies in the editor and then run `yarn install` from the root folder to synchronize the dependencies appropriately. `yarn build` and `yarn test` can then be used to verify that the update didn't break anything obvious.

### Import checking

Because of this hoisted dependency setup, it makes it possible to import dependencies in your code without declaring one in the subfolder's package.json file. That could happen if the top-level package.json some other subfolder package.json added this dependency. In those two cases the dependency is now in the top-level node_modules folder. To prevent this 'undeclared dependency' problem the eslint-plugin-import module is added. It is configured to force all imports in your code to be declared in the code's package.json.

### Adding a new simulation or shared package

Use the following steps to add a new simulation:
- make a copy of the `starter` folder and rename it with the name of the simulation in kebab-case.
  For example, if the new simulation is named "New Simulation", then the folder will be named "new-simulation".
- search your newly created folder for instances of the string `starter` and replace it with the name of your PCI. For example, this string might appear in `readme.md`, and `package.json`.
- update `.github/workflows/release.yml` with an entry for the new simulation. This should look as follows:

```
- SIM_FOLDER: "new-simulation"
```
- add a link to the new PCI in the root `index.html` file as follows (use the folder name in the initial step in the URL param):

```
<li><a href="starter/index.html">New Simulation</a></li>`
```

- in `package.json`, update the `workspaces` array with an entry for the new PCI

## Deployment

Production releases to S3 are based on the contents of the /dist folder and are built automatically by GitHub Actions
for each branch and tag pushed to GitHub.

Branches are deployed to https://foss-simulations.concord.org/branch/<name>.
If the branch name starts or ends with a number this number is stripped off.

Tags are deployed to http://foss-simulations.concord.org/version/<name>.

To deploy a production release:

1. Checkout master and pull
2. Increment version number in package.json
3. Create an annotated tag for the version, of the form `v[x].[y].[z]`, include at least the version in the tag message. On the command line this can be done with a command like `git tag -a v1.2.3 -m "1.2.3 some info about this version"`
4. Push the tag to github with a command like: `git push origin v1.2.3`.
5. Use https://github.com/concord-consortium/foss-simulations/releases to make this tag into a GitHub release.
6. Run the release workflow to update https://models-resources.concord.org/foss-simulations/index.html.
    1. Navigate to the actions page in GitHub and the click the "Release" workflow. This should take you to this page: https://github.com/concord-consortium/foss-simulations/actions/workflows/release.yml.
    2. Click the "Run workflow" menu button.
    3. Type in the tag name you want to release for example `v1.2.3`.
    4. Click the `Run Workflow` button.

### Top Branch Testing

The production deploy above works by copying the index.html from the `/version/v1.2.3/index.html` to `/index.html`. It also copies special index-top.html files from the sub folders. For example `/version/v1.2.3/erosion/index-top.html` is copied to `/erosion/index.html`.  These `index-top.html` files are built specially to reference their javascript, css and other assets back in the version folder. So in the scenario above `/erosion/index.html` will load its files from `../version/v1.2.3/erosion/`. This is supported by using webpack's dynamic publicPath support combined with the the HtmlWebpackPlugin publicPath setting. If the code is loading or referring to assets without using webpack imports, these assets will not be found by the `/erosion/index.html` file.

Because of this difference between a production and non-production deploy, it is useful to test this out before updating production. The `s3-deploy-action` supports testing this with a `topBranches` property. This repository is setup with a "topBranch" of "main". So whenever `main` is pushed you can test out the dynamic asset support by going directly to `https://foss-simulations.concord.org/[sim-name]/index-main.html`.  In this repository there is no root level index file which provides links to each of these `[sim-name]/index-main.html` files, see below for more info on fixing this.

The "topBranch" support works by checking if the branch being built is a "topBranch", then all the `/branch/[branch-name]/**/index-top.html` files copied to `/**/index-[branch-name].html`. `**/index-top.html` means any index-top.html from the root and any subfolder. This approach supports monorepos like this one. This approach is described in https://github.com/concord-consortium/s3-deploy-action#top-branches and https://github.com/concord-consortium/s3-deploy-action#top-branch-support-in-mono-repos . 

In this repository the root level index.html is currently constructed manually with links to subfolder index.html files. Because a topBranch deploy will modify the names of these subfolder index files the current root level index.html is not useful. 

To provide a root level index that references all of the `index-[branch-name].html` files:
- [ ] an index-top.html needs to be added into dist during the build
- [ ] this index-top.html has 3 options to handling different subfolder index file names:
  1. it could continue to be created manually a developer and use browser javascript to look at its URL and then modify its dom to update the links to the subfolder index.html files based on its own URL. So if its URL ends with index-main.html, then it would change any `subfolder/index.html` references to `subfolder/index-main.html`
  2. the root level index-top.html could be built by webpack and it could use the `DEPLOY_PATH` env variable to figure out the branch name. Then the build process would add this branch to each of the subfolder index files. This second approach could also have the advantage of figuring out all of the subfolders itself, so this list wouldn't have to maintained in index.html anymore.
  3. the root level index-top.html could be hardcoded to reference index-main.html files. This currently the only topBranch configured, so it is hacky but it would work. It does mean there is yet another place that has to be maintained with the list of simulations. And if a new topBranch is added this approach would fail.
