import { App, debounce, PluginSettingTab, Setting } from 'obsidian'
import { SUPPORTED_VERSIONS } from '../sources/source-registry'
import { DEFAULT_FORMAT_TEMPLATE } from '../plugin-settings'
import type BibleSearchPlugin from '../main'

export class BibleSettingsTab extends PluginSettingTab {
  plugin: BibleSearchPlugin

  constructor(app: App, plugin: BibleSearchPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    const { containerEl } = this
    containerEl.empty()

    new Setting(containerEl)
      .setName('Default Bible version')
      .setDesc('Select the default Bible version for searches')
      .addDropdown(dropdown => {
        for (const v of SUPPORTED_VERSIONS) {
          dropdown.addOption(v.code, v.label)
        }
        dropdown.setValue(this.plugin.settings.defaultVersion)
        dropdown.onChange(async (value) => {
          this.plugin.settings.defaultVersion = value
          await this.plugin.saveSettings()
        })
      })

    new Setting(containerEl)
      .setName('Format template')
      .setDesc(
        'Template for inserted verses. Available tokens: ' +
        '{bookKo}, {bookEn}, {chapter}, {range}, {verses}, {version}, {calloutType}',
      )
      .addTextArea(textArea => {
        textArea.setPlaceholder(DEFAULT_FORMAT_TEMPLATE)
        textArea.setValue(this.plugin.settings.formatTemplate)
        textArea.inputEl.rows = 4
        textArea.inputEl.cols = 50
        const debouncedSave = debounce(() => this.plugin.saveSettings(), 500, true)
        textArea.onChange((value) => {
          this.plugin.settings.formatTemplate = value || DEFAULT_FORMAT_TEMPLATE
          debouncedSave()
        })
      })

    new Setting(containerEl)
      .setName('Callout type')
      .setDesc('The callout type identifier used by {calloutType} token (e.g. bible, quote)')
      .addText(text => {
        text.setPlaceholder('bible')
        text.setValue(this.plugin.settings.calloutType)
        text.onChange(async (value) => {
          this.plugin.settings.calloutType = value || 'bible'
          await this.plugin.saveSettings()
        })
      })

    new Setting(containerEl)
      .setName('Show verse numbers')
      .setDesc('Show verse numbers when inserting multiple verses')
      .addToggle(toggle => {
        toggle.setValue(this.plugin.settings.showVerseNumbers)
        toggle.onChange(async (value) => {
          this.plugin.settings.showVerseNumbers = value
          await this.plugin.saveSettings()
        })
      })

    new Setting(containerEl)
      .setName('Enable cache')
      .setDesc('Cache fetched chapters in memory')
      .addToggle(toggle => {
        toggle.setValue(this.plugin.settings.cacheEnabled)
        toggle.onChange(async (value) => {
          this.plugin.settings.cacheEnabled = value
          if (!value) this.plugin.cache.clear()
          await this.plugin.saveSettings()
        })
      })
  }
}
