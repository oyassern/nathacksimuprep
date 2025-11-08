export const metadata = {
  title: 'MCQ Generator',
  description: 'Generate simple MCQs and store in Supabase',
};

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <nav className="container mx-auto flex gap-4 p-3">
            <a href="/">Home</a>
            <a href="/questions">View Questions</a>
          </nav>
        </header>
        <main className="container mx-auto p-4 max-w-3xl">{children}</main>
      </body>
    </html>
  );
}
