import { BasePlugin, KalturaPlayer } from '@playkit-js/kaltura-player-js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { SlateManager } from './slate-manager/slate-manager';
import { SlateEventTypes } from './types/slate-event-types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FakeEvent } from '@playkit-js/playkit-js';

export const pluginName = 'slate';

const SLATE_PRE_ROLL_TAG = 'slate_pre_roll';

export class SlatePlugin extends BasePlugin<Record<string, never>> {
  private readonly slateManager: SlateManager;

  constructor(name: string, player: KalturaPlayer, config?: Record<string, never>) {
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

  public loadMedia() {
    if (this.player.sources.metadata?.tags?.toString().includes(SLATE_PRE_ROLL_TAG)) {
      this.slateManager.add({
        backgroundImageUrl: 'https://cfvod.kaltura.com/p/3188353/sp/318835300/thumbnail/entry_id/1_6oeqd8cr/width/560/quality/100',
        showSpinner: false,
        showDismissButton: false
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
