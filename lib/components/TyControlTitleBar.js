
var Component = videojs.getComponent("Component");

// The videojs.extend function is used to assist with inheritance. In
// an ES6 environment, `class TitleBar extends Component` would work
// identically.
var TyControlTitleBar = videojs.extend(Component, {
  // The constructor of a component receives two arguments: the
  // player it will be associated with and an object of options.
  constructor: function TyControlTitleBar(player, options) {
    // It is important to invoke the superclass before anything else,
    // to get all the features of components out of the box!
    Component.apply(this, arguments);

    // If a `text` option was passed in, update the text content of
    // the component.
    if (options.text) {
      this.updateTextContent(options.text.join(" | "));
    }

    this.on("text",(component, data)=>{
      this.options_.text = data;
      videojs.dom.textContent(component.target, this.options_.text.join(" | "));
    });

    this.on("pushText",(component, data)=>{
      this.options_.text.push(data);
      videojs.dom.textContent(component.target, this.options_.text.join(" | "));
    });

    this.on("popText",(component)=>{
      this.options_.text.pop();
      videojs.dom.textContent(component.target, this.options_.text.join(" | "));
    });
  },

  // The `createEl` function of a component creates its DOM element.
  createEl: function() {
    return videojs.dom.createEl("div", {
      // Prefixing classes of elements within a player with "vjs-"
      // is a convention used in Video.js.
      className: "vjs-control-title-bar"
    });
  },

  // This function could be called at any time to update the text
  // contents of the component.
  updateTextContent: function(text) {
    // If no text was provided, default to "Title Unknown"
    if (typeof text !== "string") {
      text = "Title Unknown";
    }

    // Use Video.js utility DOM methods to manipulate the content
    // of the component's element.
    videojs.dom.emptyEl(this.el());
    videojs.dom.appendContent(this.el(), text);
  }
});

// Register the component with Video.js, so it can be used in players.
videojs.registerComponent("TyControlTitleBar", TyControlTitleBar);
