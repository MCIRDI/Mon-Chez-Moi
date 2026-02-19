import { useState, useContext } from "react";
import { AppContext } from "@/Context/AppContext";
import { register, login } from "@/Services/AuthService";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import LoadingSpinner from "@/ui/LoadingSpinner";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface LoginData {
  email: string;
  password: string;
}

export default function AuthPageMobile() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  if (!appContext) throw new Error("AppContext not provided");
  const { setToken, setUser } = appContext;

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsRegistering(true);
    try {
      const data = await register(registerData);
      setToken(data.token.plainTextToken);
      setUser(data.user);
      navigate(-1);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      setIsRegistering(false);
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const data = await login(loginData);
      setToken(data.token.plainTextToken);
      setUser(data.user);
      navigate(-1);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <div className="relative min-h-screen w-screen bg-white flex flex-col justify-center items-center p-6 font-[Montserrat]">
      <XCircle
        onClick={() => {
          navigate(-1);
        }}
        className="absolute top-5 right-5 hover:cursor-pointer "
        color="black"
        size={40}
      />
      <h1 className="text-2xl font-bold mb-6">
        {mode === "login" ? "Sign In" : "Create Account"}
      </h1>

      {errorMessage && (
        <p className="bg-red-500 text-white p-3 rounded mb-4">{errorMessage}</p>
      )}

      {mode === "register" ? (
        <form
          onSubmit={handleRegister}
          className="w-full max-w-sm flex flex-col gap-3"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="p-3 border rounded bg-gray-100"
            onChange={(e) =>
              setRegisterData({ ...registerData, name: e.target.value })
            }
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-3 border rounded bg-gray-100"
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="p-3 border rounded bg-gray-100"
            onChange={(e) =>
              setRegisterData({ ...registerData, password: e.target.value })
            }
          />
          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            className="p-3 border rounded bg-gray-100"
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                password_confirmation: e.target.value,
              })
            }
          />
          <button
            type="submit"
            disabled={isRegistering}
            className="bg-blue-500 text-white py-3 rounded-full font-bold disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isRegistering ? (
              <>
                <LoadingSpinner size="sm" />
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
          <p className="text-sm text-gray-600 text-center mt-4">
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-600 font-semibold"
              onClick={() => setMode("login")}
            >
              Sign In
            </button>
          </p>
        </form>
      ) : (
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm flex flex-col gap-3"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-3 border rounded bg-gray-100"
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="p-3 border rounded bg-gray-100"
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
          <button
            type="submit"
            disabled={isLoggingIn}
            className="bg-blue-500 text-white py-3 rounded-full font-bold disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoggingIn ? (
              <>
                <LoadingSpinner size="sm" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate("/ForgotPassword")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Forgot your password?
            </button>
          </div>
          <p className="text-sm text-gray-600 text-center mt-4">
            Don’t have an account?{" "}
            <button
              type="button"
              className="text-blue-600 font-semibold"
              onClick={() => setMode("register")}
            >
              Sign Up
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
