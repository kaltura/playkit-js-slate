import {BasePlugin, KalturaPlayer} from '@playkit-js/kaltura-player-js';
import { h } from 'preact';
import {SlateManager} from "./slate-manager/slate-manager";

export const pluginName = 'slate';

export class SlatePlugin extends BasePlugin<any> {
  constructor(name: string, player: KalturaPlayer, config?: any) {
    super(name, player, config);
    //@ts-ignore
    player.registerService('slateManager', new SlateManager(player, this.logger, (event: string) => this.dispatchEvent(event)));
  }

  public static isValid(): boolean {
    return true;
  }
}
