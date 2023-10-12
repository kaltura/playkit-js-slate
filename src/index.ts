import { registerPlugin } from '@playkit-js/kaltura-player-js';
import { pluginName, SlatePlugin } from './slate-plugin';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
registerPlugin(pluginName, SlatePlugin);
