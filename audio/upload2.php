<?php
  
  if(!isset($_SESSION)) { session_start(); }

  $word = '';
  $mode = '';
  if( isset($_POST['word']) ) { $word = $_POST['word']; } else die("no word");
  if( isset($_POST['mode']) and ( $_POST['mode'] == 'training' or $_POST['mode'] == 'dict' )) { $mode = $_POST['mode']; } else die("wrong mode");
  if( isset($_POST['id']) and is_numeric($_POST['id']) ) { $id = $_POST['id']; } else die("wrong id");

    $save_folder = dirname(__FILE__) . "/audio";
    if(! file_exists($save_folder)) {
      if(! mkdir($save_folder)) {
        die("failed to create save folder $save_folder");
      }
    }

    function valid_wav_file($file) {
      $handle = fopen($file, 'r');
      $header = fread($handle, 4);
      list($chunk_size) = array_values(unpack('V', fread($handle, 4)));
      $format = fread($handle, 4);
      fclose($handle);
      return $header == 'RIFF' && $format == 'WAVE' && $chunk_size == (filesize($file) - 8);
    }

    if(isset($_SESSION['MY_ID'])) $mid = $_SESSION['MY_ID'];
    else $mid = "0";

    $milis = round(microtime(true) * 10000);

    $key = 'filename';
    $tmp_name = $_FILES["upload_file"]["tmp_name"][$key];
    $upload_name = $_FILES["upload_file"]["name"][$key];
    $type = $_FILES["upload_file"]["type"][$key];

    $help = $word."_".$milis."_".$mid."_".$upload_name;

    $filename = $save_folder."/".$help;
    $help = "audio/audio/".$help;

    $saved = 0;
    if($type == 'audio/wav' && preg_match('/^[a-zA-Z0-9_\-]+\.wav$/', $upload_name) && valid_wav_file($tmp_name)) {
      $saved = move_uploaded_file($tmp_name, $filename) ? 1 : 0;
    }

    if($_POST['format'] == 'json') {
      header('Content-type: application/json');
      echo json_encode(array("saved"=>$help,"mode"=>$mode,"id"=>$id),JSON_NUMERIC_CHECK|JSON_UNESCAPED_UNICODE);

    } else { print $saved ? "Saved" : 'Not saved'; }
    exit;
?>
