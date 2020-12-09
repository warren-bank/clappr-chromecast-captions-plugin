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

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
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

  var HLSJS = null;

  var getInternalTracks = function getInternalTracks() {
    return !HLSJS ? [] : HLSJS.subtitleTracks.map(function (subtitleTrack) {
      return {
        kind: 'subtitles',
        src: subtitleTrack.url,
        lang: subtitleTrack.lang,
        label: subtitleTrack.name
      };
    });
  };

  {
    var HlsjsPlayback = Clappr.HLS.prototype;
    var _setup = HlsjsPlayback._setup;
    var stop = HlsjsPlayback.stop;
    var destroy = HlsjsPlayback.destroy;

    HlsjsPlayback._setup = function () {
      _setup.call(this);

      HLSJS = this._hls;
      this.trigger(Clappr.Events.PLAYBACK_READY, this.name);
    };

    HlsjsPlayback.stop = function () {
      stop.call(this);
      HLSJS = null;
    };

    HlsjsPlayback.destroy = function () {
      destroy.call(this);
      HLSJS = null;
    };
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
        var textTracks = this.container.closedCaptionsTracks;
        if (!textTracks || !textTracks.length) return;

        for (var i = 0; i < textTracks.length; i++) {
          if (textTracks[i].track.mode === 'showing') return;
        }

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
        var combinedTracks = [].concat(_toConsumableArray(this.externalTracks), _toConsumableArray(getInternalTracks()));
        if (!combinedTracks.length) return null;
        return combinedTracks.map(function (textTrack, index) {
          var track = new chrome.cast.media.Track(index, chrome.cast.media.TrackType.TEXT);
          track.trackContentId = textTrack.src;
          track.trackContentType = ChromecastCaptionsPlugin.subtitleMimeTypeFor(textTrack.src);
          track.subtype = chrome.cast.media.TextTrackType.SUBTITLES;
          track.language = textTrack.lang;
          track.name = textTrack.label;
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

        _get(_getPrototypeOf(ChromecastCaptionsPlugin.prototype), "loadMediaSuccess", this).call(this, how, mediaSession);

        var combinedTracks = [].concat(_toConsumableArray(this.externalTracks), _toConsumableArray(getInternalTracks()));
        if (!combinedTracks.length) return;
        var textTracks = combinedTracks.map(function (textTrack, index) {
          return {
            id: index,
            name: textTrack.label,
            track: {
              id: "",
              mode: index === _this3.activeTrackId ? "showing" : "disabled",
              kind: textTrack.kind,
              label: textTrack.label,
              language: textTrack.lang
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
          value: textTracks
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
        return !externalTracks || !Array.isArray(externalTracks) || !externalTracks.length ? [] : externalTracks.filter(function (track) {
          return track.kind === 'subtitles';
        });
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
    ".srt": "application/x-subrip",
    ".ttml": "application/ttml+xml",
    ".cap": "application/x-cheetah-cap",
    ".scc": "text/x-scc",
    ".dxfp": "application/ttaf+xml",
    ".mcc": "text/x-mcc",
    ".stl": "text/x-stl",
    ".qt.txt": "application/x-quicktime-timedtext"
  });

  _defineProperty(ChromecastCaptionsPlugin, "FILE_EXTENSION_PATTERN", /^.*?((?:\.[^\.\/]+)+)([\?#].*)?$/i);

  window.ChromecastCaptionsPlugin = ChromecastCaptionsPlugin;
})();

//# sourceMappingURL=clappr-chromecast-captions-plugin.js.map