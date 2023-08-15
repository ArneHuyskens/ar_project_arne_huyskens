import 'package:flutter/material.dart';
import '../widgets/armultipletargets.dart';

class ArDinoPage extends StatefulWidget {
  const ArDinoPage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() => _ArDinoPageState();
}

class _ArDinoPageState extends State<ArDinoPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Dino's"),
      ),
      body: const Center(
          // Here we load the Widget with the AR Dino experience
          child: ArMultipleTargetsWidget()),
    );
  }
}