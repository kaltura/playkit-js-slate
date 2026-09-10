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
  targetId?: string;
};

const translates = {
  dismissLabel: <Text id="slate.dismiss">Dismiss</Text>
};

const mapStateToProps = (state: Record<string, any>): void => ({
  playerSize: state.shell.playerSize,
  targetId: state.config.targetId
});

const SPINNER_SIZE_EX_S_PLAYER = 32;
const SPINNER_SIZE_M_L_PLAYER = 48;

// @ts-ignore
@connect(mapStateToProps)
@withText(translates)
export class Slate extends Component<SlateProps> {
  private slateContentRef: HTMLDivElement | null = null;
  private previouslyFocusedElement: HTMLElement | null = null;

  public componentDidMount(): void {
    const { showCloseButton } = this.props;

    // handle overlay close button
    const closeButtonEl = document.querySelector('.playkit-close-overlay') as any;
    if (!showCloseButton && closeButtonEl) {
      closeButtonEl.style['display'] = 'none';
    }

    // WCAG 2.4.3 (Focus Order) / 2.1.1 (Keyboard): the slate is a modal dialog, so focus has to move
    // into it once it opens. Without this the playkit-js-ui Overlay tab trap never engages, since it
    // can only cycle focus that is already inside, and keyboard users cannot reach the slate buttons.
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    // wait for the portal content to be painted before moving focus into it
    requestAnimationFrame(() => {
      // focus the content container rather than the first button, so the title and message are
      // announced before the controls
      this.slateContentRef?.focus();
    });

    if (this.props.timeout) {
      setTimeout(() => {
        this.props.onClose(new MouseEvent('click'), false);
      }, this.props.timeout);
    }
  }

  public componentWillUnmount(): void {
    // WCAG 2.4.3: hand focus back to wherever it was before the slate opened
    this.restorePreviousFocus();
  }

  private restorePreviousFocus(): void {
    const previous = this.previouslyFocusedElement;
    this.previouslyFocusedElement = null;
    if (!previous || typeof previous.focus !== 'function') return;
    if (document.body.contains(previous)) {
      previous.focus();
      return;
    }
    // the previously focused element was removed from the DOM while the slate was open, so fall back
    // to the player container. It is not focusable on its own, hence the programmatic tabIndex.
    const playerContainer = this.props.targetId ? document.getElementById(this.props.targetId) : null;
    if (!playerContainer) return;
    if (!playerContainer.hasAttribute('tabindex')) {
      playerContainer.setAttribute('tabindex', '-1');
    }
    playerContainer.focus();
  }

  private getTitleId(): string {
    return `${this.props.targetId || 'player'}-slate-title`;
  }

  private getMessageId(): string {
    return `${this.props.targetId || 'player'}-slate-message`;
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
          <div className={styles.slateTitle} id={this.getTitleId()} data-testid="slate_title">
            {title}
          </div>
        )}
        {message && (
          <div data-testid="slate_message" id={this.getMessageId()} className={styles.message}>
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

  private getSlateOverlayWrapperStyle(): any {
    if (this.props.backgroundImageUrl) {
      return {
        backgroundImage: `url(${this.props.backgroundImageUrl})`,
        backgroundSize: 'contain'
      };
    }
    return null;
  }

  public render(): ComponentChild {
    const { onClose, showSpinner, backgroundImageUrl, title, message } = this.props;
    const slateOverlayWrapperStyle = this.getSlateOverlayWrapperStyle();
    // WCAG 4.1.2: name and describe the dialog from its own content
    const ariaProps: Record<string, string> = {};
    if (title) {
      ariaProps.ariaLabelledBy = this.getTitleId();
    }
    if (message) {
      ariaProps.ariaDescribedBy = this.getMessageId();
    }
    return (
      <OverlayPortal>
        <div
          className={[styles.slateOverlayWrapper, 'slate-overlay-wrapper-id', backgroundImageUrl ? 'slate-has-image' : ''].join(
            ' '
          )}
          style={slateOverlayWrapperStyle}
          data-testid="slate_overlay_wrapper"
        >
          <Overlay open onClose={onClose} {...ariaProps}>
            <div className={styles.slateRoot} data-testid="slate_root">
              <div
                ref={(el): void => {
                  this.slateContentRef = el;
                }}
                tabIndex={-1}
                className={styles.slateContent}
                data-testid="slate_content"
              >
                {showSpinner ? (
                  <div data-testid="slate_spinner_container">
                    <Spinner size={this.getSpinnerSize()} />
                  </div>
                ) : undefined}
                {this.renderTextArea()}
                {this.renderButtons()}
              </div>
            </div>
          </Overlay>
        </div>
      </OverlayPortal>
    );
  }
}
