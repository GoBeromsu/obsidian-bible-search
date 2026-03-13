import { Editor, Plugin } from 'obsidian'
import { BibleSearchSettings, DEFAULT_SETTINGS } from './plugin-settings'
import { BibleSearchModal } from './ui/BibleSearchModal'
import { BibleSettingsTab } from './ui/BibleSettingsTab'
import { VerseCache } from './cache/verse-cache'

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
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings)
  }
}
