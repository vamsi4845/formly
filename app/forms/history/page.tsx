'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Define types for the API response
interface FormGenerationResponse {
  schema: Record<string, any>
  formConfig: Record<string, any>
  types: Record<string, any>
}

interface ApiResponse {
  success: boolean
  data?: FormGenerationResponse
  error?: string
  debug?: any
}

export default function FormHistory() {
  const [formData, setFormData] = useState<FormGenerationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch('/api/generate-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: "Create a contact form" // You can modify this prompt
          })
        })

        const data: ApiResponse = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to generate form')
        }

        setFormData(data.data || null)
        console.log('Generated Form Data:', data.data) // Debug log

      } catch (err) {
        console.error('Error fetching form data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFormData()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Form History</h1>
      
      {formData && (
        <div className="grid gap-6">
          {/* Schema Section */}
          <Card>
            <CardHeader>
              <CardTitle>Schema</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto">
                {JSON.stringify(formData.schema, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Form Config Section */}
          <Card>
            <CardHeader>
              <CardTitle>Form Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto">
                {JSON.stringify(formData.formConfig, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Types Section */}
          <Card>
            <CardHeader>
              <CardTitle>TypeScript Types</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto">
                {JSON.stringify(formData.types, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
