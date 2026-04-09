import { describe, expect, it } from 'vitest'

import { migrateSettings } from '../../src/domain/settings-migration'

describe('migrateSettings', () => {
	it('returns unchanged=false when there are no migrations', () => {
		const original = { theme: 'dark' }

		const result = migrateSettings(original, [])

		expect(result.changed).toBe(false)
		expect(result.data).toEqual(original)
		expect(result.data).not.toBe(original)
	})

	it('applies migrations in order and marks the result as changed', () => {
			const result = migrateSettings(
				{ chapter: 3 },
				[
					(data) => ({ ...data, verse: 16 }),
					(data) => {
						const chapter = Number(data.chapter)
						const verse = Number(data.verse)
						return { ...data, ref: `${chapter}:${verse}` }
					},
				],
			)

		expect(result.changed).toBe(true)
		expect(result.data).toEqual({
			chapter: 3,
			verse: 16,
			ref: '3:16',
		})
	})
})
