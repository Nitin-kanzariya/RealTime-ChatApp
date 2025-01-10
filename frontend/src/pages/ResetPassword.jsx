import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Loader2,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { token } = useParams();

  const { resetPassword } = useAuthStore();

  const validatePassword = (password) => {
    const conditions = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };
    return conditions;
  };

  const conditions = validatePassword(formData.password);

  const isValid =
    Object.values(conditions).every(Boolean) &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await resetPassword({ password: formData.password, token });
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulated API call
      setIsSuccess(true);
    } catch (error) {
      console.error("Password reset error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 ">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="text-center mb-8 ">
            <div className="flex flex-col items-center gap-2 group mt-10">
              <h1 className="text-2xl font-bold mt-2">Reset Password</h1>
              <p className="text-base-content/60">
                Enter your new password below
              </p>
            </div>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">New Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pl-10"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-base-content/40" />
                    ) : (
                      <Eye className="h-5 w-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Confirm Password
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="input input-bordered w-full pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-base-content/40" />
                    ) : (
                      <Eye className="h-5 w-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="space-y-2 text-sm">
                <p className="font-medium text-base-content/60">
                  Password must have:
                </p>
                <ul className="space-y-1">
                  {Object.entries({
                    "At least 8 characters": conditions.length,
                    "One uppercase letter": conditions.uppercase,
                    "One lowercase letter": conditions.lowercase,
                    "One number": conditions.number,
                    "One special character": conditions.special,
                  }).map(([text, met]) => (
                    <li
                      key={text}
                      className={`flex items-center gap-2 ${
                        met ? "text-success" : "text-base-content/60"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          met ? "opacity-100" : "opacity-40"
                        }`}
                      />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          ) : (
            /* Success Message */
            <div className="space-y-6">
              <div className="bg-success/10 text-success rounded-lg p-4">
                Your password has been successfully reset. You can now use your
                new password to log in.
              </div>
              <Link to="/login" className="btn btn-primary w-full">
                Go to Login
              </Link>
            </div>
          )}

          {/* Back to Login Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-base-content/60 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <div className="hidden lg:block bg-base-200">
        <div className="flex flex-col justify-center items-center h-full p-8">
          <div className="max-w-md text-center space-y-4">
            <h2 className="text-2xl font-bold">Create a Strong Password</h2>
            <p className="text-base-content/60">
              Choose a strong password to keep your account secure. Make sure
              it's unique and not used on other websites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
