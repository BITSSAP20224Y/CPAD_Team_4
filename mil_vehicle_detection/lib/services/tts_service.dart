// tts_service.dart
import 'package:flutter_tts/flutter_tts.dart';

class TtsService {
  final FlutterTts _tts = FlutterTts();
  String _previousResult = '';
  DateTime _previousSpeechTime = DateTime.now();
  final Duration _repeatDuration = const Duration(seconds: 5);

  Future<void> speakDetection(String result) async {
    final currentTime = DateTime.now();
    
    if (result != _previousResult || 
        currentTime.difference(_previousSpeechTime) >= _repeatDuration) {
      await _tts.speak(result);
      _previousResult = result;
      _previousSpeechTime = currentTime;
    }
  }

  Future<void> stopSpeaking() async {
    await _tts.stop();
  }

  Future<void> dispose() async {
    await _tts.stop();
  }
}