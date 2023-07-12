import { DirectLineStreaming } from 'botframework-directlinejs';
import React, { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import ReactWebChat from 'botframework-webchat';

import FakeNetworkInformation from '../util/FakeNetworkInformation';

const App = () => {
  const [token, setToken] = useState<string>('');

  const networkInformation = useMemo(() => new FakeNetworkInformation(), []);
  const type = useSyncExternalStore(
    callback => {
      networkInformation.addEventListener('change', callback);

      return () => networkInformation.removeEventListener('change', callback);
    },
    () => networkInformation.type
  );

  const directLine = useMemo(
    () =>
      token
        ? new DirectLineStreaming({
            domain: 'https://webchat-mockbot3.azurewebsites.net/.bot/v3/directline',
            networkInformation,
            token
          })
        : undefined,
    [networkInformation, token]
  );

  const handleOfflineClick = useCallback(() => networkInformation.goOffline(), [networkInformation]);
  const handleOnlineClick = useCallback(() => networkInformation.goOnline(), [networkInformation]);
  const handleToggleClick = useCallback(() => networkInformation.toggleType(), [networkInformation]);

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      const res = await fetch('https://webchat-mockbot3.azurewebsites.net/api/token/directlinease', {
        method: 'POST',
        signal: abortController.signal
      });

      if (!res.ok) {
        console.error('Failed to fetch token.');
      }

      setToken((await res.json()).token);
    })();

    return () => abortController.abort();
  }, [setToken]);

  return (
    <main>
      <div className="network-bar">
        <div className="network-bar__buttons">
          <button disabled={type === 'none'} onClick={handleOfflineClick} type="button">
            Offline
          </button>
          <button disabled={type !== 'none'} onClick={handleOnlineClick} type="button">
            Online
          </button>
          <button disabled={type === 'none'} onClick={handleToggleClick} type="button">
            Toggle type
          </button>
        </div>
        <div className="network-bar__type">
          <code>NetworkInformation.type === "{type}"</code>
        </div>
      </div>
      {directLine && <ReactWebChat className="web-chat" directLine={directLine} />}
    </main>
  );
};

export default App;
