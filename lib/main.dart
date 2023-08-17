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
        primarySwatch: Colors.orange,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const HomePage(),
    );
  }
}