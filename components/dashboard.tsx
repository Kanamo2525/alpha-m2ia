"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BarChart3, Users, TrendingUp, Activity } from "lucide-react"

interface DashboardProps {
  onBack: () => void
}

export default function Dashboard({ onBack }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-red-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord - Enquête IA</h1>
              <p className="text-gray-600 mt-2">Suivi en temps réel des résultats de l'enquête</p>
            </div>
            <div className="text-sm text-gray-500">
              Dernière mise à jour :{" "}
              {new Date().toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants totaux</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <p className="text-xs text-muted-foreground">+12% depuis hier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Métiers représentés</CardTitle>
              <BarChart3 className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">47</div>
              <p className="text-xs text-muted-foreground">+3 nouveaux métiers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">87%</div>
              <p className="text-xs text-muted-foreground">+2% cette semaine</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score moyen IA</CardTitle>
              <Activity className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">3.8/5</div>
              <p className="text-xs text-muted-foreground">Stable</p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Metabase */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Analyses détaillées</CardTitle>
            <CardDescription>Visualisations interactives des données de l'enquête sur l'impact de l'IA</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <iframe
              src="https://next.bluenove.io/metabase/public/dashboard/39f9a910-e180-43db-a5d5-858115cfbeb9"
              frameBorder="0"
              width="100%"
              height="800"
              allowTransparency
              className="rounded-b-lg"
              title="Tableau de bord Metabase - Enquête IA"
            />
          </CardContent>
        </Card>

        {/* Informations supplémentaires */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Accès à l'enquête</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Partagez le lien de l'enquête avec vos collaborateurs pour augmenter la participation.
              </p>
              <Button
                onClick={() => window.open("https://next.bluenove.io/survey/ia-groupe-alpha", "_blank")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Ouvrir l'enquête
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Support technique</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Besoin d'aide avec le tableau de bord ou l'enquête ? Contactez notre équipe support.
              </p>
              <Button variant="outline" className="border-blue-600 text-blue-600 bg-transparent">
                Contacter le support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
