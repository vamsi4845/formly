import { SignUp } from "@clerk/nextjs";
import { MicIcon } from "lucide-react";
export default function SignUpPage() {

    return (
      <div className="flex flex-col md:flex-row min-h-screen [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
        <div className="w-full md:w-1/2 relative flex flex-col justify-center items-center p-8 md:p-0">
          <div className="flex items-center mb-4">
            <MicIcon className="h-8 w-8 md:h-12 md:w-12 text-primary mr-2 md:mr-3" />
            <span className="text-white text-2xl md:text-4xl font-bold">Mock AI</span>
          </div>
          <p className="text-primary-foreground/60 text-sm md:text-md text-center max-w-md px-4">
            Master Your Interviews with AI-Powered Practice and Feedback
          </p>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-0">
          <SignUp/>
        </div>
      </div>
    )
  }