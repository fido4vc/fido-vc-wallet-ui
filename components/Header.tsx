import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { clearAuth, getUser, getWalletId } from '@/lib/storage';
import { useEffect, useState } from 'react';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState<{ username: string; walletId: string } | null>(null);

  const handleLogout = async () => {
    clearAuth();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const username = getUser()?.username || 'Unknown User';
    const walletId = getWalletId() || 'No Wallet';
    setUserData({ username, walletId });
  }, []);
  return (
    <header className="px-12 flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 shadow-sm">
      <nav className="flex gap-4">
        <Link
          href="/did"
          className={`text-sm font-medium ${isActive('/did') ? 'text-blue-600' : 'text-gray-600'
            } hover:underline`}
          aria-label="Navigate to DID"
        >
          DID
        </Link>
        <Link
          href="/credentials"
          className={`text-sm font-medium ${isActive('/credentials') ? 'text-blue-600' : 'text-gray-600'
            } hover:underline`}
          aria-label="Navigate to Credentials"
        >
          Credentials
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600" aria-label="Logged in user">
          {userData && `${userData.username} (${userData.walletId})`}
        </span>
        <Button onClick={handleLogout} variant="destructive" aria-label="Logout">
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;