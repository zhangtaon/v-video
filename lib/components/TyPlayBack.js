/**
 * authro zto
 * date: 2019-7-29
 * video播放器区间回放组件
 */
import "bootstrap/dist/css/bootstrap.min.css";
import "eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css";
import "expose-loader?jQuery!jquery";
import "bootstrap";
import "eonasdan-bootstrap-datetimepicker";
import { playbackTmplService, clearDateTime } from "./playbackService";
import $ from "jquery";

// this.player.controlBar.childNameIndex_.playBack;

var Component = videojs.getComponent("Component");

// The videojs.extend function is used to assist with inheritance. In
// an ES6 environment, `class TitleBar extends Component` would work
// identically.

var TyPlayBack = videojs.extend(Component, {
  // The constructor of a component receives two arguments: the
  // player it will be associated with and an object of options.
  constructor: function TyPlayBack(player, options) {
    // It is important to invoke the superclass before anything else,
    // to get all the features of components out of the box!
    Component.apply(this, arguments);
    this.player = player;
    this.options = options;
    this.tmpl = playbackTmplService(player);
  },

  // The `createEl` function of a component creates its DOM element.
  createEl: function() {
    var ele = videojs.dom.createEl("span", {
      // Prefixing classes of elements within a player with "vjs-"
      // is a convention used in Video.js.
      className: "vjs-control vjs-date-time"
    });

    $(ele).popover({
      html: true,
      content: () => {
        return this.tmpl;
      },
      placement: "top"
    });
    return ele;
  }
});

// Register the component with Video.js, so it can be used in players.
videojs.registerComponent("TyPlayBack", TyPlayBack);
