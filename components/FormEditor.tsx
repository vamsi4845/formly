"use client"

import React, { useState, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Layers, Type, CheckSquare, AlignLeft, Calendar, Trash2, ToggleLeft } from 'lucide-react'

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

const FORM_ELEMENTS = [
  { type: 'Text Input', icon: Type },
  { type: 'Textarea', icon: AlignLeft },
  { type: 'Checkbox', icon: CheckSquare },
  { type: 'Select', icon: Layers },
  { type: 'Date Picker', icon: Calendar },
  { type: 'Radio Group', icon: ToggleLeft },
  { type: 'Switch', icon: ToggleLeft },
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

const FormElement = ({ element, index, removeElement }) => {
  const ref = useRef(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'formElement',
    item: { id: element.id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'formElement',
    hover: (item, monitor) => {
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) return
      moveElement(dragIndex, hoverIndex)
      item.index = hoverIndex
    }
  })

  drag(drop(ref))
  switch (element.type) {
    case 'Text Input':
      return (
        <div className="space-y-2">
          <Label htmlFor={`text-${element.id}`}>Text Input</Label>
          <Input id={`text-${element.id}`} placeholder="Enter text" />
        </div>
      )
    case 'Textarea':
      return (
        <div className="space-y-2">
          <Label htmlFor={`textarea-${element.id}`}>Textarea</Label>
          <Textarea id={`textarea-${element.id}`} placeholder="Enter long text" />
        </div>
      )
    case 'Checkbox':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox id={`checkbox-${element.id}`} />
          <Label htmlFor={`checkbox-${element.id}`}>Checkbox label</Label>
        </div>
      )
    case 'Select':
      return (
        <div className="space-y-2">
          <Label htmlFor={`select-${element.id}`}>Select</Label>
          <Select>
            <SelectTrigger id={`select-${element.id}`}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    case 'Date Picker':
      return (
        <div className="space-y-2">
          <Label htmlFor={`date-${element.id}`}>Date</Label>
          <Input id={`date-${element.id}`} type="date" />
        </div>
      )
    case 'Radio Group':
      return (
        <div className="space-y-2">
          <Label>Radio Group</Label>
          <RadioGroup defaultValue="option1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option1" id={`radio1-${element.id}`} />
              <Label htmlFor={`radio1-${element.id}`}>Option 1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option2" id={`radio2-${element.id}`} />
              <Label htmlFor={`radio2-${element.id}`}>Option 2</Label>
            </div>
          </RadioGroup>
        </div>
      )
    case 'Switch':
      return (
        <div className="flex items-center space-x-2">
          <Switch id={`switch-${element.id}`} />
          <Label htmlFor={`switch-${element.id}`}>Switch label</Label>
        </div>
      )
    default:
      return null
  }
}

const FormPreview = ({ elements, updateElement, removeElement }) => {
  const moveElement = (dragIndex, hoverIndex) => {
    const dragElement = elements[dragIndex]
    const newElements = [...elements]
    newElements.splice(dragIndex, 1)
    newElements.splice(hoverIndex, 0, dragElement)
    updateElement(newElements)
  }

  const [, drop] = useDrop({
    accept: 'formElement',
    drop: (item) => {
      if (!item.id) {
        const elementType = FORM_ELEMENTS.find(el => el.type === item.type)
        if (!elementType) return

        const elementId = crypto.randomUUID()
        const newElement = {
          id: elementId,
          type: item.type,
          config: {
            ...elementType.defaultConfig,
            name: `field_${elementId}`,
          }
        }
        
        updateElement([...elements, newElement])
      }
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Preview</CardTitle>
        <CardDescription>Drag and drop elements to build your form</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full rounded-md border p-4" ref={drop}>
          {elements.map((element, index) => (
            <div key={element.id} className="mb-4 p-4 bg-accent rounded-md relative group">
              <FormElement 
                element={element} 
                index={index}
                removeElement={removeElement}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeElement(element.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {elements.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Drag elements here
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

const ColorCustomization = ({ updateColors }) => {
  const [primaryColor, setPrimaryColor] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [textColor, setTextColor] = useState('#000000')

  const handleColorChange = (type, color) => {
    switch (type) {
      case 'primary':
        setPrimaryColor(color)
        break
      case 'background':
        setBackgroundColor(color)
        break
      case 'text':
        setTextColor(color)
        break
    }
    updateColors({ primaryColor, backgroundColor, textColor })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Customization</CardTitle>
        <CardDescription>Customize your form's appearance</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="colors">
            <AccordionTrigger>Color Settings</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-12 h-12 p-1 rounded-md"
                    />
                    <Input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="flex-grow"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="w-12 h-12 p-1 rounded-md"
                    />
                    <Input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="flex-grow"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={textColor}
                      onChange={(e) => handleColorChange('text', e.target.value)}
                      className="w-12 h-12 p-1 rounded-md"
                    />
                    <Input
                      type="text"
                      value={textColor}
                      onChange={(e) => handleColorChange('text', e.target.value)}
                      className="flex-grow"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

export function FormEditor() {
  const [formElements, setFormElements] = useState([])
  const [colors, setColors] = useState({
    primaryColor: '#000000',
    backgroundColor: '#ffffff',
    textColor: '#000000',
  })

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formElements.length > 0) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [formElements])

  const updateElement = (newElements) => {
    try {
      if (Array.isArray(newElements)) {
        setFormElements(newElements)
      } else {
        setFormElements((prevElements) => [...prevElements, newElements])
        toast({
          title: "Element added",
          description: `${newElements.type} has been added to your form.`,
        })
      }
    } catch (error) {
      console.error("Error updating elements:", error)
      toast({
        title: "Error",
        description: "Failed to update elements. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeElement = (id) => {
    try {
      setFormElements((prevElements) => prevElements.filter((element) => element.id !== id))
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

  const updateColors = (newColors) => {
    setColors(newColors)
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
          <ColorCustomization updateColors={updateColors} />
        </div>
      </div>
    </DndProvider>
  )
}