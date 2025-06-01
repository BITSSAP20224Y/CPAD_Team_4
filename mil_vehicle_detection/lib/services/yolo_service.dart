// yolo_service.dart
import 'package:camera/camera.dart';
import 'package:flutter_vision/flutter_vision.dart';

class YoloService {
  final FlutterVision _vision = FlutterVision();
  bool _isModelLoaded = false;

  Future<void> loadModel() async {
    await _vision.loadYoloModel(
      labels: 'assets/labels.txt',
      modelPath: 'assets/model.tflite',
      modelVersion: "yolov8",
      numThreads: 2,
      useGpu: true,
    );
    _isModelLoaded = true;
  }

  Future<List<Map<String, dynamic>>> processFrame(
    CameraImage image, {
    double confThreshold = 0.4,
    double iouThreshold = 0.4,
  }) async {
    if (!_isModelLoaded) return [];

    return await _vision.yoloOnFrame(
      bytesList: image.planes.map((plane) => plane.bytes).toList(),
      imageHeight: image.height,
      imageWidth: image.width,
      confThreshold: confThreshold,
      iouThreshold: iouThreshold,
    );
  }

  Future<void> disposeModel() async {
    await _vision.closeYoloModel();
    _isModelLoaded = false;
  }
}
