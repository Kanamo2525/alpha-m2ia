"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import html2canvas from "html2canvas"

interface ResultsVisualizationProps {
  data: any
  onBack: () => void
}

const questionLabels = {
  understanding: "Compréhension des usages IA",
  quality: "Amélioration qualité/efficacité",
  conditions: "Amélioration conditions travail",
  skills: "Transformation compétences",
  implementation: "Facilité mise en œuvre",
  tasks: "Impact tâches quotidiennes",
}

const riskLabels = {
  none: "Aucun risque",
  short: "Court terme",
  medium: "3-5 ans",
  long: "Au-delà de 5 ans",
}

export default function ResultsVisualization({ data, onBack }: ResultsVisualizationProps) {
  const [selectedJob] = useState(data?.job || "Développeur")

  // Données utilisateur (simulées si pas de données réelles)
  const userScores = data
    ? {
        understanding: Number.parseInt(data.answers.understanding || "3"),
        quality: Number.parseInt(data.answers.quality || "3"),
        conditions: Number.parseInt(data.answers.conditions || "3"),
        skills: Number.parseInt(data.answers.skills || "4"),
        implementation: Number.parseInt(data.answers.implementation || "3"),
        tasks: Number.parseInt(data.answers.tasks || "4"),
      }
    : {
        understanding: 3.5,
        quality: 4.0,
        conditions: 3.2,
        skills: 4.2,
        implementation: 3.8,
        tasks: 4.1,
      }

  // Réponse au risque emploi
  const userRisk = data?.answers?.risk || "medium"

  const RadarChart = () => {
    const size = 300
    const center = size / 2
    const radius = 100
    const angles = Object.keys(questionLabels).map((_, i) => (i * 2 * Math.PI) / 6 - Math.PI / 2)

    const getPoint = (value: number, angleIndex: number) => {
      const angle = angles[angleIndex]
      const r = (value / 5) * radius
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
      }
    }

    const userPoints = Object.values(userScores).map((value, i) => getPoint(value, i))

    return (
      <div className="flex justify-center">
        <svg width={size} height={size} className="border rounded-lg bg-white">
          {/* Grille */}
          {[1, 2, 3, 4, 5].map((level) => (
            <circle
              key={level}
              cx={center}
              cy={center}
              r={(level / 5) * radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* Axes */}
          {angles.map((angle, i) => (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* Zone utilisateur */}
          <polygon
            points={userPoints.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="rgba(37, 99, 235, 0.1)"
            stroke="#2563eb"
            strokeWidth="3"
          />

          {/* Points utilisateur */}
          {userPoints.map((point, i) => (
            <circle key={i} cx={point.x} cy={point.y} r="5" fill="#2563eb" />
          ))}

          {/* Labels */}
          {Object.values(questionLabels).map((label, i) => {
            const angle = angles[i]
            const labelRadius = radius + 30
            const x = center + labelRadius * Math.cos(angle)
            const y = center + labelRadius * Math.sin(angle)

            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-gray-600"
                style={{ fontSize: "10px" }}
              >
                {label.split(" ").map((word, j) => (
                  <tspan key={j} x={x} dy={j === 0 ? 0 : "1em"}>
                    {word}
                  </tspan>
                ))}
              </text>
            )
          })}

          {/* Valeurs numériques */}
          {userPoints.map((point, i) => {
            const value = Object.values(userScores)[i]
            return (
              <text
                key={`value-${i}`}
                x={point.x}
                y={point.y - 8}
                textAnchor="middle"
                className="text-xs font-bold fill-blue-600"
                style={{ fontSize: "11px" }}
              >
                {value.toFixed(1)}
              </text>
            )
          })}
        </svg>
      </div>
    )
  }

  const BarChart = () => {
    return (
      <div className="space-y-6">
        {Object.entries(questionLabels).map(([key, label]) => {
          const userValue = userScores[key as keyof typeof userScores]

          return (
            <div key={key} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{label}</span>
                <span className="text-lg font-bold text-blue-600">{userValue.toFixed(1)}/5</span>
              </div>
              <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${(userValue / 5) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 - Pas du tout d'accord</span>
                <span>5 - Tout à fait d'accord</span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const RiskVisualization = () => {
    const riskData = [
      { key: "none", label: "Aucun risque", selected: userRisk === "none" },
      { key: "short", label: "Court terme", selected: userRisk === "short" },
      { key: "medium", label: "3-5 ans", selected: userRisk === "medium" },
      { key: "long", label: "Au-delà de 5 ans", selected: userRisk === "long" },
    ]

    return (
      <div className="space-y-6">
        {/* Graphique en barres horizontales */}
        <div className="space-y-4">
          {riskData.map((item, index) => (
            <div key={item.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{item.label}</span>
                {item.selected && <Badge className="bg-blue-600 text-white">Votre réponse</Badge>}
              </div>
              <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                    item.selected
                      ? "bg-gradient-to-r from-blue-500 to-blue-600"
                      : "bg-gradient-to-r from-gray-300 to-gray-400"
                  }`}
                  style={{ width: item.selected ? "100%" : "20%" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Graphique circulaire simple */}
        <div className="flex justify-center mt-8">
          <div className="relative w-48 h-48">
            <svg width="192" height="192" className="transform -rotate-90">
              <circle cx="96" cy="96" r="80" fill="none" stroke="#e5e7eb" strokeWidth="16" className="opacity-30" />
              {riskData.map((item, index) => {
                const angle = (index / riskData.length) * 360
                const isSelected = item.selected
                return (
                  <circle
                    key={item.key}
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke={isSelected ? "#2563eb" : "#d1d5db"}
                    strokeWidth={isSelected ? "20" : "8"}
                    strokeDasharray={`${2 * Math.PI * 80 * 0.25} ${2 * Math.PI * 80 * 0.75}`}
                    strokeDashoffset={`${-2 * Math.PI * 80 * (index * 0.25)}`}
                    className="transition-all duration-500"
                  />
                )
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {riskLabels[userRisk as keyof typeof riskLabels]}
                </div>
                <div className="text-sm text-gray-600">Votre perception</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleShare = async () => {
    try {
      const shareData = {
        job: selectedJob,
        scores: userScores,
        date: new Date().toISOString(),
      }

      const encodedData = btoa(JSON.stringify(shareData))
      const shareUrl = `${window.location.origin}?results=${encodedData}`

      // Vérifier si l'API Web Share est disponible et supportée
      const canShare =
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          title: `Résultats évaluation IA - ${selectedJob}`,
          text: `Découvrez mon évaluation de l'impact de l'IA sur le métier de ${selectedJob}`,
          url: shareUrl,
        })

      if (canShare) {
        try {
          await navigator.share({
            title: `Résultats évaluation IA - ${selectedJob}`,
            text: `Découvrez mon évaluation de l'impact de l'IA sur le métier de ${selectedJob}`,
            url: shareUrl,
          })
          return // Succès du partage natif
        } catch (shareError) {
          console.log("Partage natif annulé ou échoué, utilisation du fallback")
        }
      }

      // Fallback : copier dans le presse-papiers
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl)

        // Créer une notification temporaire
        const notification = document.createElement("div")
        notification.textContent = "✅ Lien copié dans le presse-papiers !"
        notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        font-weight: 500;
      `

        document.body.appendChild(notification)

        // Supprimer la notification après 3 secondes
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification)
          }
        }, 3000)
      } else {
        // Fallback ultime : sélectionner le texte pour copie manuelle
        const textArea = document.createElement("textarea")
        textArea.value = shareUrl
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        try {
          document.execCommand("copy")
          alert("Lien copié dans le presse-papiers !")
        } catch (err) {
          alert(`Voici le lien à partager :\n\n${shareUrl}`)
        }

        document.body.removeChild(textArea)
      }
    } catch (error) {
      console.error("Erreur lors du partage:", error)

      // En cas d'erreur totale, afficher le lien
      const shareData = {
        job: selectedJob,
        scores: userScores,
        date: new Date().toISOString(),
      }
      const encodedData = btoa(JSON.stringify(shareData))
      const shareUrl = `${window.location.origin}?results=${encodedData}`

      alert(`Une erreur s'est produite. Voici le lien à partager :\n\n${shareUrl}`)
    }
  }

  const handleExport = async () => {
    try {
      const element = document.getElementById("results-container")
      if (!element) return

      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      })

      const link = document.createElement("a")
      link.download = `evaluation-ia-${selectedJob}-${new Date().toISOString().split("T")[0]}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error("Erreur lors de l'export:", error)
      alert("Erreur lors de l'export")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-red-50 py-8 px-4">
      <div id="results-container" className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vos résultats</h1>
              <p className="text-gray-600 mt-2">
                Métier:{" "}
                <Badge variant="secondary" className="ml-2">
                  {selectedJob}
                </Badge>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Évaluation réalisée le{" "}
                {new Date().toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Exporter PNG
              </Button>
            </div>
          </div>
        </div>

        {/* Visualisations */}
        <Tabs defaultValue="radar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="radar">Vue Radar</TabsTrigger>
            <TabsTrigger value="bars">Vue Détaillée</TabsTrigger>
          </TabsList>

          <TabsContent value="radar">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Votre profil d'impact IA</CardTitle>
                <CardDescription>
                  Vue d'ensemble de votre perception de l'impact de l'IA sur votre métier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadarChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bars">
            <Card>
              <CardHeader>
                <CardTitle>Analyse détaillée par dimension</CardTitle>
                <CardDescription>Vos scores détaillés pour chaque aspect de l'impact de l'IA</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Analyse du risque emploi */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Votre perception du risque pour l'emploi</CardTitle>
            <CardDescription>Votre évaluation du risque que représente l'IA pour votre emploi</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskVisualization />
          </CardContent>
        </Card>

        {/* Insights personnalisés */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Analyse de votre profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">Domaines où vous êtes confiant</h4>
                <ul className="space-y-2 text-sm">
                  {Object.entries(userScores)
                    .filter(([_, value]) => value >= 4)
                    .map(([key, value]) => (
                      <li key={key} className="flex items-start space-x-2">
                        <span className="text-green-500">•</span>
                        <span>
                          <strong>{questionLabels[key as keyof typeof questionLabels]}</strong> ({value.toFixed(1)}/5)
                        </span>
                      </li>
                    ))}
                  {Object.entries(userScores).filter(([_, value]) => value >= 4).length === 0 && (
                    <li className="text-gray-500 italic">Aucun domaine avec un score élevé (≥4)</li>
                  )}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-orange-600">Domaines d'incertitude</h4>
                <ul className="space-y-2 text-sm">
                  {Object.entries(userScores)
                    .filter(([_, value]) => value <= 2)
                    .map(([key, value]) => (
                      <li key={key} className="flex items-start space-x-2">
                        <span className="text-orange-500">•</span>
                        <span>
                          <strong>{questionLabels[key as keyof typeof questionLabels]}</strong> ({value.toFixed(1)}/5)
                        </span>
                      </li>
                    ))}
                  {Object.entries(userScores).filter(([_, value]) => value <= 2).length === 0 && (
                    <li className="text-gray-500 italic">Aucun domaine avec un score faible (≤2)</li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
