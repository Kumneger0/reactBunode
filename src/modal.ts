import * as tingle from "tingle.js";

var modal = new tingle.modal({
  footer: true,
  stickyFooter: false,
  closeMethods: ["overlay", "button", "escape"],
  closeLabel: "Close",
  cssClass: ["custom-class-1", "custom-class-2"],
  onOpen: function () {
    console.log("modal open");
  },
  onClose: function () {
    console.log("modal closed");
  },
  beforeClose: function () {
    // here's goes some logic
    // e.g. save content before closing the modal
    return true; // close the modal
    return false; // nothing happens
  },
});

modal.setContent("<h1 style = 'color:white'>here's some content</h1>");

modal.open();
