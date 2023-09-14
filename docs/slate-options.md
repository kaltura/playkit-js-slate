# SlateOptions Object

### SlateOptions Object Structure

```js
const slateOptions = {
  title?: string, // optional
  message?: string, // optional
  backgroundImageUrl?: string, // optional
  showSpinner?: boolean, // optional
  showCloseButton?: boolean, // optional
  showDismissButton?: boolean, // optional
  dismissButtonText?: string, // optional
  customizedActionButtonText?: string // optional
  timeout?: number // optional
}
```

### SlateOptions

> ### title
>
> ##### Type: `string`
>
> ##### Default: `undefined`
>
> ##### Description: the title of the slate.
>
>
> ##

> ### message
>
> ##### Type: `string`
>
> ##### Default: `undefined`
>
> ##### Description: the message of the slate.
>
>
> ##

> ### backgroundImageUrl
>
> ##### Type: `string`
>
> ##### Default: `undefined`
>
> ##### Description: the background image URL of the slate.
>
>
> ##

> ### showSpinner
>
> ##### Type: `boolean`
>
> ##### Default: `true`
>
> ##### Description: whether to show the spinner or not.
>
>
> ##

> ### showCloseButton
>
> ##### Type: `boolean`
>
> ##### Default: `true`
>
> ##### Description: whether to show the slate close button or not.
>
>
> ##

> ### showDismissButton
>
> ##### Type: `boolean`
>
> ##### Default: `true`
>
> ##### Description: whether to show the slate dismiss button or not.
>
>
> ##

> ### dismissButtonText
>
> ##### Type: `string`
>
> ##### Default: `'Dismiss'`
>
> ##### Description: the text on the Dismiss button can be replaced by this option.
>
>
> ##

> ### customizedActionButtonText
>
> ##### Type: `string`
>
> ##### Default: `undefined`
>
> ##### Description: a text for an additional a customized action button in the slate.
>
>
> ##

> ### timeout
>
> ##### Type: `number`
>
> ##### Default: `undefined`
>
> ##### Description: timeout for the slate appearance in milliseconds.
>
> ##