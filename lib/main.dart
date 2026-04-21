import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'pages/login_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    // Kita panggil Firebase secara sederhana saja
    await Firebase.initializeApp();
  } catch (e) {
    print("Firebase Error: $e");
  }
  runApp(const MangacansApp());
}

class MangacansApp extends StatelessWidget {
  const MangacansApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: Colors.blueAccent,
      ),
      home: const LoginPage(),
    );
  }
}
