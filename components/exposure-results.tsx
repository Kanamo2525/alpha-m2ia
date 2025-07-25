"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Download, Share2, TrendingUp, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react"
import html2canvas from "html2canvas"

interface ExposureResultsProps {
  data: any
  onBack: () => void
  onCompare?: (data: any) => void
}

// Pondérations selon le modèle défini
const weights = {
  automation: 35,
  skills: 25,
  activities: 23,
  conditions: 17,
}

const dimensionLabels = {
  automation: "Automatisation des tâches",
  skills: "Transformation des compétences",
  activities: "Modification des activités",
  conditions: "Conditions de travail",
}

export default function ExposureResults({ data, onBack, onCompare }: ExposureResultsProps) {
  const [selectedJob] = useState(data?.job || "Métier non spécifié")
  const [selectedDepartment] = useState(data?.department || "Département non spécifié")

  // Calcul du score global
  const calculateGlobalScore = () => {
    const scores = {
      automation: Number.parseInt(data?.answers?.automation || "0"),
      skills: Number.parseInt(data?.answers?.skills || "0"),
      activities: Number.parseInt(data?.answers?.activities || "0"),
      conditions: Number.parseInt(data?.answers?.conditions || "0"),
    }

    const globalScore =
      (scores.automation / 20) * weights.automation +
      (scores.skills / 20) * weights.skills +
      (scores.activities / 20) * weights.activities +
      (scores.conditions / 20) * weights.conditions

    return {
      scores,
      globalScore: Math.round(globalScore * 100) / 100,
    }
  }

  const { scores, globalScore } = calculateGlobalScore()

  const getScoreLevel = (score: number) => {
    if (score < 25) return { level: "Faible", color: "text-green-600", bgColor: "bg-green-100", icon: CheckCircle }
    if (score < 50) return { level: "Modéré", color: "text-yellow-600", bgColor: "bg-yellow-100", icon: AlertTriangle }
    if (score < 75) return { level: "Élevé", color: "text-orange-600", bgColor: "bg-orange-100", icon: TrendingUp }
    return { level: "Très élevé", color: "text-red-600", bgColor: "bg-red-100", icon: AlertTriangle }
  }

  const scoreLevel = getScoreLevel(globalScore)
  const ScoreLevelIcon = scoreLevel.icon

  const handleCompare = () => {
    if (onCompare) {
      onCompare({ ...data, globalScore, scores })
    }
  }

  const RadarChart = () => {
    const size = 300
    const center = size / 2
    const radius = 100
    const angles = Object.keys(dimensionLabels).map((_, i) => (i * 2 * Math.PI) / 4 - Math.PI / 2)

    const getPoint = (value: number, angleIndex: number) => {
      const angle = angles[angleIndex]
      const r = (value / 20) * radius
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
      }
    }

    const userPoints = Object.values(scores).map((value, i) => getPoint(value, i))

    return (
      <div className="flex justify-center">
        <svg width={size} height={size} className="border rounded-lg bg-white">
          {/* Grille */}
          {[5, 10, 15, 20].map((level) => (
            <circle
              key={level}
              cx={center}
              cy={center}
              r={(level / 20) * radius}
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
          {Object.values(dimensionLabels).map((label, i) => {
            const angle = angles[i]
            const labelRadius = radius + 40
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
            const value = Object.values(scores)[i]
            return (
              <text
                key={`value-${i}`}
                x={point.x}
                y={point.y - 8}
                textAnchor="middle"
                className="text-xs font-bold fill-blue-600"
                style={{ fontSize: "11px" }}
              >
                {value}
              </text>
            )
          })}
        </svg>
      </div>
    )
  }

  const DetailedScores = () => {
    return (
      <div className="space-y-6">
        {Object.entries(dimensionLabels).map(([key, label]) => {
          const score = scores[key as keyof typeof scores]
          const weight = weights[key as keyof typeof weights]
          const contribution = ((score / 20) * weight).toFixed(1)

          return (
            <div key={key} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{label}</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-600">{score}/20</span>
                  <div className="text-xs text-gray-500">Poids: {weight}%</div>
                </div>
              </div>
              <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${(score / 20) * 100}%` }}
                />
              </div>
              <div className="text-sm text-gray-600">
                Contribution au score global: <span className="font-medium">{contribution} points</span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const handleShare = async () => {
    try {
      const shareData = {
        job: selectedJob,
        department: selectedDepartment,
        scores,
        globalScore,
        date: new Date().toISOString(),
      }

      const encodedData = btoa(JSON.stringify(shareData))
      const shareUrl = `${window.location.origin}?exposure=${encodedData}`

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl)

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

        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification)
          }
        }, 3000)
      }
    } catch (error) {
      console.error("Erreur lors du partage:", error)
    }
  }

  const handleExport = async () => {
    try {
      const element = document.getElementById("exposure-results-container")
      if (!element) return

      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      })

      const link = document.createElement("a")
      link.download = `score-exposition-ia-${selectedJob}-${new Date().toISOString().split("T")[0]}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error("Erreur lors de l'export:", error)
      alert("Erreur lors de l'export")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-red-50 py-8 px-4">
      <div id="exposure-results-container" className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Score d'exposition à l'IA</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{selectedJob}</Badge>
                <Badge variant="outline">{selectedDepartment}</Badge>
              </div>
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
              <Button variant="outline" size="sm" onClick={handleCompare}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Comparer
              </Button>
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

        {/* Score global */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-2">{globalScore}</div>
                <div className="text-lg text-gray-600">Score sur 100</div>
              </div>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${scoreLevel.bgColor}`}>
                <ScoreLevelIcon className={`h-5 w-5 ${scoreLevel.color}`} />
                <span className={`font-medium ${scoreLevel.color}`}>Exposition {scoreLevel.level}</span>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={globalScore} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Visualisations */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Profil d'exposition par dimension</CardTitle>
              <CardDescription>Répartition de votre exposition à l'IA selon les 4 dimensions clés</CardDescription>
            </CardHeader>
            <CardContent>
              <RadarChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scores détaillés</CardTitle>
              <CardDescription>Contribution de chaque dimension au score global</CardDescription>
            </CardHeader>
            <CardContent>
              <DetailedScores />
            </CardContent>
          </Card>
        </div>

        {/* Interprétation */}
        <Card>
          <CardHeader>
            <CardTitle>Interprétation de votre score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-600">Dimensions les plus impactées</h4>
                <ul className="space-y-2 text-sm">
                  {Object.entries(scores)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 2)
                    .map(([key, value]) => (
                      <li key={key} className="flex items-start space-x-2">
                        <span className="text-blue-500">•</span>
                        <span>
                          <strong>{dimensionLabels[key as keyof typeof dimensionLabels]}</strong> ({value}/20)
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-600">Dimensions moins impactées</h4>
                <ul className="space-y-2 text-sm">
                  {Object.entries(scores)
                    .sort(([, a], [, b]) => a - b)
                    .slice(0, 2)
                    .map(([key, value]) => (
                      <li key={key} className="flex items-start space-x-2">
                        <span className="text-gray-400">•</span>
                        <span>
                          <strong>{dimensionLabels[key as keyof typeof dimensionLabels]}</strong> ({value}/20)
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Que signifie votre score ?</h4>
              <p className="text-blue-700 text-sm">
                {globalScore < 25 &&
                  "Votre métier présente une exposition faible à l'IA. Les transformations sont limitées et progressives."}
                {globalScore >= 25 &&
                  globalScore < 50 &&
                  "Votre métier connaît une exposition modérée à l'IA. Certaines transformations sont en cours ou prévues."}
                {globalScore >= 50 &&
                  globalScore < 75 &&
                  "Votre métier présente une exposition élevée à l'IA. Des transformations significatives sont en cours."}
                {globalScore >= 75 &&
                  "Votre métier présente une exposition très élevée à l'IA. Les transformations sont majeures et touchent tous les aspects."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
