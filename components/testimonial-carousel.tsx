"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    quote:
      "Eunoia Journal has transformed my self-reflection practice. The AI insights have helped me identify patterns in my thinking I never noticed before.",
    author: "Dr. Sarah Chen",
    role: "Clinical Psychologist",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote:
      "As someone who's journaled for years, the analytics and visualization tools in Eunoia have given me a whole new perspective on my emotional journey.",
    author: "Marcus Johnson",
    role: "Author & Speaker",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote:
      "The enterprise-grade security features give me peace of mind knowing my most personal thoughts are protected. The MFA and encryption are must-haves.",
    author: "Priya Sharma",
    role: "Cybersecurity Analyst",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <Card className="border-none shadow-lg bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30">
                <CardContent className="pt-6 pb-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <div className="absolute -top-6 -left-6 text-5xl text-teal-300 dark:text-teal-700">"</div>
                      <p className="text-lg italic relative z-10 mb-6">{testimonial.quote}</p>
                      <div className="absolute -bottom-6 -right-6 text-5xl text-teal-300 dark:text-teal-700">"</div>
                    </div>
                    <div className="flex items-center mt-4">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                        <AvatarFallback>
                          {testimonial.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <Button variant="outline" size="icon" onClick={prevTestimonial} className="rounded-full">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>

        <div className="flex gap-1 items-center">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${index === activeIndex ? "bg-teal-500" : "bg-muted-foreground/30"}`}
              onClick={() => setActiveIndex(index)}
            >
              <span className="sr-only">Testimonial {index + 1}</span>
            </button>
          ))}
        </div>

        <Button variant="outline" size="icon" onClick={nextTestimonial} className="rounded-full">
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  )
}

