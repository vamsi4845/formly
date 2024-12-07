"use client"

import React, { useState, useEffect, useRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Layers, Type, CheckSquare, AlignLeft, Calendar, Trash2, ToggleLeft, GripVertical } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/hooks/use-toast"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form' 

const FORM_ELEMENTS = [
  { 
    type: 'FormField',
    icon: Type,
    defaultConfig: {
      name: 'textField',
      label: 'Text Field',
      placeholder: 'Enter text...',
      description: 'This is a text field',
      type: 'text',
      control: 'input'
    }
  },
  { 
    type: 'FormTextarea',
    icon: AlignLeft,
    defaultConfig: {
      name: 'textarea',
      label: 'Text Area',
      placeholder: 'Enter long text...',
      description: 'This is a textarea field',
      control: 'textarea'
    }
  },
  { 
    type: 'FormCheckbox',
    icon: CheckSquare,
    defaultConfig: {
      name: 'checkbox',
      label: 'Checkbox',
      description: 'This is a checkbox field',
      control: 'checkbox'
    }
  },
  { 
    type: 'Select',
    icon: Layers,
    defaultConfig: {
      name: 'select',
      label: 'Select',
      placeholder: 'Select an option',
      description: 'This is a select field',
      control: 'select',
      options: ['Option 1', 'Option 2']
    }
  },
  { 
    type: 'Date Picker',
    icon: Calendar,
    defaultConfig: {
      name: 'datePicker',
      label: 'Date Picker',
      placeholder: 'Select a date',
      description: 'This is a date picker field',
      control: 'datePicker'
    }
  },
  { 
    type: 'Radio Group',
    icon: ToggleLeft,
    defaultConfig: {
      name: 'radioGroup',
      label: 'Radio Group',
      description: 'This is a radio group field',
      control: 'radioGroup',
      options: ['Option 1', 'Option 2']
    }
  },
  { 
    type: 'Switch',
    icon: ToggleLeft,
    defaultConfig: {
      name: 'switch',
      label: 'Switch',
      description: 'This is a switch field',
      control: 'switch'
    }
  },
]

const DraggableElement = ({ type, icon: Icon }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'formElement',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={drag}
            className={cn(
              "flex items-center gap-2 p-2 mb-2 bg-card hover:bg-accent rounded-md cursor-move transition-colors",
              isDragging && "opacity-50"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{type}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Drag to add {type}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const FormElement = ({ 
  element, 
  index, 
  updateElementConfig, 
  moveElement, 
  removeElement,
  isPreview = false 
}) => {
  const ref = useRef(null)
  
  const [{ isDragging }, drag] = useDrag({
    type: 'formElementReorder',
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'formElementReorder',
    hover(item, monitor) {
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) return
      moveElement(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  // Initialize drag and drop refs only if not in preview mode
  if (!isPreview) {
    drag(drop(ref))
  }

  const renderFormControl = () => {
    if (!element?.config) return null

    switch (element.type) {
      case 'FormField':
        return <Input 
          type={element.config.type || 'text'}
          placeholder={element.config.placeholder} 
          disabled 
        />
      case 'FormTextarea':
        return <Textarea 
          placeholder={element.config.placeholder} 
          disabled 
        />
      case 'FormCheckbox':
        return <Checkbox disabled />
      case 'Select':
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder={element.config.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {element.config.options?.map((option, index) => (
                <SelectItem key={index} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'Date Picker':
        return <Input 
          type="date" 
          placeholder={element.config.placeholder} 
          disabled 
        />
      case 'Radio Group':
        return (
          <RadioGroup disabled>
            {element.config.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} />
                <Label>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case 'Switch':
        return <Switch disabled />
      default:
        return <Input 
          placeholder={element.config.placeholder} 
          disabled 
        />
    }
  }

  return (
    <div 
      ref={isPreview ? null : ref}
      className={cn(
        "relative space-y-2 p-4 hover:bg-gray-50 rounded-md transition-colors border",
        isDragging && "opacity-50"
      )}
    >
      {!isPreview && (
        <div className="absolute left-2 top-2 cursor-move">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      )}
      <div className={cn("ml-6", isPreview && "ml-0")}>
        <FormItem>
          <FormLabel>
            {element.config?.label || element.type}
          </FormLabel>
          <FormControl>
            {renderFormControl()}
          </FormControl>
          <FormDescription>
            {element.config?.description || ''}
          </FormDescription>
        </FormItem>
      </div>
      {!isPreview && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100"
          onClick={() => removeElement(element.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

const FormPreview = ({ elements, updateElement, removeElement }) => {
  const form = useForm({
    defaultValues: elements.reduce((acc, el) => ({
      ...acc,
      [el.config?.name || '']: ''
    }), {})
  })

  const moveElement = (dragIndex, hoverIndex) => {
    const dragElement = elements[dragIndex]
    const newElements = [...elements]
    newElements.splice(dragIndex, 1)
    newElements.splice(hoverIndex, 0, dragElement)
    updateElement(newElements)
  }

  const [{ isOver }, drop] = useDrop({
    accept: 'formElement',
    drop: (item) => {
      const elementType = FORM_ELEMENTS.find(el => el.type === item.type)
      if (!elementType) return

      const newElement = {
        id: crypto.randomUUID(),
        type: item.type,
        config: { ...elementType.defaultConfig }
      }
      
      updateElement([...elements, newElement])
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  })

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="editor">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Form Builder</h1>
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="editor">
          <Card>
            <CardHeader>
              <CardTitle>Form Editor</CardTitle>
              <CardDescription>Drag elements to reorder, edit labels and placeholders</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(() => {})}>
                  <ScrollArea 
                    ref={drop}
                    className={cn(
                      "h-[500px] w-full rounded-md border p-4",
                      isOver && "bg-accent/50"
                    )}
                  >
                    {elements.map((element, index) => (
                      <FormElement
                        key={element.id}
                        element={element}
                        index={index}
                        updateElementConfig={(id, config) => {
                          const newElements = elements.map(el => 
                            el.id === id ? { ...el, config } : el
                          )
                          updateElement(newElements)
                        }}
                        moveElement={moveElement}
                        removeElement={removeElement}
                      />
                    ))}
                    {elements.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <p>Drag and drop elements here</p>
                      </div>
                    )}
                  </ScrollArea>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preview">
          {/* <div className="space-y-4">
            {elements.map((element) => (
              <FormElement
                key={element.id}
                element={element}
                index={0}
                updateElementConfig={() => {}}
                moveElement={() => {}}
                removeElement={() => {}}
                isPreview
              />
            ))}
          </div> */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ColorCustomization({ updateColors }) {
  const [formStyle, setFormStyle] = useState({
    buttonBackground: 'bg-zinc-800',
    buttonColor: 'text-zinc-50',
    border: 'border-gray-100',
    fieldsBackground: 'bg-white',
    fieldsEffect: {
      hover: true,
      focus: true
    },
    shadow: 'shadow-sm',
    padding: {
      x: 3,
      y: 2
    }
  })

  const handleStyleChange = (key, value) => {
    setFormStyle(prev => ({
      ...prev,
      [key]: value
    }))
    // You can call updateColors here with the new styles
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Style Customization</CardTitle>
        <CardDescription>Customize your form's appearance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label>Button Background</Label>
            <Select 
              value={formStyle.buttonBackground}
              onValueChange={(value) => handleStyleChange('buttonBackground', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select background" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bg-zinc-800">bg-zinc-800</SelectItem>
                {/* Add more color options */}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Button Color</Label>
            <Select
              value={formStyle.buttonColor}
              onValueChange={(value) => handleStyleChange('buttonColor', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text-zinc-50">text-zinc-50</SelectItem>
                {/* Add more color options */}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Border</Label>
            <Select
              value={formStyle.border}
              onValueChange={(value) => handleStyleChange('border', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select border" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="border-gray-100">border-gray-100</SelectItem>
                {/* Add more border options */}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Fields Background</Label>
            <Select
              value={formStyle.fieldsBackground}
              onValueChange={(value) => handleStyleChange('fieldsBackground', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select background" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bg-white">bg-white</SelectItem>
                {/* Add more background options */}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Fields Effect</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formStyle.fieldsEffect.hover}
                  onCheckedChange={(checked) => 
                    handleStyleChange('fieldsEffect', { ...formStyle.fieldsEffect, hover: checked })}
                />
                <Label>Hover</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formStyle.fieldsEffect.focus}
                  onCheckedChange={(checked) => 
                    handleStyleChange('fieldsEffect', { ...formStyle.fieldsEffect, focus: checked })}
                />
                <Label>Focus</Label>
              </div>
            </div>
          </div>

          <div>
            <Label>Shadow</Label>
            <Select
              value={formStyle.shadow}
              onValueChange={(value) => handleStyleChange('shadow', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select shadow" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shadow-sm">shadow-sm</SelectItem>
                {/* Add more shadow options */}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Padding</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>X</Label>
                <Select
                  value={formStyle.padding.x.toString()}
                  onValueChange={(value) => 
                    handleStyleChange('padding', { ...formStyle.padding, x: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="X padding" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Y</Label>
                <Select
                  value={formStyle.padding.y.toString()}
                  onValueChange={(value) => 
                    handleStyleChange('padding', { ...formStyle.padding, y: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Y padding" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function FormEditor() {
  const [formElements, setFormElements] = useState([])

  const updateElement = (newElements) => {
    try {
      setFormElements(newElements)
      toast({
        title: "Success",
        description: "Form updated successfully",
      })
    } catch (error) {
      console.error("Error updating elements:", error)
      toast({
        title: "Error",
        description: "Failed to update form. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeElement = (id) => {
    try {
      setFormElements(prev => prev.filter(element => element.id !== id))
      toast({
        title: "Element removed",
        description: "The element has been removed from your form.",
      })
    } catch (error) {
      console.error("Error removing element:", error)
      toast({
        title: "Error",
        description: "Failed to remove element. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col lg:flex-row h-screen bg-background p-4 gap-4">
        <Card className="w-full lg:w-1/4">
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>Drag elements to the preview</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
              {FORM_ELEMENTS.map((element) => (
                <DraggableElement 
                  key={element.type} 
                  type={element.type} 
                  icon={element.icon} 
                />
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="w-full lg:w-1/2">
          <FormPreview
            elements={formElements}
            updateElement={updateElement}
            removeElement={removeElement}
          />
        </div>

        <div className="w-full lg:w-1/4">
          <ColorCustomization updateColors={() => {}} />
        </div>
      </div>
    </DndProvider>
  )
}