"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import StatsSection from "@/components/stats";

const LandingPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Redirect to role-specific analytics page
    router.push(user.role === "jailer" ? "/app/jailer/analytics" : "/app/family/analytics");
  }, [user, router]);

  // Show landing page only for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden">
        <HeroSection />
        <StatsSection />
        <FooterSection />
      </div>
    );
  }

  // Return null while redirecting
  return null;
};

export default LandingPage;