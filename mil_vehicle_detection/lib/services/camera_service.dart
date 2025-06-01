// camera_service.dart
import 'package:camera/camera.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class CameraService {
  late CameraController _controller;
  List<CameraDescription> _cameras = [];
  bool _isInitialized = false;

  Future<void> initializeCamera() async {
    _cameras = await availableCameras();
    _controller = CameraController(_cameras[0], ResolutionPreset.ultraHigh);
    await _controller.initialize();
    _isInitialized = true;
  }

  CameraController get controller => _controller;
  bool get isInitialized => _isInitialized;

  Future<void> startStreaming(Function(CameraImage) onImageAvailable) async {
    if (!_isInitialized) return;
    await _controller.startImageStream(onImageAvailable);
  }

  Future<void> stopStreaming() async {
    if (!_isInitialized) return;
    await _controller.stopImageStream();
  }

  Future<void> dispose() async {
    if (!_isInitialized) return;
    await _controller.dispose();
    _isInitialized = false;
  }

  Orientation getCurrentOrientation(BuildContext context) {
    return MediaQuery.of(context).orientation;
  }
}