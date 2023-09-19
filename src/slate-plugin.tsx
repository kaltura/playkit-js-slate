import {BasePlugin, KalturaPlayer} from '@playkit-js/kaltura-player-js';
import { h } from 'preact';
import {SlateManager} from "./slate-manager/slate-manager";
import {SlateEventTypes} from "./types/slate-event-types";
// @ts-ignore
import { FakeEvent } from '@playkit-js/playkit-js';

export const pluginName = 'slate';

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
      //@ts-ignore
      this.eventManager.listen(this.slateManager, slateEventType, (e: FakeEvent) => {
        //@ts-ignore
        return this.dispatchEvent(e.type, e.payload);
      });
    });
  }

  public static isValid(): boolean {
    return true;
  }
}
