// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_directory ./core
//= require litjquery

ATHCLI = {
  common: {
    init: function() {
      // application-wide code
    }
  },
 
  requests: {
    init: function() {
      // controller-wide code
    },
 
    show: function() {
      // action-specific code
      var v = document.getElementById('v');
      l = $('#l');
      var canvas = document.getElementById('c');
      var context = canvas.getContext('2d');
      var canvas2 = document.getElementById('b');
      var context2 = canvas.getContext('2d');
      var back = document.createElement('canvas');
      var backcontext = back.getContext('2d');
      
      var cw,ch;

      

      $('#snap').click(function() {
        cw = v.clientWidth;
        ch = v.clientHeight;
        snapclick(v,context,backcontext,cw,ch);
      });

      function snapclick(v,c,bc,cw,ch) {
        if(v.ended) return false;
        canvas.height = ch;
        canvas.width = cw;
        canvas2.height = ch;
        canvas2.width = cw;
        
        back.width = cw;
        back.height = ch;
        l.css({ width: cw, height: ch+61 });
        // First, draw it into the backing canvas
        // bc.drawImage(v,0,0,cw,ch);
        c.fillRect(0,0,cw,ch);
        c.drawImage(v,0,0,cw,ch);
        // Pause the video after
        v.pause();
      }

      $('.literally').literallycanvas({
          imageURLPrefix: '/assets',
          preserveCanvasContents: true,
          onInit: function(lc) {

            $('[data-action=upload-to-imgur]').click(function(e) {
              e.preventDefault();
              $('.imgur-submit').html('Uploading...');
              var imgurClientId = $('.imgur-submit').attr('id');
              context.drawImage(lc.canvasForDraw(),0,0,v.clientWidth,v.clientHeight);
              // this is all bog standard Imgur API; only LC-specific thing is the
              // image data argument

              $.ajax({
                url: 'https://api.imgur.com/3/image',
                type: 'POST',
                headers: {
                  // Your application gets an imgurClientId from Imgur
                  Authorization: 'Client-ID ' + imgurClientId,
                  Accept: 'application/json'
                },
                data: {
                  image:  canvas.toDataURL().split(',')[1],
                  type: 'base64'
                },
                success: function(result) {
                  window.location = 'https://imgur.com/gallery/' + result.data.id;
                },
              });
            })

          }
        });
    }
  }
};
 
UTIL = {
  exec: function( controller, action ) {
    var ns = ATHCLI,
        action = ( action === undefined ) ? "init" : action;
 
    if ( controller !== "" && ns[controller] && typeof ns[controller][action] == "function" ) {
      ns[controller][action]();
    }
  },
 
  init: function() {
    var body = document.body,
        controller = body.getAttribute( "data-controller" ),
        action = body.getAttribute( "data-action" );
 
    UTIL.exec( "common" );
    UTIL.exec( controller );
    UTIL.exec( controller, action );
  }
};
 
$(document).ready(UTIL.init);
$(document).ajaxComplete(UTIL.init);
$(window).bind('page:change', UTIL.init);