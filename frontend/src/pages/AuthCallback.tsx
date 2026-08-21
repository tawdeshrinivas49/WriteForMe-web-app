// frontend/src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@/store/useUser";
import apiClient from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setToken } = useUser();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code || !state) {
        toast.error("Missing OAuth parameters");
        navigate("/login");
        return;
      }

      try {
        // Exchange code for token and user
        const response = await apiClient.post("/auth/digilocker/callback", { code, state });
        const { token, user, redirect } = response.data;

        setToken(token);
        setUser(user);

        // If we have pending signup data, we should update the user with that data
        // but the backend already stored everything, so we just navigate.
        toast.success("Authentication successful!");
        navigate(redirect || "/dashboard");
      } catch (error: any) {
        console.error("Callback error:", error);
        toast.error(error.response?.data?.error || "Authentication failed");
        navigate("/login");
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser, setToken]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-teal" />
    </div>
  );
};

export default AuthCallback;