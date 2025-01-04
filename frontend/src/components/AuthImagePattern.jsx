import React from "react";
import { MessageCircle, Shield, Lock } from "lucide-react";

const AuthImagePattern = ({
  title = "Welcome Back",
  subtitle = "Sign in to continue your journey",
}) => {
  const icons = [
    <MessageCircle className="w-8 h-8" />,
    <Shield className="w-8 h-8" />,
    <Lock className="w-8 h-8" />,
  ];

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12 mt-[50px]">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`relative aspect-square rounded-2xl bg-base-100 
                ${i % 3 === 0 ? "animate-bounce delay-100" : ""}
                ${i % 3 === 1 ? "animate-pulse delay-200" : ""}
                ${i % 3 === 2 ? "animate-bounce delay-300" : ""}`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-50">
                {icons[i % 3]}
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60 text-lg">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
