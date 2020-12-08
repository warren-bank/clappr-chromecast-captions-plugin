// requirements:
//   1) Chrome 72+
//      * ES6 static class fields
//          https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Browser_compatibility

class ChromecastCaptionsPlugin extends ChromecastPlugin {
  constructor(core) {
    super(core)
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

  get activeTrackIds() {
    const trackId = this.container.closedCaptionsTrackId
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
    let externalTracks = this.core.options.externalTracks || (this.core.options.playback ? this.core.options.playback.externalTracks : null)
    if (!externalTracks || !Array.isArray(externalTracks) || !externalTracks.length) return null

    externalTracks = externalTracks.filter(track => track.kind === 'subtitles')
    if (!externalTracks.length) return null

    const textTracks = this.container.closedCaptionsTracks  // [{id, name, track}]
    if (!textTracks || !Array.isArray(textTracks) || (textTracks.length < externalTracks.length)) return null

    // UNSAFE ASSUMPTIONS:
    //  1. textTracks[i] corresponds to externalTracks[i]

    return externalTracks.map((externalTrack, index) => {
      const textTrack        = textTracks[index]

      const track            = new chrome.cast.media.Track(textTrack.id, chrome.cast.media.TrackType.TEXT)
      track.trackContentId   = externalTrack.src
      track.trackContentType = ChromecastCaptionsPlugin.subtitleMimeTypeFor(externalTrack.src)
      track.subtype          = chrome.cast.media.TextTrackType.SUBTITLES
      track.language         = externalTrack.lang  || textTrack.track.language
      track.name             = externalTrack.label || textTrack.name
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

  static FILE_EXTENSION_PATTERN = /^.*?((?:\.[^\.\/]+)+)([\?#].*)?$/i

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
    if (!this.session || !this.mediaSession) return

    const request = new chrome.cast.media.EditTracksInfoRequest(this.activeTrackIds)
    this.mediaSession.editTracksInfo(request)
  }
}

window.ChromecastCaptionsPlugin = ChromecastCaptionsPlugin
