// These lint rules are temporarily disabled until our fully typescript support is added
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { Component, ComponentChild, h } from 'preact';
import { ui } from '@playkit-js/kaltura-player-js';
import * as styles from './slate.scss';
import { OverlayPortal } from '@playkit-js/common/dist/hoc/overlay-portal';
import { OnClick } from '@playkit-js/common/dist/hoc/a11y-wrapper';
import { Button, ButtonType } from '@playkit-js/common';
import { Spinner } from '@playkit-js/common/dist/components/spinner/spinner';

// @ts-ignore
const { Overlay } = ui.Components;
const { Text, withText } = ui.preacti18n;
// @ts-ignore
const { components } = ui;
const { PLAYER_SIZE } = components;
const {
  redux: { connect }
} = ui;

type SlateProps = {
  onClose: OnClick;
  title?: string;
  message?: string;
  backgroundImageUrl?: string;
  showSpinner?: boolean;
  timeout?: number;
  showCloseButton?: boolean;
  showDismissButton?: boolean;
  dismissButtonText?: string;
  customizedActionButtonText?: string;
  dismissLabel?: string;
  onCustomizedActionClick: (action: string) => void;
  playerSize?: string;
};

const translates = {
  dismissLabel: <Text id="slate.dismiss">Dismiss</Text>
};

const mapStateToProps = (state: Record<string, any>): void => ({
  playerSize: state.shell.playerSize
});

const SPINNER_SIZE_EX_S_PLAYER = 32;
const SPINNER_SIZE_M_L_PLAYER = 48;

// @ts-ignore
@connect(mapStateToProps)
@withText(translates)
export class Slate extends Component<SlateProps> {
  public componentDidMount(): void {
    const { showCloseButton, backgroundImageUrl } = this.props;

    // handle overlay close button
    const closeButtonEl = document.querySelector('.playkit-close-overlay') as any;
    if (!showCloseButton && closeButtonEl) {
      closeButtonEl.style['display'] = 'none';
    }

    // handle background image
    const overlayPortalEl = document.querySelector('.overlay-portal') as any;
    const overlayContentsEl = document.querySelector('.playkit-overlay-contents') as any;
    if (backgroundImageUrl && overlayPortalEl && overlayContentsEl) {
      overlayPortalEl.style['background'] = `url(${backgroundImageUrl})`;
      overlayPortalEl.style['background-size'] = 'contain';
      overlayContentsEl.style['background-color'] = 'transparent';
    }

    if (this.props.timeout) {
      setTimeout(() => {
        this.props.onClose(new MouseEvent('click'), false);
      }, this.props.timeout);
    }
  }

  public componentWillUnmount(): void {
    const overlayPortalEl = document.querySelector('.overlay-portal') as any;
    if (this.props.backgroundImageUrl && overlayPortalEl) {
      overlayPortalEl.style['background'] = '';
    }
  }

  private renderButtons(): void {
    const { onClose, showDismissButton, customizedActionButtonText, dismissButtonText } = this.props;
    const dismissButtonLabel = dismissButtonText || this.props.dismissLabel;
    return (
      <div className={styles.slateButtonsWrapper}>
        {customizedActionButtonText && (
          <div className={styles.customizedActionButtonWrapper}>
            <Button
              type={ButtonType.primary}
              onClick={(): void => this.props.onCustomizedActionClick(customizedActionButtonText)}
              tooltip={{ label: customizedActionButtonText, className: ui.style.tooltip }}
              disabled={false}
              ariaLabel={customizedActionButtonText}
              testId={'slate_customizedActionButton'}
            >
              {customizedActionButtonText}
            </Button>
          </div>
        )}
        {showDismissButton && (
          <div className={styles.dismissWrapper}>
            <Button
              type={ButtonType.borderless}
              onClick={onClose}
              tooltip={{ label: dismissButtonLabel!, className: ui.style.tooltip }}
              disabled={false}
              ariaLabel={dismissButtonLabel}
              testId={'slate_dismissButton'}
            >
              {dismissButtonLabel}
            </Button>
          </div>
        )}
      </div>
    );
  }

  private renderTextArea(): void {
    const { title, message } = this.props;
    if (!title && !message) return undefined;
    return (
      <div className={styles.slateTextArea}>
        {title && (
          <div className={styles.slateTitle} data-testid="slate_title">
            {title}
          </div>
        )}
        {message && (
          <div data-testid="slate_message" className={styles.message}>
            {message}
          </div>
        )}
      </div>
    );
  }

  private getSpinnerSize(): number {
    const { playerSize } = this.props;
    if ([PLAYER_SIZE.EXTRA_SMALL, PLAYER_SIZE.SMALL].includes(playerSize)) return SPINNER_SIZE_EX_S_PLAYER;
    return SPINNER_SIZE_M_L_PLAYER;
  }

  public render(): ComponentChild {
    const { onClose, showSpinner } = this.props;
    return (
      <OverlayPortal>
        <Overlay open onClose={onClose}>
          <div className={styles.slateRoot} data-testid="slate_root">
            <div className={styles.slateContent} data-testid="slate_content">
              {showSpinner ? <Spinner size={this.getSpinnerSize()} /> : undefined}
              {this.renderTextArea()}
              {this.renderButtons()}
            </div>
          </div>
        </Overlay>
      </OverlayPortal>
    );
  }
}
