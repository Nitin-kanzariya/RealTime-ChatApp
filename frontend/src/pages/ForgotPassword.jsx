import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Mail, MessageSquare } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { forgetPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await forgetPassword({ email });
        
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulated API call
      setIsSuccess(true);
    } catch (error) {
      console.error("Password reset error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center  transition-colors">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Forgot Password?</h1>
              <p className="text-base-content/60">
                No worries, we'll send you reset instructions.
              </p>
            </div>
          </div>

          {!isSuccess ? (
            /* Reset Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending Instructions...
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
                Password reset instructions have been sent to your email. Please
                check your inbox.
              </div>
              <button
                onClick={() => setIsSuccess(false)}
                className="btn btn-outline w-full"
              >
                Try another email
              </button>
            </div>
          )}

          {/* Back to Login Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-base-content/60 hover:text-primary/70 transition-colors"
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
            <h2 className="text-2xl font-bold">Reset Your Password</h2>
            <p className="text-base-content/60">
              We understand it happens. Reset your password and get back to your
              conversations securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
