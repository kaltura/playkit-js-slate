// These lint rules are temporarily disabled until our fully typescript support is added
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { KalturaPlayer, Logger, ui } from '@playkit-js/kaltura-player-js';
import { SlateOptions } from '../types/slate-options';
import { h } from 'preact';
import { Slate } from '../components/slate/slate';
import { SlateEventTypes } from '../types/slate-event-types';
// @ts-ignore
import { FakeEventTarget, FakeEvent } from '@playkit-js/playkit-js';

// @ts-ignore
const { components, redux } = ui;
const { PLAYER_SIZE } = components;

export class SlateManager extends FakeEventTarget {
  private wasPlayed = false; // keep state of the player so we can resume if needed
  private removeActiveOverlay: null | (() => void) = null;
  private store: any;

  constructor(private player: KalturaPlayer, private logger: Logger) {
    super(player, logger);
    this.store = redux.useStore();
  }

  public add(options?: SlateOptions): void {
    if (this.store.getState().shell.playerSize === PLAYER_SIZE.TINY) return;
    if (!this.player.paused) {
      this.player.pause();
      this.wasPlayed = true;
    }
    this.setOverlay(
      this.player.ui.addComponent({
        label: 'slate',
        area: ui.ReservedPresetAreas.GuiArea,
        presets: [ui.ReservedPresetNames.Playback, ui.ReservedPresetNames.Live],
        get: () => (
          <Slate
            onClose={(): void => this.onCloseHandler()}
            title={options?.title}
            message={options?.message}
            showDismissButton={options?.showDismissButton !== undefined ? options.showDismissButton : true}
            showCloseButton={options?.showCloseButton !== undefined ? options.showCloseButton : true}
            dismissButtonText={options?.dismissButtonText}
            timeout={options?.timeout}
            backgroundImageUrl={options?.backgroundImageUrl}
            showSpinner={options?.showSpinner !== undefined ? options.showSpinner : true}
            customizedActionButtonText={options?.customizedActionButtonText}
            onCustomizedActionClick={(): void => this.onCustomizedActionClick()}
          />
        )
      })
    );
  }

  public remove(): void {
    this.onCloseHandler();
  }

  private setOverlay(fn: () => void): void {
    this.removeOverlay();
    this.removeActiveOverlay = fn;
  }

  private removeOverlay(): void {
    if (this.removeActiveOverlay) {
      this.removeActiveOverlay();
      this.removeActiveOverlay = null;
    }
  }

  private onCloseHandler(): void {
    this.removeOverlay();
    if (this.wasPlayed) {
      this.player.play();
      this.wasPlayed = false;
    }
  }

  private onCustomizedActionClick(): void {
    //@ts-ignore
    this.dispatchEvent(new FakeEvent(SlateEventTypes.SLATE_CUSTOM_BUTTON_CLICKED));
  }
}
