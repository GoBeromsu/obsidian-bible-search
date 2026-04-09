export type MigrationFn = (data: Record<string, unknown>) => Record<string, unknown>

/**
 * Run a series of migration functions over settings data.
 * Each migration receives a shallow copy and may mutate it or return a new object.
 * `changed` is true if any migration was executed.
 */
export function migrateSettings(
	data: Record<string, unknown>,
	migrations: MigrationFn[],
): { data: Record<string, unknown>; changed: boolean } {
	let current = { ...data }

	for (const migrate of migrations) {
		current = migrate(current)
	}

	return { data: current, changed: migrations.length > 0 }
}
