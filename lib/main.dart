import 'package:flutter/material.dart';
import './pages/home.dart';

void main() {
  runApp(const MyFlutterArApp());
}

class MyFlutterArApp extends StatelessWidget {
  const MyFlutterArApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'AR Project Arne Huyskens',
      theme: ThemeData(
        primaryColor: const Color(0xFFE21F30), // League of Legends red
        colorScheme: const ColorScheme.dark(
          secondary: Color(0xFF1C1D21), // League of Legends black
        ),
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const HomePage(),
    );
  }
}