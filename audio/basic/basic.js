$(function () {

  var RECORDER_APP_ID = "recorderApp";
  var $level = $('.level .progressbar');

  var appWidth = 24;
  var appHeight = 24;
  var flashvars = {'upload_image': 'audio/images/upload.png'};
  var params = {};
  var attributes = {'id': RECORDER_APP_ID, 'name': RECORDER_APP_ID};
  swfobject.embedSWF("audio/recorder.swf", "flashcontent", appWidth, appHeight, "11.0.0", "", flashvars, params, attributes);

  window.fwr_event_handler = function fwr_event_handler() {
    var name, $controls;
    switch (arguments[0]) {
      case "ready":
        FWRecorder.uploadFormId = "#uploadForm";
        FWRecorder.uploadFieldName = "upload_file[filename]";
        FWRecorder.connect(RECORDER_APP_ID, 0);
        FWRecorder.recorderOriginalWidth = appWidth;
        FWRecorder.recorderOriginalHeight = appHeight;
        break;

      case "microphone_user_request":
        FWRecorder.showPermissionWindow();
        break;

      case "permission_panel_closed":
        FWRecorder.defaultSize();
        break;

      case "recording":
        FWRecorder.hide();
        FWRecorder.observeLevel();
        break;

      case "recording_stopped":
        FWRecorder.show();
        FWRecorder.stopObservingLevel();
        $level.css({height: 0});
        break;

      case "microphone_level":
        $level.css({height: arguments[1] * 100 + '%'});
        break;

      case "save_pressed":
        FWRecorder.updateForm();
        break;

      case "saving":
        name = arguments[1];
        console.info('saving started', name);
        break;

      case "saved":
        name = arguments[1];
        var response = JSON.parse(arguments[2]);
        var id = response.id;
        var check = null;

        for(var i in _AUDIO_D) {
          var o = _AUDIO_D[i].id;
          if(id == o) check = i;
        }
        if(check) _AUDIO_D.splice(check,1);
        console.log(check);

        if(response.mode == "dict") _AUDIO_D.push( { id : response.id, saved : response.saved } );
        else if(response.mode == "training") _AUDIO_T[0] = response.saved;

        console.log( _AUDIO_T, _AUDIO_D );
        break;

      case "save_failed":
        name = arguments[1];
        var errorMessage = arguments[2];
        console.info('saving failed', name, errorMessage);
        break;

      case "save_progress":
        name = arguments[1];
        var bytesLoaded = arguments[2];
        var bytesTotal = arguments[3];
        console.info('saving progress', name, bytesLoaded, '/', bytesTotal);
        break;
    }
  };


  function recorderEl() {
    return $('#' + RECORDER_APP_ID);
  }

});