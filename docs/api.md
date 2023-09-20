#Slate Plugin API

the available APIs are:

- add
- remove

## add

adds a slate to the player.

in order to use the `add` API, you need to provide an object which contains options of the slate.

see more information about the `SlateOptions` object [here](./slate-options.md).

### example of usage

```
const slateOptions = {
    title: 'Slate title',
    message: 'Slate message',
    timeout: 5000,
    showDismissButton: false
};
player.getService('slateManager').add(slateOptions);
```

## remove

removes a slate from the player.

### example of usage

```
player.getService('slateManager').remove();
```
