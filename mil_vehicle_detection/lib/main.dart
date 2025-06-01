// main.dart
import 'package:flutter/material.dart';
import 'package:fullflutter/screens/yolo_video_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const YoloApp());
}

class YoloApp extends StatelessWidget {
  const YoloApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Real-Time YOLO Detection',
      theme: ThemeData.dark(),
      home: const YoloVideoScreen(),
    );
  }
}