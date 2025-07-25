"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface ExposureFormProps {
  onComplete: (data: any) => void
  onBack: () => void
}

const questions = [
  {
    id: "automation",
    title: "Automatisation des tâches",
    text: "Parmi les tâches de votre métier, combien sont touchées par des outils d'IA (automatisation, assistance, recommandation, etc.) ?",
    maxScore: 20,
    options: [
      { value: "0", label: "Aucune tâche automatisée", score: 0 },
      { value: "5", label: "1 ou 2 tâches marginales", score: 5 },
      { value: "10", label: "Plusieurs tâches partiellement automatisées", score: 10 },
      { value: "20", label: "Une majorité des tâches sont ou vont être automatisées", score: 20 },
    ],
  },
  {
    id: "skills",
    title: "Transformation des compétences",
    text: "Quelle est l'évolution des compétences nécessaires dans votre métier liée à l'introduction d'outils IA ?",
    maxScore: 20,
    options: [
      { value: "0", label: "Pas d'évolution", score: 0 },
      { value: "5", label: "Une légère montée en compétences est requise", score: 5 },
      {
        value: "10",
        label: "De nouvelles compétences numériques ou liées à des modèles IA sont nécessaires",
        score: 10,
      },
      { value: "20", label: "Les compétences-clés ont complètement changé", score: 20 },
    ],
  },
  {
    id: "activities",
    title: "Modification des activités",
    text: "Votre activité a-t-elle été modifiée par l'intégration de l'IA ?",
    maxScore: 20,
    options: [
      { value: "0", label: "Aucune modification", score: 0 },
      { value: "10", label: "Quelques activités ont été ajoutées ou déléguées à des outils", score: 10 },
      { value: "20", label: "Vos missions ont été réorientées ou votre rôle redéfini", score: 20 },
    ],
  },
  {
    id: "conditions",
    title: "Conditions de travail",
    text: "Depuis l'introduction d'outils IA, comment percevez-vous vos conditions de travail ?",
    maxScore: 20,
    type: "scale",
    scaleLabels: {
      0: "Aucun ressenti de changement",
      5: "Ressenti très légèrement positif",
      10: "Ressenti neutre ou mitigé",
      15: "Augmentation modérée de la pression/charge",
      20: "Forte augmentation de la pression/surveillance",
    },
  },
]

export default function ExposureForm({ onComplete, onBack }: ExposureFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    job: "",
    department: "",
    answers: {} as Record<string, string>,
  })

  const progress = ((currentStep + 1) / (questions.length + 2)) * 100

  const handleNext = () => {
    if (currentStep < questions.length + 1) {
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

  const updateDepartment = (department: string) => {
    setFormData((prev) => ({ ...prev, department }))
  }

  const canProceed = () => {
    if (currentStep === 0) {
      return formData.job.trim() !== ""
    }
    if (currentStep === 1) {
      return formData.department.trim() !== ""
    }
    const currentQuestion = questions[currentStep - 2]
    return formData.answers[currentQuestion.id] !== undefined
  }

  const renderStep = () => {
    if (currentStep === 0) {
      return (
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
      )
    }

    if (currentStep === 1) {
      return (
        <div className="space-y-4">
          <Label htmlFor="department" className="text-lg font-medium">
            Quel est votre service / département ?
          </Label>
          <Input
            id="department"
            placeholder="Ex: IT, Marketing, RH, Production, etc."
            value={formData.department}
            onChange={(e) => updateDepartment(e.target.value)}
            className="text-lg py-3"
          />
        </div>
      )
    }

    const question = questions[currentStep - 2]

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-medium text-gray-900">{question.title}</h3>
          <p className="text-gray-600 leading-relaxed">{question.text}</p>
        </div>

        {question.type === "scale" ? (
          <div className="space-y-4">
            <RadioGroup
              value={formData.answers[question.id] || ""}
              onValueChange={(value) => updateAnswer(question.id, value)}
              className="space-y-3"
            >
              {[0, 5, 10, 15, 20].map((value) => (
                <div key={value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value={value.toString()} id={`${question.id}-${value}`} />
                  <Label htmlFor={`${question.id}-${value}`} className="text-base cursor-pointer flex-1">
                    {question.scaleLabels?.[value as keyof typeof question.scaleLabels]}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ) : (
          <RadioGroup
            value={formData.answers[question.id] || ""}
            onValueChange={(value) => updateAnswer(question.id, value)}
            className="space-y-3"
          >
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50">
                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                <Label htmlFor={`${question.id}-${option.value}`} className="text-base cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
    )
  }

  const getStepTitle = () => {
    if (currentStep === 0) return "Informations générales"
    if (currentStep === 1) return "Contexte professionnel"
    return `${questions[currentStep - 2].title} (${currentStep - 1}/${questions.length})`
  }

  const getStepDescription = () => {
    if (currentStep === 0) return "Commençons par identifier votre métier"
    if (currentStep === 1) return "Précisez votre contexte organisationnel"
    return "Sélectionnez la réponse qui correspond le mieux à votre situation"
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
                Étape {currentStep + 1} sur {questions.length + 2}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-gray-900">{getStepTitle()}</CardTitle>
            <CardDescription className="text-lg">{getStepDescription()}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">{renderStep()}</CardContent>

          <div className="p-6 pt-0">
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
            >
              {currentStep === questions.length + 1 ? "Calculer mon score d'exposition" : "Suivant"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
