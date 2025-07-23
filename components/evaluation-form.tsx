"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface EvaluationFormProps {
  onComplete: (data: any) => void
  onBack: () => void
}

const questions = [
  {
    id: "understanding",
    text: "Je comprends les usages actuels de l'Intelligence Artificielle (IA) dans mon métier.",
    type: "scale",
  },
  {
    id: "quality",
    text: "L'IA améliore la qualité ou l'efficacité de mon travail.",
    type: "scale",
  },
  {
    id: "conditions",
    text: "L'IA améliore mes conditions de travail.",
    type: "scale",
  },
  {
    id: "skills",
    text: "Pensez-vous que l'IA va transformer les compétences requises dans votre poste dans les 2 à 3 prochaines années ?",
    type: "scale",
  },
  {
    id: "implementation",
    text: "Facilité de mise en œuvre de l'IA au sein de votre métier",
    type: "scale",
  },
  {
    id: "tasks",
    text: "Proportion de vos tâches quotidiennes possiblement impactées par l'IA",
    type: "scale",
  },
  {
    id: "risk",
    text: "Percevez-vous un risque pour votre emploi lié à l'IA ?",
    type: "choice",
    options: [
      { value: "none", label: "Non" },
      { value: "short", label: "Oui court terme" },
      { value: "medium", label: "Oui 3-5 ans" },
      { value: "long", label: "Oui au delà de 5 ans" },
    ],
  },
]

export default function EvaluationForm({ onComplete, onBack }: EvaluationFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    job: "",
    answers: {} as Record<string, string>,
  })

  const progress = ((currentStep + 1) / (questions.length + 1)) * 100

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(formData)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }

  const updateAnswer = (questionId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value,
      },
    }))
  }

  const updateJob = (job: string) => {
    setFormData((prev) => ({ ...prev, job }))
  }

  const canProceed = () => {
    if (currentStep === 0) {
      return formData.job.trim() !== ""
    }
    const currentQuestion = questions[currentStep - 1]
    return formData.answers[currentQuestion.id] !== undefined
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-red-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handlePrevious} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Étape {currentStep + 1} sur {questions.length + 1}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-gray-900">
              {currentStep === 0 ? "Informations générales" : `Question ${currentStep}`}
            </CardTitle>
            <CardDescription className="text-lg">
              {currentStep === 0
                ? "Commençons par identifier votre métier"
                : "Sur une échelle de 0 (Pas du tout d'accord) à 5 (Tout à fait d'accord)"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep === 0 ? (
              <div className="space-y-4">
                <Label htmlFor="job" className="text-lg font-medium">
                  Quel est votre métier ?
                </Label>
                <Input
                  id="job"
                  placeholder="Ex: Développeur, Designer, Manager, etc."
                  value={formData.job}
                  onChange={(e) => updateJob(e.target.value)}
                  className="text-lg py-3"
                />
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-900 leading-relaxed">{questions[currentStep - 1].text}</h3>

                {questions[currentStep - 1].type === "scale" ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600 px-2">
                      <span>Pas du tout d'accord</span>
                      <span>Tout à fait d'accord</span>
                    </div>
                    <RadioGroup
                      value={formData.answers[questions[currentStep - 1].id] || ""}
                      onValueChange={(value) => updateAnswer(questions[currentStep - 1].id, value)}
                      className="flex justify-between"
                    >
                      {[0, 1, 2, 3, 4, 5].map((value) => (
                        <div key={value} className="flex flex-col items-center space-y-2">
                          <RadioGroupItem
                            value={value.toString()}
                            id={`${questions[currentStep - 1].id}-${value}`}
                            className="w-6 h-6"
                          />
                          <Label
                            htmlFor={`${questions[currentStep - 1].id}-${value}`}
                            className="text-lg font-medium cursor-pointer"
                          >
                            {value}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ) : (
                  <RadioGroup
                    value={formData.answers[questions[currentStep - 1].id] || ""}
                    onValueChange={(value) => updateAnswer(questions[currentStep - 1].id, value)}
                    className="space-y-3"
                  >
                    {questions[currentStep - 1].options?.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50"
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="text-lg cursor-pointer flex-1">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            )}
          </CardContent>

          <div className="p-6 pt-0">
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
            >
              {currentStep === questions.length ? "Terminer l'évaluation" : "Suivant"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
