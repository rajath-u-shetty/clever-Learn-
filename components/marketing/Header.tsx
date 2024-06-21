import { GraduationCap } from "lucide-react";
import { SigninButton } from "./SigninButton";
import { Button } from "../ui/button";
import { siteConfig } from "@/config/site";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { FaDiscord } from "react-icons/fa6";

export function Header() {
  return (
    <nav className="h-20 z-50 sticky shrink-0 flex items-center justify-between px-6 md:px-12 lg:px-24 top-0 left-0 bg-background">
      <div className="flex items-center">
        <GraduationCap className="h-6 w-6 mr-2" />
        <h1 className="font-semibold">{siteConfig.name}</h1>
      </div>
      <div className="flex items-center gap-2">
        <a href="https://github.com/ZachMcM/study-ai" className="mr-4">
          <Button variant="outline" size="icon">
            <GitHubLogoIcon className="h-5 w-5" />
          </Button>
        </a>
        <SigninButton />
      </div>
    </nav>
  );
}
