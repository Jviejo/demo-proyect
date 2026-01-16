import React from "react";
import clsx from "clsx";

interface LogoProps {
  variant?: "default" | "white";
}

const Logo: React.FC<LogoProps> = ({ variant = "default" }) => (
  <div className="flex items-center gap-3">
    <img
      src="/logoherochain.png"
      alt="HeroChain Logo"
      className="h-8 w-8 lg:h-10 lg:w-10 object-contain"
    />
    <span
      className={clsx(
        "font-bold text-xl lg:text-2xl",
        variant === "white" ? "text-white" : "text-blood-600"
      )}
    >
      HeroChain
    </span>
  </div>
);

export default Logo;
