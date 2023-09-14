const getPlayer = () => {
  // @ts-ignore
  return cy.window().then($win => $win.KalturaPlayer.getPlayers()['player-placeholder']);
};

const preparePage = (pluginConf = {}, playbackConf = {}) => {
  cy.visit('index.html');
  return cy.window().then(win => {
    try {
      // @ts-ignore
      var kalturaPlayer = win.KalturaPlayer.setup({
        targetId: 'player-placeholder',
        provider: {
          partnerId: -1,
          env: {
            cdnUrl: 'http://mock-cdn',
            serviceUrl: 'http://mock-api'
          }
        },
        playback: {
          muted: true,
          autoplay: true,
          ...playbackConf
        },
        plugins: {
          kava: {
            disable: true
          },
          slate: {}
        }
      });
      return kalturaPlayer.setMedia({
        sources: {
          id: '1234',
          progressive: [
            {
              mimetype: 'video/mp4',
              url: './media/video.mp4'
            }
          ]
        }
      });
    } catch (e: any) {
      return Promise.reject(e.message);
    }
  });
};

export const loadPlayer = (pluginConf = {}, playbackConf = {}) => {
  return preparePage(pluginConf, playbackConf).then(() => getPlayer().then(kalturaPlayer => kalturaPlayer.ready().then(() => kalturaPlayer)));
};
