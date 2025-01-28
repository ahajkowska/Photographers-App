import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="homepage">
      <h1>Welcome to Photographer's App!</h1>
      <p>Manage your projects, discover inspiration, and more!</p>
      <button className="get-started-button"><Link href="/login">Login</Link></button>
      <button className="get-started-button"><Link href="/register">Register</Link></button>
    </div>
  );
}
