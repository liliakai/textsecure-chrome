var Whisper = Whisper || {};

(function () {
  'use strict';

  Whisper.Message  = Backbone.Model.extend();
  Whisper.Messages = new (Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage("Messages"),
    model: Whisper.Message,
    comparator: 'timestamp'
  }))();

})()
