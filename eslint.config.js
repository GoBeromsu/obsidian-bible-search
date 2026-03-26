import { baseConfig } from './eslint.base.js'

export default [
	...baseConfig,

	// Tech-debt overrides: legacy code issues, private plugin not on marketplace.
	// TODO: address incrementally.
	{
		rules: {
			// API responses are untyped `any` throughout (loadData, fetch responses).
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			// Async event handlers in SuggestModal (legacy pattern).
			'@typescript-eslint/no-misused-promises': 'off',
			// UI text capitalization — private plugin, not marketplace reviewed.
			'obsidianmd/ui/sentence-case': 'off',
		},
	},
]
