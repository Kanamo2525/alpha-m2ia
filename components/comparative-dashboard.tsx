"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, TrendingUp, Users, Target, AlertTriangle } from "lucide-react"

interface ComparativeDashboardProps {
  data: any
  onBack: () => void
}

// Données simulées pour la comparaison
const jobScores = [
  { job: "Développeur informatique", score: 80, level: "Très fort" },
  { job: "Assistant comptable", score: 72, level: "Très fort" },
  { job: "Responsable RH", score: 50, level: "Modéré" },
  { job: "Chargé de clientèle", score: 50, level: "Modéré" },
  { job: "Technicien de maintenance", score: 30, level: "Faible" },
]

const heatmapData = [
  {
    job: "Développeur informatique",
    automation: 16,
    skills: 20,
    activities: 16,
    conditions: 12,
    support: 16,
    total: 80,
  },
  {
    job: "Assistant comptable",
    automation: 18,
    skills: 16,
    activities: 12,
    conditions: 14,
    support: 12,
    total: 72,
  },
  {
    job: "Responsable RH",
    automation: 8,
    skills: 10,
    activities: 12,
    conditions: 8,
    support: 12,
    total: 50,
  },
  {
    job: "Chargé de clientèle",
    automation: 12,
    skills: 14,
    activities: 10,
    conditions: 8,
    support: 6,
    total: 50,
  },
  {
    job: "Technicien de maintenance",
    automation: 4,
    skills: 6,
    activities: 6,
    conditions: 6,
    support: 8,
    total: 30,
  },
]

const recommendations = [
  {
    job: "Assistant comptable",
    score: 78,
    level: "Très fort",
    recommendation: "Suivi renforcé, plan de reconversion",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    job: "Chargé de clientèle",
    score: 52,
    level: "Modéré",
    recommendation: "Sensibilisation, ajustements",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    job: "Technicien de maintenance",
    score: 34,
    level: "Faible",
    recommendation: "Suivi léger, formation continue",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
]

export default function ComparativeDashboard({ data, onBack }: ComparativeDashboardProps) {
  const [selectedJob] = useState(data?.job || "Votre métier")
  const userScore = data?.globalScore || 65

  const BarChart = () => {
    return (
      <div className="space-y-4">
        {jobScores.map((item, index) => {
          const isUserJob = item.job.toLowerCase().includes(selectedJob.toLowerCase().split(" ")[0])
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`font-medium ${isUserJob ? "text-blue-600 font-bold" : "text-gray-700"}`}>
                  {item.job}
                  {isUserJob && <Badge className="ml-2 bg-blue-600 text-white">Vous</Badge>}
                </span>
                <span className={`text-lg font-bold ${isUserJob ? "text-blue-600" : "text-gray-600"}`}>
                  {isUserJob ? userScore : item.score}
                </span>
              </div>
              <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                    isUserJob
                      ? "bg-gradient-to-r from-blue-500 to-blue-600"
                      : "bg-gradient-to-r from-gray-400 to-gray-500"
                  }`}
                  style={{ width: `${isUserJob ? userScore : item.score}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">Niveau d'exposition: {item.level}</div>
            </div>
          )
        })}
      </div>
    )
  }

  const HeatmapChart = () => {
    const dimensions = [
      { key: "automation", label: "Automatisation", max: 20 },
      { key: "skills", label: "Compétences", max: 20 },
      { key: "activities", label: "Activités", max: 20 },
      { key: "conditions", label: "Conditions", max: 20 },
      { key: "support", label: "Accompagnement", max: 20 },
    ]

    const getIntensity = (value: number, max: number) => {
      const intensity = (value / max) * 100
      if (intensity >= 80) return "bg-red-500"
      if (intensity >= 60) return "bg-orange-500"
      if (intensity >= 40) return "bg-yellow-500"
      if (intensity >= 20) return "bg-blue-500"
      return "bg-gray-300"
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 font-medium text-gray-700 border-b">Métier</th>
              {dimensions.map((dim) => (
                <th key={dim.key} className="text-center p-3 font-medium text-gray-700 border-b min-w-24">
                  {dim.label}
                  <div className="text-xs text-gray-500">({dim.max})</div>
                </th>
              ))}
              <th className="text-center p-3 font-medium text-gray-700 border-b">Total</th>
            </tr>
          </thead>
          <tbody>
            {heatmapData.map((row, index) => {
              const isUserJob = row.job.toLowerCase().includes(selectedJob.toLowerCase().split(" ")[0])
              return (
                <tr key={index} className={isUserJob ? "bg-blue-50" : ""}>
                  <td className={`p-3 font-medium border-b ${isUserJob ? "text-blue-600" : "text-gray-700"}`}>
                    {row.job}
                    {isUserJob && <Badge className="ml-2 bg-blue-600 text-white text-xs">Vous</Badge>}
                  </td>
                  {dimensions.map((dim) => (
                    <td key={dim.key} className="p-3 text-center border-b">
                      <div
                        className={`inline-flex items-center justify-center w-8 h-8 rounded text-white text-sm font-medium ${getIntensity(
                          row[dim.key as keyof typeof row] as number,
                          dim.max,
                        )}`}
                      >
                        {row[dim.key as keyof typeof row]}
                      </div>
                    </td>
                  ))}
                  <td className="p-3 text-center border-b">
                    <span className="font-bold text-lg">{isUserJob ? userScore : row.total}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  const ScatterPlot = () => {
    const scatterData = [
      { job: "Développeur informatique", impact: 80, support: 75, isUser: false },
      { job: "Assistant comptable", impact: 72, support: 45, isUser: false },
      { job: "Responsable RH", impact: 50, support: 65, isUser: false },
      { job: "Chargé de clientèle", impact: 50, support: 35, isUser: false },
      { job: "Technicien de maintenance", impact: 30, support: 55, isUser: false },
      { job: selectedJob, impact: userScore, support: 60, isUser: true },
    ]

    return (
      <div className="relative">
        <svg width="100%" height="400" viewBox="0 0 500 400" className="border rounded-lg bg-white">
          {/* Grille */}
          {[0, 25, 50, 75, 100].map((value) => (
            <g key={value}>
              <line
                x1={50 + (value / 100) * 400}
                y1={50}
                x2={50 + (value / 100) * 400}
                y2={350}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <line
                x1={50}
                y1={350 - (value / 100) * 300}
                x2={450}
                y2={350 - (value / 100) * 300}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            </g>
          ))}

          {/* Axes */}
          <line x1={50} y1={350} x2={450} y2={350} stroke="#374151" strokeWidth="2" />
          <line x1={50} y1={50} x2={50} y2={350} stroke="#374151" strokeWidth="2" />

          {/* Labels des axes */}
          <text x={250} y={380} textAnchor="middle" className="text-sm fill-gray-600">
            Facilité à être accompagné
          </text>
          <text x={25} y={200} textAnchor="middle" className="text-sm fill-gray-600" transform="rotate(-90 25 200)">
            Impact IA (score/100)
          </text>

          {/* Points */}
          {scatterData.map((point, index) => (
            <g key={index}>
              <circle
                cx={50 + (point.support / 100) * 400}
                cy={350 - (point.impact / 100) * 300}
                r={point.isUser ? "8" : "6"}
                fill={point.isUser ? "#2563eb" : "#f97316"}
                stroke={point.isUser ? "#1d4ed8" : "#ea580c"}
                strokeWidth="2"
              />
              <text
                x={50 + (point.support / 100) * 400}
                y={350 - (point.impact / 100) * 300 - 15}
                textAnchor="middle"
                className="text-xs fill-gray-700"
                style={{ fontSize: "10px" }}
              >
                {point.job.split(" ")[0]}
              </text>
            </g>
          ))}

          {/* Zones */}
          <rect x={250} y={50} width={200} height={150} fill="rgba(34, 197, 94, 0.1)" stroke="rgba(34, 197, 94, 0.3)" />
          <text x={350} y={70} textAnchor="middle" className="text-xs fill-green-600">
            Bien accompagnés
          </text>
          <text x={350} y={85} textAnchor="middle" className="text-xs fill-green-600">
            Très impactés
          </text>

          <rect x={50} y={200} width={200} height={150} fill="rgba(239, 68, 68, 0.1)" stroke="rgba(239, 68, 68, 0.3)" />
          <text x={150} y={320} textAnchor="middle" className="text-xs fill-red-600">
            Peu accompagnés
          </text>
          <text x={150} y={335} textAnchor="middle" className="text-xs fill-red-600">
            Peu impactés
          </text>
        </svg>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-red-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analyse comparative</h1>
              <p className="text-gray-600 mt-2">Positionnement de votre métier par rapport aux autres</p>
            </div>
            <Badge variant="secondary" className="bg-blue-600 text-white">
              Score: {userScore}/100
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="scores" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scores">Scores par métier</TabsTrigger>
            <TabsTrigger value="heatmap">Carte de chaleur</TabsTrigger>
            <TabsTrigger value="scatter">Positionnement</TabsTrigger>
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          </TabsList>

          <TabsContent value="scores">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Score d'impact IA par métier</span>
                </CardTitle>
                <CardDescription>Comparaison des scores d'exposition à l'IA entre différents métiers</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heatmap">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  <span>Carte de chaleur des impacts IA</span>
                </CardTitle>
                <CardDescription>Impact par dimension pour chaque métier (intensité par couleur)</CardDescription>
              </CardHeader>
              <CardContent>
                <HeatmapChart />
                <div className="mt-4 flex items-center space-x-4 text-sm">
                  <span className="text-gray-600">Intensité:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span>Faible</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Modéré</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Élevé</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span>Très élevé</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Critique</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scatter">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span>Positionnement Impact vs Accompagnement</span>
                </CardTitle>
                <CardDescription>Relation entre l'impact IA et la facilité d'accompagnement par métier</CardDescription>
              </CardHeader>
              <CardContent>
                <ScatterPlot />
                <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    <span>Votre position</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span>Autres métiers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span>Recommandations par métier</span>
                  </CardTitle>
                  <CardDescription>Actions suggérées selon le niveau d'exposition à l'IA</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${rec.bgColor}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{rec.job}</h4>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${rec.color}`}>{rec.score}/100</div>
                            <Badge variant="outline" className={rec.color}>
                              {rec.level}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-700">{rec.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Accompagnement organisationnel</CardTitle>
                  <CardDescription>
                    Évaluez l'accompagnement dont vous bénéficiez dans la mise en place de l'IA
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">
                      De quel accompagnement bénéficiez-vous dans la mise en place de l'IA au sein de votre entreprise ?
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Aucun accompagnement perçu</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Communication descendante uniquement</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Accès à info et formation ponctuelle</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Plan de transformation co-construit</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">💡 Pistes d'amélioration suggérées</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Formation continue aux outils IA sectoriels</li>
                      <li>• Accompagnement personnalisé par métier</li>
                      <li>• Création de communautés de pratique</li>
                      <li>• Mise en place d'un référent IA par service</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
