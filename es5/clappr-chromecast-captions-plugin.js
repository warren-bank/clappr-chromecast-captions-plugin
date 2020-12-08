;

(function () {
  "use strict";

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var ChromecastCaptionsPlugin = function (_ChromecastPlugin) {
    _inherits(ChromecastCaptionsPlugin, _ChromecastPlugin);

    var _super = _createSuper(ChromecastCaptionsPlugin);

    function ChromecastCaptionsPlugin(core) {
      var _this;

      _classCallCheck(this, ChromecastCaptionsPlugin);

      _this = _super.call(this, core);
      _this.activeTrackId = -1;
      return _this;
    }

    _createClass(ChromecastCaptionsPlugin, [{
      key: "containerChanged",
      value: function containerChanged() {
        _get(_getPrototypeOf(ChromecastCaptionsPlugin.prototype), "containerChanged", this).call(this);

        if (this.container) {
          this.listenTo(this.container, Clappr.Events.CONTAINER_READY, this.containerReady);
          this.listenTo(this.container, Clappr.Events.CONTAINER_SUBTITLE_CHANGED, this.subtitleChanged);
        }
      }
    }, {
      key: "containerReady",
      value: function containerReady() {
        this.initializeTextTracks();
      }
    }, {
      key: "initializeTextTracks",
      value: function initializeTextTracks() {
        var textTracks = this.container.closedCaptionsTracks; // [{id, name, track}]

        if (!textTracks || !textTracks.length) return;

        for (var i = 0; i < textTracks.length; i++) {
          if (textTracks[i].track.mode === 'showing') return;
        } // turn on the first subtitles text track (which is always "Disabled") to display the "CC" icon/menu in the media-control panel


        textTracks[0].track.mode = 'showing';
      }
    }, {
      key: "loadMedia",
      value: function loadMedia() {
        var _this2 = this;

        this.container.pause();
        var src = this.container.options.src;
        Clappr.Log.debug(this.name, 'loading... ' + src);
        var mediaInfo = this.createMediaInfo(src);
        var request = new chrome.cast.media.LoadRequest(mediaInfo);
        request.autoplay = true;
        request.activeTrackIds = this.activeTrackIds;

        if (this.currentTime) {
          request.currentTime = this.currentTime;
        }

        this.session.loadMedia(request, function (mediaSession) {
          return _this2.loadMediaSuccess('loadMedia', mediaSession);
        }, function (e) {
          return _this2.loadMediaError(e);
        });
      }
    }, {
      key: "createMediaInfo",
      value: function createMediaInfo(src) {
        var mediaInfo = new chrome.cast.media.MediaInfo(src);
        var mimeType = ChromecastPlugin.mimeTypeFor(src);
        var metadata = this.createMediaMetadata();
        var tracks = this.createMediaTracks();
        mediaInfo.contentType = this.options.contentType || mimeType;
        mediaInfo.customData = this.options.customData;
        mediaInfo.metadata = metadata;
        mediaInfo.tracks = tracks;
        return mediaInfo;
      }
    }, {
      key: "createMediaTracks",
      value: function createMediaTracks() {
        var externalTracks = this.externalTracks;
        if (!externalTracks.length) return null;
        var textTracks = this.container.closedCaptionsTracks; // [{id, name, track}]

        if (!textTracks || !Array.isArray(textTracks) || textTracks.length < externalTracks.length) return null; // UNSAFE ASSUMPTIONS:
        //  1. textTracks[i] corresponds to externalTracks[i]

        return externalTracks.map(function (externalTrack, index) {
          var textTrack = textTracks[index];
          var track = new chrome.cast.media.Track(textTrack.id, chrome.cast.media.TrackType.TEXT);
          track.trackContentId = externalTrack.src;
          track.trackContentType = ChromecastCaptionsPlugin.subtitleMimeTypeFor(externalTrack.src);
          track.subtype = chrome.cast.media.TextTrackType.SUBTITLES;
          track.language = externalTrack.lang || textTrack.track.language;
          track.name = externalTrack.label || textTrack.name;
          track.customData = null;
          return track;
        });
      }
    }, {
      key: "subtitleChanged",
      value: function subtitleChanged(track) {
        this.activeTrackId = track.id;
        if (!this.session || !this.mediaSession) return;
        var request = new chrome.cast.media.EditTracksInfoRequest(this.activeTrackIds);
        this.mediaSession.editTracksInfo(request);
      }
    }, {
      key: "loadMediaSuccess",
      value: function loadMediaSuccess(how, mediaSession) {
        var _this3 = this;

        _get(_getPrototypeOf(ChromecastCaptionsPlugin.prototype), "loadMediaSuccess", this).call(this, how, mediaSession); // monkey patch ChromecastPlayback


        var externalTracks = this.externalTracks;
        if (!externalTracks.length) return;
        externalTracks = externalTracks.map(function (externalTrack, index) {
          return {
            id: index,
            name: externalTrack.label,
            track: {
              id: "",
              mode: index === _this3.activeTrackId ? "showing" : "disabled",
              kind: externalTrack.kind,
              label: externalTrack.label,
              language: externalTrack.lang
            }
          };
        });
        Object.defineProperty(this.playbackProxy, "hasClosedCaptionsTracks", {
          configurable: false,
          enumerable: false,
          writable: false,
          value: true
        });
        Object.defineProperty(this.playbackProxy, "closedCaptionsTracks", {
          configurable: false,
          enumerable: false,
          writable: false,
          value: externalTracks
        });
        Object.defineProperty(this.playbackProxy, "closedCaptionsTrackId", {
          configurable: false,
          enumerable: false,
          get: function get() {
            return _this3.activeTrackId;
          },
          set: function set(id) {
            if (id === _this3.activeTrackId) return;
            _this3.activeTrackId = id;

            _this3.playbackProxy.trigger(Clappr.Events.PLAYBACK_SUBTITLE_CHANGED, {
              id: id
            });
          }
        });
        this.playbackProxy.trigger(Clappr.Events.PLAYBACK_SUBTITLE_AVAILABLE);
      }
    }, {
      key: "externalTracks",
      get: function get() {
        var externalTracks = this.core.options.externalTracks || (this.core.options.playback ? this.core.options.playback.externalTracks : null);
        if (!externalTracks || !Array.isArray(externalTracks) || !externalTracks.length) return [];
        externalTracks = externalTracks.filter(function (track) {
          return track.kind === 'subtitles';
        });
        if (!externalTracks.length) return [];
        return externalTracks;
      }
    }, {
      key: "activeTrackIds",
      get: function get() {
        var trackId = !this.session || !this.mediaSession ? this.container.closedCaptionsTrackId : this.activeTrackId;
        return trackId >= 0 ? [trackId] : [];
      }
    }], [{
      key: "subtitleMimeTypeFor",
      value: function subtitleMimeTypeFor(url) {
        if (!ChromecastCaptionsPlugin.FILE_EXTENSION_PATTERN.test(url)) return null;
        var ext = url.replace(ChromecastCaptionsPlugin.FILE_EXTENSION_PATTERN, '$1');
        return ChromecastCaptionsPlugin.MIMETYPES[ext] ? ChromecastCaptionsPlugin.MIMETYPES[ext] : null;
      }
    }]);

    return ChromecastCaptionsPlugin;
  }(ChromecastPlugin);

  _defineProperty(ChromecastCaptionsPlugin, "MIMETYPES", {
    ".vtt": "text/vtt",
    // WebVTT
    ".srt": "application/x-subrip",
    // SubRip
    ".ttml": "application/ttml+xml",
    // Timed Text
    ".cap": "application/x-cheetah-cap",
    // Cheetah
    ".scc": "text/x-scc",
    // Scenarist
    ".dxfp": "application/ttaf+xml",
    // DXFP (Netflix)
    ".mcc": "text/x-mcc",
    // MacCaption (Adobe)
    ".stl": "text/x-stl",
    // Spruce
    ".qt.txt": "application/x-quicktime-timedtext" // Quicktime Timed Text

  });

  _defineProperty(ChromecastCaptionsPlugin, "FILE_EXTENSION_PATTERN", /^.*?((?:\.[^\.\/]+)+)([\?#].*)?$/i);

  window.ChromecastCaptionsPlugin = ChromecastCaptionsPlugin;
})();

//# sourceMappingURL=clappr-chromecast-captions-plugin.js.map