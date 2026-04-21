import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  Future<void> signUp() async {
    try {
      await FirebaseAuth.instance.createUserWithEmailAndPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );
      if (!mounted) return;
      Navigator.pop(context); // Kembali ke login setelah berhasil
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Berhasil daftar! Silakan login.")),
      );
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Daftar Akun Mangacans")),
      body: Padding(
        padding: const EdgeInsets.all(25.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: "Email",
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty)
                    return 'Email wajib diisi';
                  return null;
                },
              ),
              const SizedBox(height: 15),
              TextFormField(
                controller: _passwordController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: "Password",
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty)
                    return 'Password wajib diisi';
                  if (value.length < 6) return 'Password is too short! (Min 6)';
                  if (value.length > 20)
                    return 'Password is too long! (Max 20)';
                  return null;
                },
              ),
              const SizedBox(height: 30),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    signUp();
                  }
                },
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50),
                ),
                child: const Text("DAFTAR SEKARANG"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
