import { BasePlugin, ui } from '@playkit-js/kaltura-player-js';
import { SlateConfig } from './types/slate-config';
import { h } from 'preact';
import { SomeComponent } from './ui/more-icon/some-component.component';

export const pluginName = 'slate';

export class SlatePlugin extends BasePlugin<SlateConfig> {
  protected static defaultConfig: SlateConfig = {
    developerName: 'whoever you are'
  };

  public static isValid(): boolean {
    return true;
  }

  protected loadMedia(): void {
    this.addSomeComponent();
  }

  private addSomeComponent(): void {
    this.player.ui.addComponent({
      label: 'slate',
      area: ui.ReservedPresetAreas.InteractiveArea,
      presets: [ui.ReservedPresetNames.Playback, ui.ReservedPresetNames.Live],
      get: () => <SomeComponent developerName={this.config.developerName} />
    });
  }
}
