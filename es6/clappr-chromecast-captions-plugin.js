// -----------------------------------------------------------------------------
// ES6 requirements:
//   1) Chrome 72+
//      * static class fields
//          https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Browser_compatibility
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// monkey patch HlsjsPlayback
//
// purpose:
//   when HlsjsPlayback is active, hold a copy of its "hls.js" instance,
//   which is aware of all in-stream (subtitle) text tracks.
//
// references:
//   https://github.com/clappr/hlsjs-playback/blob/master/src/hls.js
//   https://github.com/video-dev/hls.js/blob/master/docs/API.md

let HLSJS = null

const getInternalTracks = () => {
  return (!HLSJS)
    ? []
    : HLSJS.subtitleTracks.map(subtitleTrack => ({
        kind:  'subtitles',
        src:   subtitleTrack.url,
        lang:  subtitleTrack.lang,
        label: subtitleTrack.name
      }))
}

{
  const HlsjsPlayback = Clappr.HLS.prototype

  // setup
  const _setup  = HlsjsPlayback._setup

  // teardown
  const stop    = HlsjsPlayback.stop
  const destroy = HlsjsPlayback.destroy

  HlsjsPlayback._setup = function(){  // note: don't use arrow function; need 'this' to refer to the instance of HlsjsPlayback
    _setup.call(this)

    HLSJS = this._hls
    this.trigger(Clappr.Events.PLAYBACK_READY, this.name)

    /*
    this._hls.on(Clappr.HLS.HLSJS.Events.SUBTITLE_TRACK_LOADING, (evt, data) => {
      const {url, id} = data
      console.log(url, this._hls.subtitleTracks)
    })
    */
  }

  HlsjsPlayback.stop = function(){  // note: don't use arrow function; need 'this' to refer to the instance of HlsjsPlayback
    stop.call(this)

    HLSJS = null
  }

  HlsjsPlayback.destroy = function(){  // note: don't use arrow function; need 'this' to refer to the instance of HlsjsPlayback
    destroy.call(this)

    HLSJS = null
  }
}

// -----------------------------------------------------------------------------

class ChromecastCaptionsPlugin extends ChromecastPlugin {
  constructor(core) {
    super(core)

    this.activeTrackId = -1
  }

  containerChanged() {
    super.containerChanged()

    if (this.container) {
      this.listenTo(this.container, Clappr.Events.CONTAINER_READY,            this.containerReady)
      this.listenTo(this.container, Clappr.Events.CONTAINER_SUBTITLE_CHANGED, this.subtitleChanged)
    }
  }

  containerReady() {
    this.initializeTextTracks()
  }

  initializeTextTracks() {
    const textTracks = this.container.closedCaptionsTracks  // [{id, name, track}]
    if (!textTracks || !textTracks.length) return

    for (let i=0; i < textTracks.length; i++) {
      if (textTracks[i].track.mode === 'showing') return
    }

    // turn on the first subtitles text track (which is always "Disabled") to display the "CC" icon/menu in the media-control panel
    textTracks[0].track.mode = 'showing'
  }

  get externalTracks() {
    const externalTracks = this.core.options.externalTracks || (this.core.options.playback ? this.core.options.playback.externalTracks : null)

    return (!externalTracks || !Array.isArray(externalTracks) || !externalTracks.length)
      ? []
      : externalTracks.filter(track => track.kind === 'subtitles')
  }

  get activeTrackIds() {
    const trackId = (!this.session || !this.mediaSession)
      ? this.container.closedCaptionsTrackId
      : this.activeTrackId

    return (trackId >= 0)
      ? [trackId]
      : []
  }

  // references:
  //   https://developers.google.com/cast/docs/reference/chrome/chrome.cast.Session#loadMedia
  //   https://developers.google.com/cast/docs/reference/chrome/chrome.cast.media.Media
  loadMedia() {
    this.container.pause()

    const src = this.container.options.src
    Clappr.Log.debug(this.name, 'loading... ' + src)

    const mediaInfo        = this.createMediaInfo(src)
    const request          = new chrome.cast.media.LoadRequest(mediaInfo)
    request.autoplay       = true
    request.activeTrackIds = this.activeTrackIds
    if (this.currentTime) {
      request.currentTime  = this.currentTime
    }

    this.session.loadMedia(
      request,
      (mediaSession) => this.loadMediaSuccess('loadMedia', mediaSession),
      (e) => this.loadMediaError(e)
    )
  }

  createMediaInfo(src) {
    const mediaInfo       = new chrome.cast.media.MediaInfo(src)
    const mimeType        = ChromecastPlugin.mimeTypeFor(src)
    const metadata        = this.createMediaMetadata()
    const tracks          = this.createMediaTracks()

    mediaInfo.contentType = this.options.contentType || mimeType
    mediaInfo.customData  = this.options.customData
    mediaInfo.metadata    = metadata
    mediaInfo.tracks      = tracks

    return mediaInfo
  }

  // ---------------------------------------------
  // references:
  //   https://developers.google.com/cast/docs/chrome_sender/advanced
  // ---------------------------------------------
  createMediaTracks() {
    const combinedTracks = [...this.externalTracks, ...getInternalTracks()]
    if (!combinedTracks.length) return null

    return combinedTracks.map((textTrack, index) => {
      const track            = new chrome.cast.media.Track(index, chrome.cast.media.TrackType.TEXT)
      track.trackContentId   = textTrack.src
      track.trackContentType = ChromecastCaptionsPlugin.subtitleMimeTypeFor(textTrack.src)
      track.subtype          = chrome.cast.media.TextTrackType.SUBTITLES
      track.language         = textTrack.lang
      track.name             = textTrack.label
      track.customData       = null

      return track
    })
  }

  // references:
  //   https://www.rev.com/api/attachmentsgetcontent
  static MIMETYPES = {
    ".vtt":    "text/vtt",                          // WebVTT
    ".srt":    "application/x-subrip",              // SubRip
    ".ttml":   "application/ttml+xml",              // Timed Text
    ".cap":    "application/x-cheetah-cap",         // Cheetah
    ".scc":    "text/x-scc",                        // Scenarist
    ".dxfp":   "application/ttaf+xml",              // DXFP (Netflix)
    ".mcc":    "text/x-mcc",                        // MacCaption (Adobe)
    ".stl":    "text/x-stl",                        // Spruce
    ".qt.txt": "application/x-quicktime-timedtext"  // Quicktime Timed Text
  }

  static FILE_EXTENSION_PATTERN = /^.*?((?:\.[^\.\/]+)+)(?:[\?#].*)?$/i

  static subtitleMimeTypeFor(url) {
    if (!ChromecastCaptionsPlugin.FILE_EXTENSION_PATTERN.test(url))
      return null

    const ext = url.replace(ChromecastCaptionsPlugin.FILE_EXTENSION_PATTERN, '$1')

    return ChromecastCaptionsPlugin.MIMETYPES[ext]
      ? ChromecastCaptionsPlugin.MIMETYPES[ext]
      : null
  }

  // references:
  //   https://developers.google.com/cast/docs/reference/chrome/chrome.cast.media.EditTracksInfoRequest
  //   https://developers.google.com/cast/docs/reference/chrome/chrome.cast.media.Media#editTracksInfo
  subtitleChanged(track) {
    this.activeTrackId = track.id

    if (!this.session || !this.mediaSession) return

    const request = new chrome.cast.media.EditTracksInfoRequest(this.activeTrackIds)
    this.mediaSession.editTracksInfo(request)
  }

  loadMediaSuccess(how, mediaSession) {
    super.loadMediaSuccess(how, mediaSession)

    // monkey patch ChromecastPlayback

    const combinedTracks = [...this.externalTracks, ...getInternalTracks()]
    if (!combinedTracks.length) return

    const textTracks = combinedTracks.map((textTrack, index) => ({
      id:    index,
      name:  textTrack.label,
      track: {
        id:      "",
        mode:    ((index === this.activeTrackId) ? "showing" : "disabled"),
        kind:     textTrack.kind,
        label:    textTrack.label,
        language: textTrack.lang
      }
    }))

    Object.defineProperty(this.playbackProxy, "hasClosedCaptionsTracks", {
      configurable: false,
      enumerable:   false,
      writable:     false,
      value:        true
    })

    Object.defineProperty(this.playbackProxy, "closedCaptionsTracks", {
      configurable: false,
      enumerable:   false,
      writable:     false,
      value:        textTracks
    })

    Object.defineProperty(this.playbackProxy, "closedCaptionsTrackId", {
      configurable: false,
      enumerable:   false,
      get:          ()   => this.activeTrackId,
      set:          (id) => {
        if (id === this.activeTrackId) return

        this.activeTrackId = id

        this.playbackProxy.trigger(Clappr.Events.PLAYBACK_SUBTITLE_CHANGED, {id})
      }
    })

    this.playbackProxy.trigger(Clappr.Events.PLAYBACK_SUBTITLE_AVAILABLE)
  }
}

window.ChromecastCaptionsPlugin = ChromecastCaptionsPlugin
