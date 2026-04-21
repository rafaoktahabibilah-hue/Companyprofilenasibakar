import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'login_page.dart';

// --- NAVIGASI UTAMA (DENGAN LOGOUT) ---
class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _selectedIndex = 0;
  final List<Widget> _pages = [
    const HomePage(),
    const Center(child: Text("Search Page")),
    const Center(child: Text("Library Page")),
    const Center(child: Text("History Page")),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        type: BottomNavigationBarType.fixed,
        backgroundColor: const Color(0xFF1A1A1A),
        selectedItemColor: Colors.blueAccent,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_filled),
            label: "Beranda",
          ),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: "Search"),
          BottomNavigationBarItem(
            icon: Icon(Icons.library_books),
            label: "Library",
          ),
          BottomNavigationBarItem(icon: Icon(Icons.history), label: "History"),
        ],
      ),
    );
  }
}

// --- HALAMAN BERANDA ---
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  // Fungsi Logout
  Future<void> logOut(BuildContext context) async {
    await FirebaseAuth.instance.signOut();
    if (context.mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginPage()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "MANGACANS",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.blueAccent,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.redAccent),
            onPressed: () => logOut(context), // Tombol Logout
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.all(15.0),
              child: Text(
                "Update Terbaru",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
            ),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 15),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.65,
                crossAxisSpacing: 15,
                mainAxisSpacing: 15,
              ),
              itemCount: 4,
              itemBuilder: (context, index) {
                return Column(
                  children: [
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: Image.network(
                          "https://picsum.photos/seed/${index + 12}/200/300",
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      "Manga Title $index",
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
