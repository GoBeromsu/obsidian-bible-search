export default {
  dev: {
    buildCommand: ['pnpm', 'run', 'dev:build'],
    deploy: {
      mode: 'copy',
      staticFiles: [
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'styles.css', to: 'styles.css' },
      ],
      watchFiles: [
        { from: 'main.js', to: 'main.js' },
        { from: 'styles.css', to: 'styles.css' },
      ],
    },
  },
  version: {
    stageFiles: ['manifest.json', 'versions.json'],
  },
  ci: {
    pushBranches: ['**'],
    testResultsFile: 'test-results.xml',
  },
  release: {
    pluginName: 'obsidian-bible-search',
    copyFiles: ['main.js', 'manifest.json', { path: 'styles.css', required: false }],
    publishFiles: [
      '${{ env.PLUGIN_NAME }}.zip',
      'main.js',
      'manifest.json',
      { path: 'styles.css', required: false },
      'versions.json',
    ],
  },
};
