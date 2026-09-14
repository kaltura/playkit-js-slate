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
  previouslyFocusedElement?: HTMLElement | null;
};

const translates = {
  dismissLabel: <Text id="slate.dismiss">Dismiss</Text>
};

const mapStateToProps = (state: Record<string, any>) => ({
  playerSize: state.shell.playerSize,
  targetId: state.config.targetId
});

const SPINNER_SIZE_EX_S_PLAYER = 32;
const SPINNER_SIZE_M_L_PLAYER = 48;

// @ts-ignore
@connect(mapStateToProps)
@withText(translates)
export class Slate extends Component<SlateProps> {
  private static activeSlate: Slate | null = null;
  private slateOverlayWrapper: HTMLDivElement | null = null;
  private previouslyFocusedElement: HTMLElement | null;

  private getTitleId(): string {
    return `${this.props.targetId || 'player'}-slate-title`;
  }

  private getMessageId(): string {
    return `${this.props.targetId || 'player'}-slate-message`;
  }

  public componentDidMount(): void {
    const { showCloseButton } = this.props;
    Slate.activeSlate = this;
    this.previouslyFocusedElement = this.props.previouslyFocusedElement || null;

    // handle overlay close button
    const closeButtonEl = document.querySelector('.playkit-close-overlay') as any;
    if (!showCloseButton && closeButtonEl) {
      closeButtonEl.style['display'] = 'none';
    }

    const focusableElement = Array.from(
      this.slateOverlayWrapper?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) || []
    ).find((element) => element.getClientRects().length > 0);
    const dialog = this.slateOverlayWrapper?.querySelector<HTMLElement>('[role="dialog"]');
    (focusableElement || dialog)?.focus();

    if (this.props.title) {
      this.slateOverlayWrapper?.querySelector('[role="dialog"]')?.setAttribute('aria-labelledby', this.getTitleId());
    }
    if (this.props.message) {
      this.slateOverlayWrapper?.querySelector('[role="dialog"]')?.setAttribute('aria-describedby', this.getMessageId());
    }

    if (this.props.timeout) {
      setTimeout(() => {
        this.props.onClose(new MouseEvent('click'), false);
      }, this.props.timeout);
    }
  }

  public componentWillUnmount(): void {
    const previouslyFocusedElement = this.previouslyFocusedElement;
    setTimeout(() => {
      if (Slate.activeSlate === this) {
        Slate.activeSlate = null;
        if (previouslyFocusedElement && document.contains(previouslyFocusedElement)) {
          previouslyFocusedElement.focus();
        }
      }
    });
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
          <div role="heading" aria-level={2} className={styles.slateTitle} id={this.getTitleId()} data-testid="slate_title">
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
    const { onClose, showSpinner, backgroundImageUrl } = this.props;
    const slateOverlayWrapperStyle = this.getSlateOverlayWrapperStyle();
    return (
      <OverlayPortal>
        <div
          ref={(element): void => {
            this.slateOverlayWrapper = element;
          }}
          className={[styles.slateOverlayWrapper, 'slate-overlay-wrapper-id', backgroundImageUrl ? 'slate-has-image' : ''].join(
            ' '
          )}
          style={slateOverlayWrapperStyle}
          data-testid="slate_overlay_wrapper"
        >
          <Overlay open onClose={onClose}>
            <div className={styles.slateRoot} data-testid="slate_root">
              <div className={styles.slateContent} data-testid="slate_content">
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
