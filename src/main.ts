import { Editor, Notice, Plugin } from 'obsidian'
import { BibleSearchSettings, DEFAULT_FORMAT_TEMPLATE, DEFAULT_SETTINGS } from './plugin-settings'
import { BibleSearchModal } from './ui/BibleSearchModal'
import { BibleSettingsTab } from './ui/BibleSettingsTab'
import { VerseCache } from './cache/verse-cache'
import { PluginLogger } from './shared/plugin-logger'

const logger = new PluginLogger('bible-search')

export default class BibleSearchPlugin extends Plugin {
  settings: BibleSearchSettings
  cache: VerseCache

  async onload(): Promise<void> {
    await this.loadSettings()
    this.cache = new VerseCache(this.settings.cacheTtlMinutes)

    this.addCommand({
      id: 'search-bible-verse',
      name: 'Search verse',
      editorCallback: (editor: Editor) => {
        new BibleSearchModal(this.app, editor, this.settings, this.cache).open()
      },
    })

    this.addSettingTab(new BibleSettingsTab(this.app, this))
  }

  async loadSettings(): Promise<void> {
    let data: Record<string, unknown> = {}
    try {
      data = (await this.loadData()) ?? {}
    } catch (err) {
      logger.error('Failed to load settings, using defaults', err)
      new Notice('Bible Search: Failed to load settings. Using defaults.')
    }

    // Migrate legacy outputFormat (pre-v1.2) → formatTemplate.
    // Only 'blockquote' needs an explicit template; 'callout' maps to the new default.
    let migrated = false
    if ('outputFormat' in data && !('formatTemplate' in data)) {
      if (data.outputFormat === 'blockquote') {
        data.formatTemplate = '> {verses}\n> — {bookKo} ({bookEn}) {range}'
      } else if (data.outputFormat !== 'callout') {
        logger.warn(`Unknown outputFormat "${data.outputFormat}", using default template`)
        data.formatTemplate = DEFAULT_FORMAT_TEMPLATE
      }
      delete data.outputFormat
      migrated = true
    }

    this.settings = Object.assign({}, DEFAULT_SETTINGS, data)

    if (migrated) {
      try {
        await this.saveData(this.settings)
      } catch (err) {
        logger.error('Failed to persist migration', err)
      }
    }
  }

  async saveSettings(): Promise<void> {
    try {
      await this.saveData(this.settings)
    } catch (err) {
      logger.error('Failed to save settings', err)
      new Notice('Bible Search: Failed to save settings.')
    }
  }
}
