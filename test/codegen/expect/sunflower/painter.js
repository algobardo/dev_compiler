dart.library('painter', null, /* Imports */[
  'dart/math',
  'dom',
  'dart/core',
  'circle'
], /* Lazy imports */[
], function(exports, math, dom, core, circle) {
  'use strict';
  let ORANGE = "orange";
  let RED = "red";
  let BLUE = "blue";
  let TAU = dart.notNull(math.PI) * 2;
  function querySelector(selector) {
    return dom.document.querySelector(selector);
  }
  dart.fn(querySelector, dom.Element, [core.String]);
  dart.defineLazyProperties(exports, {
    get canvas() {
      return dart.as(querySelector("#canvas"), dom.CanvasElement);
    },
    get context() {
      return dart.as(exports.canvas.getContext('2d'), dom.CanvasRenderingContext2D);
    }
  });
  class CirclePainter extends core.Object {
    CirclePainter() {
      this.color = ORANGE;
    }
    draw(context) {
      context.beginPath();
      context.lineWidth = 2;
      context.fillStyle = this.color;
      context.strokeStyle = this.color;
      context.arc(this.x, this.y, this.radius, 0, TAU, false);
      context.fill();
      context.closePath();
      context.stroke();
    }
  }
  CirclePainter[dart.implements] = () => [circle.Circle];
  dart.setSignature(CirclePainter, {
    methods: () => ({draw: [dart.void, [dom.CanvasRenderingContext2D]]})
  });
  // Exports:
  exports.ORANGE = ORANGE;
  exports.RED = RED;
  exports.BLUE = BLUE;
  exports.TAU = TAU;
  exports.querySelector = querySelector;
  exports.CirclePainter = CirclePainter;
});
