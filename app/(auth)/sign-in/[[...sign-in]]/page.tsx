import { SignIn } from "@clerk/nextjs";
import { MicIcon } from "lucide-react";

export default function SignInPage() {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      <div className="w-full md:w-1/2 relative flex flex-col justify-center items-center p-8 md:p-0">
        <div className="flex items-center mb-4">
          <MicIcon className="h-8 w-8 md:h-12 md:w-12 text-primary mr-2 md:mr-3" />
          <span className=" text-2xl md:text-4xl font-bold">Formly</span>
        </div>
        <p className="text-sm md:text-md text-center max-w-md px-4">
          Master Your Interviews with AI-Powered Practice and Feedback
        </p>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-0">
        <SignIn/>
      </div>
    </div>
    )

  }