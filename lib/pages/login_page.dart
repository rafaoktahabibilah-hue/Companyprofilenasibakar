import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'home_page.dart';
import 'register_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  // Kunci untuk validasi Form
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  // Fungsi Login
  Future<void> login() async {
    try {
      await FirebaseAuth.instance.signInWithEmailAndPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );
      if (!mounted) {
        return;
      }
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => const MainNavigation(),
        ), // Pastikan nama class Home benar
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Email atau Password salah!")),
      );
    }
  }

  // Fungsi Reset Password
  Future<void> passwordReset() async {
    try {
      if (_emailController.text.trim().isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Masukkan email kamu terlebih dahulu!")),
        );
        return;
      }
      await FirebaseAuth.instance.sendPasswordResetEmail(
        email: _emailController.text.trim(),
      );
      showDialog(
        context: context,
        builder: (context) => const AlertDialog(
          content: Text("Link reset password sudah dikirim! Cek email kamu."),
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Error: ${e.toString()}")));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(30.0),
          child: Form(
            key: _formKey, // Pasang kunci form di sini
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  "MANGACANS",
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.blueAccent,
                  ),
                ),
                const SizedBox(height: 40),

                // Input Email
                TextFormField(
                  controller: _emailController,
                  decoration: const InputDecoration(
                    labelText: "Email",
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty)
                      return 'Email tidak boleh kosong';
                    if (!value.contains('@'))
                      return 'Gunakan format email yang benar';
                    return null;
                  },
                ),
                const SizedBox(height: 15),

                // Input Password
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
                    if (value.length < 6)
                      return 'Password is too short! (Min 6)';
                    if (value.length > 20)
                      return 'Password is too long! (Max 20)';
                    return null;
                  },
                ),

                // Tombol Forgot Password
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: passwordReset,
                    child: const Text("Forgot Password?"),
                  ),
                ),

                const SizedBox(height: 20),

                // Tombol Login
                ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      login();
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 50),
                    backgroundColor: Colors.blueAccent,
                  ),
                  child: const Text(
                    "LOGIN",
                    style: TextStyle(color: Colors.white),
                  ),
                ),

                TextButton(
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const RegisterPage(),
                    ),
                  ),
                  child: const Text("Belum punya akun? Daftar sekarang"),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
