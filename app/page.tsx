"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, TrendingUp, Calculator } from "lucide-react"
import EvaluationForm from "@/components/evaluation-form"
import ResultsVisualization from "@/components/results-visualization"
import ExposureForm from "@/components/exposure-form"
import ExposureResults from "@/components/exposure-results"
import Dashboard from "@/components/dashboard"

export default function HomePage() {
  const [currentView, setCurrentView] = useState<
    "home" | "evaluation" | "results" | "exposure" | "exposure-results" | "dashboard"
  >("home")
  const [evaluationData, setEvaluationData] = useState(null)
  const [exposureData, setExposureData] = useState(null)

  const handleEvaluationComplete = (data: any) => {
    setEvaluationData(data)
    setCurrentView("results")
  }

  const handleExposureComplete = (data: any) => {
    setExposureData(data)
    setCurrentView("exposure-results")
  }

  useEffect(() => {
    // Vérifier si des résultats sont partagés via URL
    const urlParams = new URLSearchParams(window.location.search)
    const resultsParam = urlParams.get("results")
    const exposureParam = urlParams.get("exposure")

    if (resultsParam) {
      try {
        const sharedData = JSON.parse(atob(resultsParam))
        setEvaluationData({
          job: sharedData.job,
          answers: Object.fromEntries(Object.entries(sharedData.scores).map(([key, value]) => [key, value.toString()])),
        })
        setCurrentView("results")
      } catch (error) {
        console.error("Erreur lors du décodage des résultats partagés:", error)
      }
    }

    if (exposureParam) {
      try {
        const sharedData = JSON.parse(atob(exposureParam))
        setExposureData({
          job: sharedData.job,
          department: sharedData.department,
          answers: Object.fromEntries(Object.entries(sharedData.scores).map(([key, value]) => [key, value.toString()])),
        })
        setCurrentView("exposure-results")
      } catch (error) {
        console.error("Erreur lors du décodage des résultats d'exposition partagés:", error)
      }
    }
  }, [])

  if (currentView === "evaluation") {
    return <EvaluationForm onComplete={handleEvaluationComplete} onBack={() => setCurrentView("home")} />
  }

  if (currentView === "results") {
    return <ResultsVisualization data={evaluationData} onBack={() => setCurrentView("home")} />
  }

  if (currentView === "exposure") {
    return <ExposureForm onComplete={handleExposureComplete} onBack={() => setCurrentView("home")} />
  }

  if (currentView === "exposure-results") {
    return <ExposureResults data={exposureData} onBack={() => setCurrentView("home")} />
  }

  if (currentView === "dashboard") {
    return <Dashboard onBack={() => setCurrentView("home")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/logo-groupe-alpha.png" alt="Groupe Alpha" className="h-10" />
            </div>
            <Badge variant="secondary" className="bg-blue-600 text-white">
              Évaluation Métier
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">L'impact de l'IA sur votre métier</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Participez à notre évaluation pour comprendre comment l'Intelligence Artificielle transforme votre secteur
            d'activité. Découvrez votre positionnement par rapport aux autres professionnels de votre domaine.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
              onClick={() => window.open("https://next.bluenove.io/survey/ia-groupe-alpha", "_blank")}
            >
              Je participe à l'enquête
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-6 py-3 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
              onClick={() => setCurrentView("evaluation")}
            >
              J'évalue l'impact en 2 minutes
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-6 py-3 border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
              onClick={() => setCurrentView("exposure")}
            >
              Mon score d'exposition IA
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-6 py-3 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
              onClick={() => setCurrentView("dashboard")}
            >
              Je m'informe des résultats
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Nos outils d'évaluation</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Évaluation Personnalisée</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Répondez à 7 questions ciblées pour évaluer l'impact de l'IA sur vos tâches, compétences et conditions
                  de travail.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Score d'Exposition IA</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Calculez votre indice d'exposition à l'IA selon 4 dimensions : automatisation, compétences, activités
                  et conditions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Comparaison Métier</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Comparez vos réponses avec celles d'autres professionnels de votre secteur pour identifier les
                  tendances communes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-red-500" />
                </div>
                <CardTitle className="text-xl">Visualisation Interactive</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Explorez vos résultats à travers des graphiques interactifs et des analyses détaillées de l'impact de
                  l'IA.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 via-red-500 to-yellow-500">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-3xl font-bold text-white mb-6">Votre avis est précieux pour nous !</h3>
          <p className="text-xl text-blue-100 mb-8">
            Partagez avec nous votre vision de l'impact de l'IA sur votre métier. Nous aimerions savoir comment vous
            anticipez son influence sur vos tâches et vos compétences dans les années à venir.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
            onClick={() => window.open("https://next.bluenove.io/survey/ia-groupe-alpha", "_blank")}
          >
            Participer à l'enquête
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src="/logo-groupe-alpha.png" alt="Groupe Alpha" className="h-8" />
          </div>
          <p className="text-gray-400">
            © 2025 Groupe Alpha. Évaluation de l'impact de l'Intelligence Artificielle sur les métiers.
          </p>
        </div>
      </footer>
    </div>
  )
}
