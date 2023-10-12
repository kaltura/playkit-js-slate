import { registerPlugin } from '@playkit-js/kaltura-player-js';
import { pluginName, SlatePlugin } from './slate-plugin';

// @ts-ignore
registerPlugin(pluginName, SlatePlugin);
