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
//= require modal

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
      // Literally canvas object
      l = $('#l');
      var canvas = document.getElementById('c');
      var context = canvas.getContext('2d');
      var lcanvas = document.getElementById('b');
      // Drawing canvas object
      b = $('#b');
      i = $('.comment-input');
      var lcontext = canvas.getContext('2d');
      var back = document.createElement('canvas');
      var backcontext = back.getContext('2d');
      
      var cw,ch;

      v.addEventListener('loadeddata', function() {
         // Video is loaded and can be played
         cw = v.clientWidth;
         ch = v.clientHeight;
         canvas.height = ch;
         canvas.width = cw;
         lcanvas.height = ch;
         lcanvas.width = cw;
         b.css({ width: cw, height: ch });
         back.width = cw;
         back.height = ch;
         l.css({ width: cw, height: ch+61 });
         i.css({ width: cw });
      }, false);

      $('#snap').click(function() {
        cw = v.clientWidth;
        ch = v.clientHeight;
        snapclick(v,context,backcontext,cw,ch);
      });

      function snapclick(v,c,bc,cw,ch) {
        if(v.ended) return false;
        canvas.height = ch;
        canvas.width = cw;
        lcanvas.height = ch;
        lcanvas.width = cw;
        b.css({ width: cw, height: ch });
        back.width = cw;
        back.height = ch;
        l.css({ width: cw, height: ch+61 });
        i.css({ width: cw });
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

            $('#imgur').unbind("click").click(function(e) {
              e.preventDefault();

              // Open modal
              $('#request_modal').modal({backdrop: 'static'});

              // Get the imgur id set using in the erb template
              var imgurClientId = $('.imgur-submit').attr('id');

              // Combine LC and screenshot before upload
              context.drawImage(lc.canvasForDraw(),0,0,v.clientWidth,v.clientHeight);

              $.ajax({
                url: 'https://api.imgur.com/3/image',
                type: 'POST',
                headers: {
                  // Your application gets an imgurClientId from Imgur
                  Authorization: 'Client-ID ' + imgurClientId,
                  Accept: 'application/json'
                },
                data: {
                  // Covert canvas image to base64
                  image:  canvas.toDataURL().split(',')[1],
                  type: 'base64'
                },
                success: function(result) {
                  // VARUN:
                  // On successful upload - scene_url is set
                  $('.scene_url').val('https://imgur.com/gallery/' + result.data.id);
                  
                  $.ajax({
                    type: "GET",
                    dataType: "script",
                    contentType: "application/json; charset=utf-8",
                    url: '/requests/request_reload.js',
                    data: { imgurl: 'https://imgur.com/' + result.data.id + '.png', request_id: $("#request_id").val(), comment: $("#comment_box").val(), timestamp: v.currentTime },
                    success: function(result) {
                      $("#comment_box").val('');
                    }
                  });


                  //return false;

                  // Image is cleared
                  $('.clear-button').click();
                  snapclick(v,context,backcontext,cw,ch);

                  // Ajax submit scene form <--- here

                  // End of successful response
                  // Close the modal
                  $('#request_modal').modal('hide');
                  
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
    
    console.log(controller+'#'+action+' executed');
    UTIL.exec( "common" );
    UTIL.exec( controller );
    UTIL.exec( controller, action );
  }
};
 
// page:change includes document.ready()   
// page:update is triggered whenever page:change is PLUS on jQuery's ajaxSucess
$(window).bind('page:update', UTIL.init);