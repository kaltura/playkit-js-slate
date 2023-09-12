import {KalturaPlayer, Logger, ui} from "@playkit-js/kaltura-player-js";
import {SlateOptions} from "../types/slate-options";
import {h} from "preact";
import {Slate} from "../components/slate/slate";
import {SlateEventTypes} from "../types/slate-event-types";

// @ts-ignore
const {components, redux} = ui;
const {PLAYER_SIZE} = components;

export class SlateManager {
  private _wasPlayed = false; // keep state of the player so we can resume if needed
  private _removeActiveOverlay: null | Function = null;
  private _store: any;

  constructor(
    private _player: KalturaPlayer,
    private _logger: Logger,
    private _dispatchSlateEvent: (event: string) => void
  )
  {
    this._store = redux.useStore();
  }

  public add(options: SlateOptions) {
    if (this._store.getState().shell.playerSize === PLAYER_SIZE.TINY) return;
    if (!this._player.paused) {
      this._player.pause();
      this._wasPlayed = true;
    }
    this._setOverlay(
      this._player.ui.addComponent({
        label: 'slate',
        area: ui.ReservedPresetAreas.GuiArea,
        presets: [ui.ReservedPresetNames.Playback, ui.ReservedPresetNames.Live],
        get: () => <Slate
          closeSlate={this._closeSlate}
          title={options.title}
          message={options.message}
          showDismissButton={options.showDismissButton !== undefined ? options.showDismissButton : true}
          showCloseButton={options.showCloseButton !== undefined ? options.showCloseButton : true}
          dismissButtonText={options.dismissButtonText}
          timeout={options.timeout}
          backgroundImage={options.backgroundImage}
          showSpinner={options.showSpinner !== undefined ? options.showSpinner : true}
          customizedActionButtonText={options.customizedActionButtonText}
          onCustomizedActionButtonClick={this._onCustomizedActionButtonClick}
        />
      })
    );
  }

  public remove() {
    this._removeOverlay();
  }

  private _setOverlay = (fn: Function) => {
    this._removeOverlay();
    this._removeActiveOverlay = fn;
  };

  private _removeOverlay = () => {
    if (this._removeActiveOverlay) {
      this._removeActiveOverlay();
      this._removeActiveOverlay = null;
    }
  };

  private _closeSlate = () => {
    this._removeOverlay();
    if (this._wasPlayed) {
      this._player.play();
      this._wasPlayed = false;
    }
  };

  private _onCustomizedActionButtonClick = () => {
    this._dispatchSlateEvent(SlateEventTypes.SLATE_CUSTOM_BUTTON_CLICKED);
  }
}