import { App, PluginSettingTab, Setting } from 'obsidian'
import { SUPPORTED_VERSIONS } from '../sources/source-registry'
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
      .setName('Output format')
      .setDesc('How to format the inserted verse')
      .addDropdown(dropdown => {
        dropdown.addOption('callout', 'Callout')
        dropdown.addOption('blockquote', 'Blockquote')
        dropdown.setValue(this.plugin.settings.outputFormat)
        dropdown.onChange(async (value: 'callout' | 'blockquote') => {
          this.plugin.settings.outputFormat = value
          await this.plugin.saveSettings()
        })
      })

    new Setting(containerEl)
      .setName('Callout type')
      .setDesc('The callout type identifier (e.g. bible, quote)')
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
