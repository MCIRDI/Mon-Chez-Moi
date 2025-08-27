import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/Context/AppContext";
import "./AuthenticationForms.css";
import { register, login } from "@/Services/AuthService";
interface LoginProps {
  closeAuthForms: () => void;
}
export default function AuthenticationForms({ closeAuthForms }: LoginProps) {
  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("auth-container ");

    if (signUpButton && signInButton && container) {
      const handleSignUp = () => container.classList.add("right-panel-active");
      const handleSignIn = () =>
        container.classList.remove("right-panel-active");

      signUpButton.addEventListener("click", handleSignUp);
      signInButton.addEventListener("click", handleSignIn);

      return () => {
        signUpButton.removeEventListener("click", handleSignUp);
        signInButton.removeEventListener("click", handleSignIn);
      };
    }
  }, []);

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  function handleChangeRegister(e: React.ChangeEvent<HTMLInputElement>) {
    setRegisterData({
      ...registerData,
      [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement)
        .value,
    });
  }
  function handleChangeLogin(e: React.ChangeEvent<HTMLInputElement>) {
    setLoginData({
      ...loginData,
      [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement)
        .value,
    });
  }
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("AppContext is not provided");
  }
  const { setToken } = appContext;
  const { setUser } = appContext;

  async function handleRegistration(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = await register(registerData);
    setToken(data.token.plainTextToken);
    setUser(data.user);
    closeAuthForms();
    console.log("token is :111112233", data.token.plainTextToken);
    console.log("registered user is :111112233", data.user);
  }
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const data = await login(loginData);

      setToken(data.token.plainTextToken);
      setUser(data.user);
      closeAuthForms();
      console.log("token is :3333333333", data.token.plainTextToken);
      console.log("loged in user is :3333333333", data.user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  }

  return (
    <div className="login-page">
      <div className="auth-container" id="auth-container ">
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegistration} method="POST">
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              name="name"
              onChange={handleChangeRegister}
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              onChange={handleChangeRegister}
              placeholder="Email"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChangeRegister}
            />
            <input
              type="password"
              name="password_confirmation"
              onChange={handleChangeRegister}
              placeholder="Confirm Password"
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action="#" onSubmit={handleLogin} method="POST">
            <h1>Sign in</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your account</span>
            <p
              className={`bg-red-600 p-3 text-white ${errorMessage === "" ? "hidden" : ""}`}
            >
              {errorMessage}
            </p>
            <input
              type="email"
              onChange={handleChangeLogin}
              name="email"
              placeholder="Email"
            />
            <input
              type="password"
              onChange={handleChangeLogin}
              name="password"
              placeholder="Password"
            />
            <a href="#">Forgot your password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button className="ghost" id="signIn">
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" id="signUp">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
