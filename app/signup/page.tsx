"use client"

import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"
import { usePrivy } from '@privy-io/react-auth';
import { CheckCircle, Wallet, Mail } from 'lucide-react'; // Added icons for better clarity
import ClientAvailSection from "@/components/availNexus/ClientAvailSection";

// Utility function to shorten an address for display
const shortenAddress = (address: string) => {
  if (!address) return "N/A";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export default function SignupPage() {
  const { connectWallet, isConnected, address } = useUser();
  const { ready, authenticated, user, login, logout } = usePrivy();

  const handlePrivy = async () => {
    if (!ready) return alert("Privy is still loading...");
    if (authenticated) {
      // User is already logged in via Privy, no need to show an alert modal
      // We can optionally use a toast/notification here instead of a browser alert
      console.log("Already logged in via Privy.");
      return;
    }

    try {
      login(); // Opens the Privy modal
    } catch (err) {
      console.error("Privy login failed:", err);
    }
  };

  // --- State Check Variables ---
  const isAuthenticated = authenticated || isConnected;
  const privyWalletAddress = user?.wallet?.address;
  const privyEmail = user?.email?.address;
  
  // --- Determine the main content to display ---
  let mainContent;

  if (!ready) {
    // Privy SDK is still loading
    mainContent = (
      <p className="text-center text-lg text-muted-foreground">Loading authentication services...</p>
    );
  } else if (isAuthenticated) {
    // --- AUTHENTICATED/CONNECTED STATE ---
    mainContent = (
      <div className="flex flex-col items-center p-8 bg-black border border-gray-200 rounded-lg shadow-lg">
        <CheckCircle className="w-10 h-10 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-center">
          You are successfully authenticated!
        </h2>
        <p className="text-md text-muted-foreground mb-6 text-center">
          Your account is connected and ready to use.
        </p>

        <div className="w-full max-w-sm space-y-3">
          {/* Display Privy Details */}
          {authenticated && (
            <>
              {privyEmail && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <Mail className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="truncate ml-2">{privyEmail}</span>
                </div>
              )}
              {privyWalletAddress && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <Wallet className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-700">Embedded Wallet:</span>
                  <span className="font-mono text-sm truncate ml-2">
                    {shortenAddress(privyWalletAddress)}
                  </span>
                </div>
              )}
            </>
          )}

          {/* Display External Wallet Details */}
          {isConnected && address && (
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border-2 border-primary">
              <Wallet className="w-5 h-5 text-primary mr-3" />
              <span className="font-bold text-primary">Connected Wallet:</span>
              <span className="font-mono text-sm truncate ml-2">
                {shortenAddress(address)}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons: Logout and Connect Privy (if not authenticated) */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {authenticated && (
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          )}
          {isConnected && !authenticated && (
            <Button variant="secondary" onClick={handlePrivy}>
              Continue with Privy
            </Button>
          )}

          <div className="w-full mt-8">
          <ClientAvailSection />
        </div>
        </div>
      </div>
    );
  } else {
    // --- INITIAL SIGNUP STATE ---
    mainContent = (
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-semibold mb-2 text-center">
          Create your account 🚀
        </h1>
        <p className="text-muted-foreground mb-6 text-center">
          Connect a wallet or continue with email and social login.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors" 
            onClick={connectWallet}
          >
            Connect Metamask
          </Button>
          <Button variant="secondary" onClick={handlePrivy}>
            Continue with Privy
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10 min-h-[60vh] flex items-center justify-center">
      {mainContent}
    </main>
  );
}