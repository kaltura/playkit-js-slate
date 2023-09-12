import {Component, ComponentChild, h} from 'preact';
import {ui} from '@playkit-js/kaltura-player-js';
import * as styles from './slate.scss';
import {OverlayPortal} from '@playkit-js/common/dist/hoc/overlay-portal';
import {OnClick} from '@playkit-js/common/dist/hoc/a11y-wrapper';
import {Button, ButtonType} from "@playkit-js/common";
import {Spinner} from "@playkit-js/common/dist/components/spinner/spinner";

// @ts-ignore
const {Overlay} = ui.Components;
const { Text, withText } = ui.preacti18n;
// @ts-ignore
const {components} = ui;
const {PLAYER_SIZE} = components;
const {
  redux: { connect }
} = ui;

type SlateProps = {
  closeSlate: OnClick,
  title?: string,
  message?: string,
  backgroundImage?: string,
  showSpinner?: boolean,
  timeout?: number,
  showCloseButton?: boolean,
  showDismissButton?: boolean,
  dismissButtonText?: string,
  customizedActionButtonText?: string,
  dismissLabel?: string,
  onCustomizedActionButtonClick: (action: string) => void,
  playerSize?: string
};

const translates = {
  dismissLabel: <Text id="slate.dismiss">Dismiss</Text>
};

const mapStateToProps = (state: Record<string, any>) => ({
  playerSize: state.shell.playerSize
});

const SPINNER_SIZE_EX_S_PLAYER = 32;
const SPINNER_SIZE_M_L_PLAYER = 48;

// @ts-ignore
@connect(mapStateToProps)
@withText(translates)
export class Slate extends Component<SlateProps> {
  componentDidMount() {
    const {showCloseButton, backgroundImage} = this.props;

    // handle overlay close button
    const closeButtonEl = document.querySelector('.playkit-close-overlay') as any;
    if (!showCloseButton && closeButtonEl) {
      closeButtonEl.style['display'] = 'none';
    }

    // handle background image
    const overlayPortalEl = document.querySelector('.overlay-portal') as any;
    const overlayContentsEl = document.querySelector('.playkit-overlay-contents') as any;
    if (backgroundImage && overlayPortalEl && overlayContentsEl) {
      overlayPortalEl.style['background'] = `url(${backgroundImage})`;
      overlayContentsEl.style['background-color'] = 'transparent';
    }

    if (this.props.timeout) {
      setTimeout(() => {
        this.props.closeSlate(new MouseEvent('click'), false);
      }, this.props.timeout);
    }
  }

  _renderButtons = () => {
    const {closeSlate, showDismissButton, customizedActionButtonText, dismissButtonText} = this.props;
    const dismissButtonLabel = dismissButtonText || this.props.dismissLabel;
    return (
      <div className={styles.slateButtonsWrapper}>
        {customizedActionButtonText && (
          <div className={styles.customizedActionButtonWrapper}>
            <Button
              type={ButtonType.primary}
              onClick={() => this.props.onCustomizedActionButtonClick(customizedActionButtonText)}
              tooltip={{label: customizedActionButtonText, className: ui.style.tooltip}}
              disabled={false}
              ariaLabel={customizedActionButtonText}
              testId={'slate_customizedActionButton'}>
              {customizedActionButtonText}
            </Button>
          </div>
        )}
        {showDismissButton && (
          <div className={styles.dismissWrapper}>
            <Button
              type={ButtonType.borderless}
              onClick={closeSlate}
              tooltip={{label: dismissButtonLabel!, className: ui.style.tooltip}}
              disabled={false}
              ariaLabel={dismissButtonLabel}
              testId={'slate_dismissButton'}>
              {dismissButtonLabel}
            </Button>
          </div>
        )}
      </div>
    )
  }

  _renderTextArea = () => {
    const {title, message} = this.props;
    if (!title && !message) return undefined;
    return (
      <div className={styles.slateTextArea}>
        {title && (
          <div className={[styles.slateTitle].join(' ')} data-testid="slate_title">
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

  _getSpinnerSize = (): number => {
    const {playerSize} = this.props;
    if ([PLAYER_SIZE.EXTRA_SMALL, PLAYER_SIZE.SMALL].includes(playerSize)) return SPINNER_SIZE_EX_S_PLAYER;
    return SPINNER_SIZE_M_L_PLAYER;
  }

  render(): ComponentChild {
    const {closeSlate, showSpinner} = this.props;
    return (
      <OverlayPortal>
        <Overlay open onClose={closeSlate}>
          <div className={styles.slateRoot} data-testid="slate_root">
            {showSpinner ? <Spinner size={this._getSpinnerSize()}/> : undefined}
            {this._renderTextArea()}
            {this._renderButtons()}
          </div>
        </Overlay>
      </OverlayPortal>
    );
  }
}
