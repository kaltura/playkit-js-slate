import { BasePlugin, KalturaPlayer } from '@playkit-js/kaltura-player-js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { SlateManager } from './slate-manager/slate-manager';
import { SlateEventTypes } from './types/slate-event-types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FakeEvent } from '@playkit-js/playkit-js';
import { SlateConfig } from './types/slate-config';

export const pluginName = 'slate';

const SLATE_PRE_ROLL_TAG = 'slate_pre_roll';

export class SlatePlugin extends BasePlugin<SlateConfig> {
  private readonly slateManager: SlateManager;

  protected static defaultConfig: SlateConfig = {
    imageOnMediaLoad: '',
    titleOnMediaLoad: '',
    messageOnMediaLoad: '',
    dismissTextOnMediaLoad: 'Dismiss'
  };

  constructor(name: string, player: KalturaPlayer, config: SlateConfig) {
    super(name, player, config);
    this.slateManager = new SlateManager(player, this.logger);
    player.registerService('slateManager', this.slateManager);
    this.addBindings();
  }

  private addBindings(): void {
    Object.values(SlateEventTypes).forEach((slateEventType: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      this.eventManager.listen(this.slateManager, slateEventType, (e: FakeEvent) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return this.dispatchEvent(e.type, e.payload);
      });
    });
  }

  public loadMedia(): void {
    if (
      this.player.sources.metadata?.tags?.toString().includes(SLATE_PRE_ROLL_TAG) &&
      (this.config.titleOnMediaLoad || this.config.messageOnMediaLoad)
    ) {
      this.slateManager.add({
        title: this.config.titleOnMediaLoad,
        message: this.config.messageOnMediaLoad,
        dismissButtonText: this.config.dismissTextOnMediaLoad,
        showSpinner: false
      });
    }
  }

  public reset(): void {
    this.slateManager.remove();
  }

  public static isValid(): boolean {
    return true;
  }
}
