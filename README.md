### [ChromecastCaptionsPlugin](https://github.com/warren-bank/clappr-chromecast-captions-plugin)

Plugin for [Clappr](https://github.com/clappr/clappr) media player to enhance the official [ChromecastPlugin](https://github.com/clappr/clappr-chromecast-plugin) with support for external (subtitle) text tracks.

#### Live Demo:

1. [Elephants Dream](https://warren-bank.github.io/crx-webcast-reloaded/external_website/5-clappr-captions/index.html#/watch/aHR0cHM6Ly9kMnppaGFqbW9ndTVqbi5jbG91ZGZyb250Lm5ldC9lbGVwaGFudHNkcmVhbS9lZF9oZC5tcDQ%253D/subtitle/aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3ZpZGVvanMvdmlkZW8uanMvdjcuMTAuMi9kb2NzL2V4YW1wbGVzL2VsZXBoYW50c2RyZWFtL2NhcHRpb25zLmVuLnZ0dA%253D%253D)
   * [mp4 video](https://d2zihajmogu5jn.cloudfront.net/elephantsdream/ed_hd.mp4)
   * [vtt captions](https://raw.githubusercontent.com/videojs/video.js/v7.10.2/docs/examples/elephantsdream/captions.en.vtt)

#### Usage:

_CDNs:_

* jsDelivr
  * [ES6](https://cdn.jsdelivr.net/gh/warren-bank/clappr-chromecast-captions-plugin/es6/clappr-chromecast-captions-plugin.js)
  * [ES6 minified w/ sourcemap](https://cdn.jsdelivr.net/gh/warren-bank/clappr-chromecast-captions-plugin/es6/clappr-chromecast-captions-plugin.min.js)
  * [ES5 compiled w/ sourcemap](https://cdn.jsdelivr.net/gh/warren-bank/clappr-chromecast-captions-plugin/es5/clappr-chromecast-captions-plugin.js)
  * [ES5 minified w/ sourcemap](https://cdn.jsdelivr.net/gh/warren-bank/clappr-chromecast-captions-plugin/es5/clappr-chromecast-captions-plugin.min.js)

_Example HTML:_

```html
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/clappr@latest/dist/clappr.min.js"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/clappr-chromecast-plugin@latest/dist/clappr-chromecast-plugin.min.js"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/warren-bank/clappr-chromecast-captions-plugin/es5/clappr-chromecast-captions-plugin.min.js"></script>
  <script>
    var player = new Clappr.Player({
      source: 'https://d2zihajmogu5jn.cloudfront.net/elephantsdream/ed_hd.mp4',
      poster: 'https://d2zihajmogu5jn.cloudfront.net/elephantsdream/poster.png',
      height:  360,
      width:   640,
      plugins: [ChromecastCaptionsPlugin],
      chromecast: {
        appId: '9DFB77C0',
        media: {
          type:     ChromecastPlugin.Movie,
          title:    'Elephants Dream',
          subtitle: '2006 Dutch computer animated science fiction fantasy experimental short film produced by Blender Foundation'
        }
      },
      playback: {
        crossOrigin: 'anonymous',
        externalTracks: [{
          lang:  'en-US',
          label: 'English',
          kind:  'subtitles',
          src:   'https://raw.githubusercontent.com/videojs/video.js/v7.10.2/docs/examples/elephantsdream/captions.en.vtt'
        },{
          lang:  'sv',
          label: 'Swedish',
          kind:  'subtitles',
          src:   'https://raw.githubusercontent.com/videojs/video.js/v7.10.2/docs/examples/elephantsdream/captions.sv.vtt'
        },{
          lang:  'ru',
          label: 'Russian',
          kind:  'subtitles',
          src:   'https://raw.githubusercontent.com/videojs/video.js/v7.10.2/docs/examples/elephantsdream/captions.ru.vtt'
        },{
          lang:  'ja',
          label: 'Japanese',
          kind:  'subtitles',
          src:   'https://raw.githubusercontent.com/videojs/video.js/v7.10.2/docs/examples/elephantsdream/captions.ja.vtt'
        },{
          lang:  'ar',
          label: 'Arabic',
          kind:  'subtitles',
          src:   'https://raw.githubusercontent.com/videojs/video.js/v7.10.2/docs/examples/elephantsdream/captions.ar.vtt'
        }]
      }
    });
  </script>
```

_Key Things to Note:_

* order of `<script>` tags:
  - _clappr-chromecast-captions-plugin.min.js_ is loaded __after__ _clappr-chromecast-plugin.min.js_
* Clappr settings object:
  - `plugins: [ChromecastCaptionsPlugin]`
    * does __not__ include `ChromecastPlugin`
  - configuration is otherwise unchanged

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
