// yolo_video_screen.dart
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:fullflutter/services/camera_service.dart';
import 'package:fullflutter/services/tts_service.dart';
import 'package:fullflutter/services/yolo_service.dart';


class YoloVideoScreen extends StatefulWidget {
  const YoloVideoScreen({super.key});

  @override
  State<YoloVideoScreen> createState() => _YoloVideoScreenState();
}

class _YoloVideoScreenState extends State<YoloVideoScreen> {
  final CameraService _cameraService = CameraService();
  final YoloService _yoloService = YoloService();
  final TtsService _ttsService = TtsService();

  List<Map<String, dynamic>> _yoloResults = [];
  bool _isDetecting = false;
  CameraImage? _currentImage;

  @override
  void initState() {
    super.initState();
    _initializeServices();
  }

  Future<void> _initializeServices() async {
    await _cameraService.initializeCamera();
    await _yoloService.loadModel();
    if (mounted) setState(() {});
  }

  Future<void> _toggleDetection() async {
    if (_isDetecting) {
      await _stopDetection();
    } else {
      await _startDetection();
    }
  }

  Future<void> _startDetection() async {
    setState(() => _isDetecting = true);
    await _cameraService.startStreaming(_processCameraImage);
  }

  Future<void> _stopDetection() async {
    setState(() {
      _isDetecting = false;
      _yoloResults.clear();
    });
    await _cameraService.stopStreaming();
    await _ttsService.stopSpeaking();
  }

  Future<void> _processCameraImage(CameraImage image) async {
    if (!_isDetecting) return;
    
    _currentImage = image;
    final results = await _yoloService.processFrame(image);
    
    if (results.isNotEmpty) {
      setState(() => _yoloResults = results);
      _ttsService.speakDetection(results.first['tag']);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!_cameraService.isInitialized) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      body: Stack(
        children: [
          _buildCameraPreview(),
          ..._buildDetectionBoxes(context),
          _buildControlButton(),
        ],
      ),
    );
  }

  Widget _buildCameraPreview() {
    return AspectRatio(
      aspectRatio: _cameraService.controller.value.aspectRatio,
      child: CameraPreview(_cameraService.controller),
    );
  }

  Widget _buildControlButton() {
    return Positioned(
      bottom: 40,
      left: 0,
      right: 0,
      child: Center(
        child: GestureDetector(
          onTap: _toggleDetection,
          child: Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: Colors.white,
                width: 4,
              ),
            ),
            child: Icon(
              _isDetecting ? Icons.stop : Icons.play_arrow,
              color: _isDetecting ? Colors.red : Colors.white,
              size: 50,
            ),
          ),
        ),
      ),
    );
  }

  List<Widget> _buildDetectionBoxes(BuildContext context) {
    if (_yoloResults.isEmpty || _currentImage == null) return [];
    
    final screenSize = MediaQuery.of(context).size;
    final orientation = _cameraService.getCurrentOrientation(context);
    
    double factorX = screenSize.width / _currentImage!.height;
    double factorY = screenSize.height / _currentImage!.width;

    if (orientation == Orientation.landscape) {
      factorX = screenSize.width / _currentImage!.width;
      factorY = screenSize.height / _currentImage!.height;
    }

return _yoloResults.map((result) {
  final rect = result['box'];
  return Positioned(
    left: rect[0] * factorX,
    top: rect[1] * factorY,
    width: (rect[2] - rect[0]) * factorX,
    height: (rect[3] - rect[1]) * factorY,
    child: Container(
      decoration: BoxDecoration(
        border: Border.all(color: Colors.blue, width: 2),
      ),
      child: Text(
        "${result['tag']} ${(rect[4] * 100).toStringAsFixed(1)}%",
        style: const TextStyle(
          color: Colors.white,
          backgroundColor: Colors.black54,
          fontSize: 14,
        ),
      ),
    ),
  );
}).toList();
  }

  @override
  Future<void> dispose() async {
    await _cameraService.dispose();
    await _yoloService.disposeModel();
    await _ttsService.dispose();
    super.dispose();
  }
}