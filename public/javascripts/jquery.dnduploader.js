(function( $ ){
  if (document.images) {
    var img = new Image();
    img.src = "../images/success.png";
  }

  $("#send_btn").click(function(){
    console.log($('#temp_filename').val());
    console.log($('#tweet_caption').val());
    util.showLoading();
    $.ajax({
      url: '/droptweet',
      type: 'POST',
      data: {
        image_filename: $('#temp_filename').val(),
        caption: $('#tweet_caption').val()
      },
      success: function(data) {
        if (data.status == 'ok') {
          console.log(data.res);
          $(".success_msg").attr("href", "https://twitter.com/#!/droptweett/status/"+ data.res);
        } else {
          console.log("fail");
        }
        util.resetTweetForm();
        util.hideLoading();
        util.showSuccessPage();
      }
    });
  });

  var util = {
    progressWidth : 500,

    showLoading : function() {
      $('#logo').effect("bounce", { times: 3 }, 300);
      window.loadingInt = setInterval(function() {$('#logo').effect("bounce", { times: 3 }, 300)}, 1500);
      $('#tweet_interface').animate({opacity: 0.5});
    },

    hideLoading : function() {
      clearInterval(window.loadingInt);
      $('#tweet_interface').css('opacity', 1);
    },

    resetTweetForm : function() {
      $('#tweet_interface').fadeOut(function() {
        $('#dropped_image img').remove();
        $('#temp_filename').val('');
        $('#tweet_caption').val('');
      });
      //setTimeout(function() { $('#msg_box').empty() }, 5000);
    },

    showSuccessPage : function() {
      $('#logo').hide();
      $('#success_section').fadeIn(); 
    },
    
    hideSuccessPage : function() {
      $('#success_section').hide();
      $('#logo').show();
    },

    readAndRender : function(file) {
      $('#tweet_interface').show();
      util.hideSuccessPage();
      if (file.type.match('image.*')) {
        var reader = new FileReader();

        reader.onload = (function(theFile) {
          return function(e) {
            imageHtml = ['<img class="thumb" src="', e.target.result,
                         '" title="', theFile.name, '"/>'].join('');
            $('#dropped_image').html(imageHtml);
          };
        })(file);

        reader.onloadend = function(evt) {
          var progressWidth = 500;

          if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            util.initialProgressBar();

            var xhr = jQuery.ajaxSettings.xhr();
            var upload = xhr.upload;
            xhr.upload.addEventListener('progress', function(e) {util.updateProgressBar(e)}, false);
            util.uploadImage(xhr, file);
          }
        };

        reader.readAsDataURL(file);
      }
    },
    
    uploadImage : function(xhr, file) {
      var provider = function () {
        return xhr;
      };
      
      var fd = new FormData();
      fd.append('tweet_file', file);
      
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
          console.log("error when uploading the image.");
        }, 
        data: fd
      });
    },

    initialProgressBar : function() {
      var img = new Image();
      img.src = $('#dropped_image img.thumb').attr('src');
      img.onload = function() { 
        var h = Math.round(util.progressWidth * img.height / img.width);  
        $('#progress_bar').css({width: util.progressWidth + 'px', height: h+'px'});
      };
    },
    
    updateProgressBar : function(e) {
      var progressWidth = util.progressWidth;

      if (e.total && e.loaded) {
        var proportion = e.loaded / e.total;
        var width      = progressWidth - Math.round(proportion * progressWidth);
        $('#progress_bar').animate(
          {width: width + 'px'}, 500, function() {
            if (width == 0) {
              $('.caption_container').delay(500).fadeIn();
            }
        });
      }
    },

    hideDropSection : function() {
      $('#drop_section').hide();
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
          util.hideDropSection();
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
