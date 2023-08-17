import 'package:flutter/material.dart';
import '../widgets/arleagueoflegendschampions.dart';

class ArChampionPage extends StatefulWidget {
  const ArChampionPage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() => _ArChampionPageState();
}

class _ArChampionPageState extends State<ArChampionPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Champions"),
      ),
      body: const Center(
          child: ArChampionsWidget()),
    );
  }
}