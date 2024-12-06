import { NextResponse } from 'next/server'
import { z } from 'zod'

// Define more specific Zod schemas for better validation
const FormGenerationResponse = z.object({
  schema: z.record(z.any()).nullable(),
  formConfig: z.record(z.any()).nullable(),
  types: z.record(z.any()).nullable()
})

export async function POST(req: Request) {
  try {
    const { prompt = "Create a form for a full stack developer job application" } = await req.json()

    const systemPrompt = `You are a form generation assistant. Generate a form based on this prompt: "${prompt}".
    You must respond with a valid JSON object containing exactly these three keys: schema, formConfig, and types.
    
    The response must follow this exact structure:
    {
      "schema": {
        // Zod schema for form validation
        "fieldName": "z.string().required()",
        // Add more fields as needed
      },
      "formConfig": {
        // Configuration for each form field
        "fieldName": {
          "type": "text", // or select, textarea, etc.
          "label": "Field Label",
          "placeholder": "Enter value",
          "helperText": "Helper text",
          "required": true,
          "validation": {
            "required": "This field is required",
            "min": "Minimum length is X",
            "max": "Maximum length is Y"
          }
        }
      },
      "types": {
        // TypeScript interfaces
        "FormData": {
          "fieldName": "string"
        }
      }
    }

    Ensure the response is a valid JSON object with no trailing commas, comments, or additional text.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.1, // Reduced temperature for more consistent output
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 2048
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    
    // Extract and debug the generated content
    const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedContent) {
      throw new Error('No content generated from AI')
    }

    console.log('Raw AI Response:', generatedContent) // Debug log

    // Try to clean the response before parsing
    const cleanedContent = generatedContent
      .trim()
      .replace(/```json/g, '') // Remove markdown code blocks if present
      .replace(/```/g, '')
      .trim()

    try {
      const parsedContent = JSON.parse(cleanedContent)
      
      // Validate the response structure
      const validatedResponse = FormGenerationResponse.parse(parsedContent)

      return NextResponse.json({
        success: true,
        data: validatedResponse
      })

    } catch (parseError) {
      console.error('Parse Error:', parseError)
      console.error('Cleaned Content:', cleanedContent) // Debug log
      
      return NextResponse.json({
        success: false,
        error: 'Invalid response format from AI',
        debug: {
          rawContent: generatedContent,
          cleanedContent: cleanedContent,
          parseError: parseError.message
        }
      }, { status: 422 })
    }

  } catch (error) {
    console.error('Error generating form:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate form',
      debug: {
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        fullError: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : error
      }
    }, { status: 500 })
  }
}

