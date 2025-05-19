"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Slider } from "@/components/ui/slider"
import html2canvas from "html2canvas"
import { Share2, Download, Copy, Upload, Dice5Icon } from "lucide-react"
import CustomDraggableText from "@/components/custom-draggable-text"

// Define vibe types and their corresponding colors
const vibes = [
  { name: "joy", emoji: "😂", color: "border-yellow-400" },
  { name: "angry", emoji: "😡", color: "border-red-500" },
  { name: "sad", emoji: "😢", color: "border-blue-400" },
  { name: "confused", emoji: "😵", color: "border-gray-400" },
  { name: "sarcastic", emoji: "😏", color: "border-purple-500" },
]

// Meme templates
const templates = [
  { id: "drake", name: "Drake", path: "/templates/drake.jpg" },
  { id: "doge", name: "Doge", path: "/templates/doge.png" },
  { id: "distracted", name: "Distracted Boyfriend", path: "/templates/distracted.jpg" },
  { id: "button", name: "Button Choice", path: "/templates/Buttons.jpg" },
  { id: "change", name: "Change My Mind", path: "/templates/change.jpg" },
]

// Random text options for "Feeling Lucky"
const randomTopTexts = [
  "When you finally",
  "That moment when",
  "Nobody:",
  "Me explaining to my mom",
  "My face when",
  "How I look when",
  "My brain at 3am",
  "When someone says",
  "Me pretending to",
  "The teacher when",
]

const randomBottomTexts = [
  "and then it happened",
  "but it was all a dream",
  "and I took that personally",
  "mission accomplished",
  "what could go wrong?",
  "story of my life",
  "every single time",
  "and everybody clapped",
  "but I'm not complaining",
  "and that's a fact",
]

// Font options
const fontOptions = [
  { name: "Impact", value: "Impact, sans-serif" },
  { name: "Comic Sans MS", value: "'Comic Sans MS', cursive" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Times New Roman", value: "'Times New Roman', serif" },
]

// Color options
const colorOptions = [
  { name: "White", value: "white" },
  { name: "Black", value: "black" },
  { name: "Yellow", value: "yellow" },
  { name: "Red", value: "red" },
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Purple", value: "purple" },
]

export default function Home() {
  const [topText, setTopText] = useState("")
  const [bottomText, setBottomText] = useState("")
  const [selectedVibe, setSelectedVibe] = useState(vibes[0])
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0])
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  // New state for text styling
  const [fontFamily, setFontFamily] = useState(fontOptions[0].value)
  const [fontSize, setFontSize] = useState(32)
  const [fontColor, setFontColor] = useState(colorOptions[0].value)
  const [textShadow, setTextShadow] = useState(true)

  // State for text positions
  const memeWidth = 400; // or whatever your meme image width is
  const memeHeight = 400; // or whatever your meme image height is
  const [topTextPosition, setTopTextPosition] = useState({ x: memeWidth / 4, y: 40 })
  const [bottomTextPosition, setBottomTextPosition] = useState({ x: memeWidth / 4, y: memeHeight - 100 })

  const memeRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const [randomValue, setRandomValue] = useState<number | null>(null);
  useEffect(() => {
    setRandomValue(Math.random());
  }, []);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle template selection
  const handleTemplateSelect = (template: (typeof templates)[0]) => {
    setSelectedTemplate(template)
    setUploadedImage(null)
  }

  // Handle vibe selection
  const handleVibeSelect = (vibeName: string) => {
    const vibe = vibes.find((v) => v.name === vibeName)
    if (vibe) setSelectedVibe(vibe)
  }

  // "Feeling Lucky" function
  const feelingLucky = () => {
    // Pick random template
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
    setSelectedTemplate(randomTemplate)
    setUploadedImage(null)

    // Pick random texts
    const randomTop = randomTopTexts[Math.floor(Math.random() * randomTopTexts.length)]
    const randomBottom = randomBottomTexts[Math.floor(Math.random() * randomBottomTexts.length)]
    setTopText(randomTop)
    setBottomText(randomBottom)

    // Pick random vibe
    const randomVibe = vibes[Math.floor(Math.random() * vibes.length)]
    setSelectedVibe(randomVibe)

    // Reset positions: top text near top, bottom text near bottom
    setTopTextPosition({ x: memeWidth / 4, y: 40 })
    setBottomTextPosition({ x: memeWidth / 4, y: memeHeight - 100 })

    toast({
      title: "Feeling Lucky!",
      description: "Generated a random meme for you.",
    })
  }

  // Export meme as image
  const exportMeme = async () => {
    if (memeRef.current) {
      try {
        const canvas = await html2canvas(memeRef.current, {
          allowTaint: true,
          useCORS: true,
        })

        const dataUrl = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.download = `memesnap-${Date.now()}.png`
        link.href = dataUrl
        link.click()

        toast({
          title: "Meme exported!",
          description: "Your meme has been downloaded successfully.",
        })
      } catch (error) {
        console.error("Error exporting meme:", error)
        toast({
          title: "Export failed",
          description: "There was an error exporting your meme.",
          variant: "destructive",
        })
      }
    }
  }

  // Copy meme to clipboard
  const copyMeme = async () => {
    if (memeRef.current) {
      try {
        const canvas = await html2canvas(memeRef.current, {
          allowTaint: true,
          useCORS: true,
        })

        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])

            toast({
              title: "Copied to clipboard!",
              description: "Your meme has been copied to clipboard.",
            })
          }
        })
      } catch (error) {
        console.error("Error copying meme:", error)
        toast({
          title: "Copy failed",
          description: "There was an error copying your meme.",
          variant: "destructive",
        })
      }
    }
  }

  // Share meme on Twitter
  const shareOnTwitter = async () => {
    if (memeRef.current) {
      try {
        const canvas = await html2canvas(memeRef.current, {
          allowTaint: true,
          useCORS: true,
        })

        const dataUrl = canvas.toDataURL("image/png")
        const text = "Check out this meme I made with MemeSnap!"
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
        window.open(url, "_blank")

        toast({
          title: "Ready to share!",
          description: "Upload the saved image to your tweet.",
        })
      } catch (error) {
        console.error("Error sharing meme:", error)
      }
    }
  }

  // Get text style based on current settings
  const getTextStyle = () => {
    return {
      fontFamily,
      fontSize: `${fontSize}px`,
      color: fontColor,
      textShadow: textShadow ? "0 2px 4px rgba(0,0,0,0.8)" : "none",
      textTransform: "uppercase" as const,
      fontWeight: "bold" as const,
    }
  }

  return (
    <main className="w-full max-w-5xl mx-auto min-h-screen flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">MemeSnap</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Create vibe-coded memes in seconds ✨</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 h-full">
        {/* Left column: Controls */}
        <div className="space-y-4 sm:space-y-6 h-full overflow-auto pb-4 lg:pb-0 pr-0 lg:pr-2">
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <Tabs defaultValue="templates">
                <TabsList className="grid grid-cols-2 mb-2 sm:mb-4">
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>

                <TabsContent value="templates" className="space-y-2 sm:space-y-4">
                  <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 sm:gap-3">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                          selectedTemplate.id === template.id && !uploadedImage
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <Image
                          src={template.path || "/placeholder.svg"}
                          alt={template.name}
                          width={150}
                          height={150}
                          className="w-full h-auto object-cover aspect-square min-h-[80px]"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center">
                          {template.name}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Feeling Lucky Button */}
                  <Button onClick={feelingLucky} variant="outline" className="w-full mt-2 sm:mt-4 text-base sm:text-lg font-medium">
                    <Dice5Icon className="mr-2 h-5 w-5" />🎲 Feeling Lucky
                  </Button>
                </TabsContent>

                <TabsContent value="upload" className="space-y-2 sm:space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-4 sm:p-6 text-center">
                    <Input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <span className="text-base sm:text-lg font-medium">Upload your image</span>
                      <span className="text-xs sm:text-sm text-muted-foreground mt-1">PNG, JPG up to 5MB</span>
                    </Label>
                  </div>

                  {uploadedImage && (
                    <div className="mt-4 text-center">
                      <p className="text-xs sm:text-sm text-green-600 mb-2">Image uploaded successfully!</p>
                      <Button variant="outline" size="sm" onClick={() => setUploadedImage(null)}>
                        Remove
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6 space-y-2 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="top-text">Top Text</Label>
                <Input
                  id="top-text"
                  placeholder="Enter top text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bottom-text">Bottom Text</Label>
                <Input
                  id="bottom-text"
                  placeholder="Enter bottom text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vibe-selector">Select Vibe</Label>
                <Select onValueChange={handleVibeSelect} defaultValue={selectedVibe.name}>
                  <SelectTrigger id="vibe-selector">
                    <SelectValue placeholder="Select a vibe" />
                  </SelectTrigger>
                  <SelectContent>
                    {vibes.map((vibe) => (
                      <SelectItem key={vibe.name} value={vibe.name}>
                        <span className="flex items-center">
                          <span className="mr-2">{vibe.emoji}</span>
                          <span className="capitalize">{vibe.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Text Style Customization Card */}
          <Card>
            <CardContent className="pt-4 sm:pt-6 space-y-2 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium">Text Style</h3>

              <div className="space-y-2">
                <Label htmlFor="font-family">Font</Label>
                <Select onValueChange={setFontFamily} defaultValue={fontFamily}>
                  <SelectTrigger id="font-family">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.name} value={font.value} style={{ fontFamily: font.value }}>
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
                </div>
                <Slider
                  id="font-size"
                  min={16}
                  max={64}
                  step={1}
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  className="py-2 sm:py-4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-color">Font Color</Label>
                <Select onValueChange={setFontColor} defaultValue={fontColor}>
                  <SelectTrigger id="font-color">
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.name} value={color.value}>
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{
                              backgroundColor: color.value,
                              border: color.value === "white" ? "1px solid #ccc" : "none",
                            }}
                          />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="text-shadow"
                  checked={textShadow}
                  onChange={(e) => setTextShadow(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="text-shadow">Text Shadow/Outline</Label>
              </div>

              <div className="text-xs sm:text-sm text-muted-foreground mt-2">
                <p>Tip: Drag text on the preview to reposition it!</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Preview and Export */}
        <div className="space-y-4 sm:space-y-6 h-full overflow-auto pb-4 lg:pb-0 pl-0 lg:pl-2">
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Meme Preview</h2>
              </div>

              <div
                ref={memeRef}
                className={`relative mx-auto w-full max-w-xs sm:max-w-md border-4 sm:border-8 ${selectedVibe.color} rounded-lg overflow-hidden bg-black`}
              >
                {(uploadedImage || selectedTemplate) && (
                  <div className="relative aspect-square w-full h-full min-h-[250px]">
                    <Image
                      src={uploadedImage || selectedTemplate.path}
                      alt="Meme template"
                      fill
                      className="object-cover w-full h-full"
                    />

                    {topText && (
                      <CustomDraggableText
                        text={topText}
                        position={topTextPosition}
                        onPositionChange={setTopTextPosition}
                        style={getTextStyle()}
                        defaultPosition="top"
                      />
                    )}

                    {bottomText && (
                      <CustomDraggableText
                        text={bottomText}
                        position={bottomTextPosition}
                        onPositionChange={setBottomTextPosition}
                        style={getTextStyle()}
                        defaultPosition="bottom"
                      />
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <Button onClick={exportMeme} className="flex items-center justify-center gap-2 w-full">
                  <Download className="h-4 w-4" />
                  Download
                </Button>

                <Button onClick={copyMeme} variant="outline" className="flex items-center justify-center gap-2 w-full">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>

                <Button onClick={shareOnTwitter} variant="outline" className="flex items-center justify-center gap-2 w-full">
                  <Share2 className="h-4 w-4" />
                  Share on Twitter
                </Button>

                <Button onClick={exportMeme} variant="secondary" className="flex items-center justify-center gap-2 w-full">
                  <Download className="h-4 w-4" />
                  Save as PNG
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </main>
  )
}
