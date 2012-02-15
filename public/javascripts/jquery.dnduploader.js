(function( $ ){

  $("#send_btn").click(function(){
    console.log($('#temp_filename').val());
    console.log($('#tweet_caption').val());
    $.ajax({
      url: '/droptweet',
      type: 'POST',
      data: {
        image_filename: $('#temp_filename').val(),
        caption: $('#tweet_caption').val()
      },
      success: function(data) {
        console.log("upload successfully");
      }
    });
  });

  var util = {
    readAndRender : function(file) {
      if (file.type.match('image.*')) {
        var reader = new FileReader();

        reader.onload = (function(theFile) {
          return function(e) {
            imageHtml = ['<img class="thumb" src="', e.target.result,
                         '" title="', theFile.name, '"/>'].join('');
            $('#dropped_image').html(imageHtml);
            $('#drop_target').css('border', 'none');
          };
        })(file);

        reader.onloadend = function(evt) {
          if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            var img = new Image();
            img.onload = function() { 
              var h = Math.round(400 * img.height / img.width);  
              $('#progress_bar').css({width: '400px', height: h+'px'});
            };
            img.src = $('#dropped_image img.thumb').attr('src');
            
            //var xhr = new XMLHttpRequest();
            var xhr = jQuery.ajaxSettings.xhr();
            var upload = xhr.upload;
          
            xhr.upload.addEventListener('progress', function (e) {
                if (e.total && e.loaded) {
                  var proportion = e.loaded / e.total;
                  var width      = 400 - Math.round(proportion * 400);
                  console.log('width: ' + width);
                  $('#progress_bar').animate(
                    {width: width + 'px'}, 500, function() {
                      if (width == 0) {
                        $('.caption_container').delay(500).fadeIn();
                      }
                  });
                }
              }, false);
            
            var provider = function () {
              return xhr;
            };
            /* 
            xhr.open('PUT', '/', true);
            xhr.setRequestHeader('X-Filename', file.fileName);
            xhr.send(file);

            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                console.log("success");
              }
            };
            */
            var fd = new FormData();
            fd.append('tweet_file', file);
            fd.append('tweet_caption', "drop tweet");
            
            $.ajax({
              type: 'PUT',
              url: '/',
              xhr: provider,
              cache: false,
              contentType: false,
              processData: false,
              success: function (data) {
                $('#temp_filename').val(data.temp_filename);
              },  
              error: function () {
                // ...
              }, 
              data: fd
              /*
              data: {
                name: file.name,
                size: file.size,
                type: file.type,
                data: data 
              } 
              */
            });
          }
        };

        reader.readAsDataURL(file);
      }
    }
  }

  var methods = {
    init : function( options ) {

      return this.each( function () {
      
        var $this = $(this);
        
        $.each(options, function( label, setting ) {
          $this.data(label, setting);
        });
     
        $this.bind('dragenter.dndUploader', methods.dragEnter);
        $this.bind('dragover.dndUploader', methods.dragOver);
        $this.bind('drop.dndUploader', methods.drop);
    
      });
    },
    
    dragEnter : function ( event ) {    
      event.stopPropagation();
      event.preventDefault();
      
      return false;
    },
    
    dragOver : function ( event ) {      
      event.stopPropagation();
      event.preventDefault();
                  
      return false;
    },

    drop : function( event ) {    
      event.stopPropagation();
      event.preventDefault();
      
      var $this = $(this);
      var dataTransfer = event.originalEvent.dataTransfer;
      
      if (dataTransfer.files.length > 0) {
        $.each(dataTransfer.files, function ( i, file ) {
          util.readAndRender(file);
        });
      };
            
      return false;
    }
  };
  
  $.fn.dndUploader = function( method ) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.dndUploader' );
    }
  };
})( jQuery );
