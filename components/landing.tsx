'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Github, Sparkles, Upload } from "lucide-react"
import { motion } from "framer-motion"
import Link from 'next/link'

export function Landing() {
  const [isProInputs, setIsProInputs] = useState(false)

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const ideas = [
    {
      title: "Migrate from screenshot",
      description: "Generate the attached Mayo Clinic new patient registration form.",
      file: "Screenshot.png"
    },
    {
      title: "Complex booking form",
      description: "Create car rental booking form for a company like you would see from Hertz or Enterprise."
    },
    {
      title: "Create from database table",
      description: "Using the attached database sql, create a form that would populate it. Omit any private / internal fields.",
      file: "CreateUser.sql"
    },
    {
      title: "Repeating elements",
      description: "Create a registration form for the FormKitConf Global conference that allows multiple users to be registered at once."
    },
    {
      title: "Gravity Forms migration",
      description: "Create a form based on the attached Gravity Forms export from WordPress site."
    },
    {
      title: "From a sketch",
      description: "Create a form based on the attached photo of a whiteboard sketch."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      <header className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-orange-500/20 rounded" />
          <span className="font-semibold text-gray-800">Formly</span>
          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">KickStart</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Pricing</Button>
          <Link href="/forms/77"> Get Started</Link>
          <Button variant="outline" className="text-gray-600 hover:text-gray-900">
            <Github className="mr-2 h-4 w-4" />
            Sign in
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-12 text-center md:py-24">
        <motion.h1 
          className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl"
          {...fadeIn}
        >
          Generate. Iterate.
          <br />
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-yellow-400" />
            Copy & Paste.
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </span>
        </motion.h1>
        <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
          <p className="mb-2 text-lg text-gray-600">KickStart your next FormKit form in seconds.</p>
          <p className="mb-2 text-lg text-gray-600">Generate from a prompt, image, or text attachment.</p>
          <p className="mb-8 text-lg text-gray-600">Copy & paste as Vue components or FormKit schema.</p>
        </motion.div>
        
        <motion.div 
          className="mx-auto mb-16 max-w-2xl"
          {...fadeIn}
          transition={{ delay: 0.4 }}
        >
          <div className="relative">
            <Input
              className="h-14 pl-4 pr-32 text-lg"
              placeholder="Describe your desired form..."
            />
            <div className="absolute right-2 top-2 flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Upload className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                <Switch 
                  id="pro" 
                  checked={isProInputs}
                  onCheckedChange={setIsProInputs}
                />
                <label htmlFor="pro" className="text-sm font-medium">Pro Inputs</label>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.h2 
          className="mb-8 text-2xl font-semibold text-gray-700"
          {...fadeIn}
          transition={{ delay: 0.6 }}
        >
          Need some ideas?
        </motion.h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ideas.map((item, i) => (
            <motion.div
              key={i}
              {...fadeIn}
              transition={{ delay: 0.2 * (i + 4) }}
            >
              <Card className="p-4 text-left hover:shadow-lg transition-shadow duration-300">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <h3 className="font-medium text-gray-800">{item.title}</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="rounded-md bg-gray-50 p-2">
                    <span className="text-xs font-medium text-gray-500">Request</span>
                    <p className="mt-1 text-gray-700">"{item.description}"</p>
                  </div>
                  {item.file && (
                    <div className="rounded-md bg-gray-50 p-2">
                      <span className="text-xs font-medium text-gray-500">File</span>
                      <p className="mt-1 text-gray-700">{item.file}</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}