# experiment-custom-directlinejs

This experiment use a development build of `BotFramework-DirectLineJS` with Web Chat.

The development build will watch for network type change through [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API).

For details, please refer to [PR #412](https://github.com/microsoft/BotFramework-DirectLineJS/pull/412).

## Behavior

### Retry up to 3 times after connection is stabilized

DirectLineJS ASE adapter (a.k.a. DLASE) will reconnect up to 3 times. When a stable connection is detected, it will reset the retry counter back to 3.

DLASE consider the connection is stable if the connection did not close within a minute after the connection is established.

In other words, if connection is flaky and it keeps reconnecting quickly. Despite there maybe successful connection inbetween, it may fail to reconnect after 3 times.
