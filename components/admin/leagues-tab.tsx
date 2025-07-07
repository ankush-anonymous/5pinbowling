"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Plus, Edit, Save, X } from "lucide-react"

const initialLeagues = [
  {
    id: 1,
    name: "Monday Night League",
    players: [
      { name: "John Smith", score: 145 },
      { name: "Sarah Johnson", score: 132 },
      { name: "Mike Wilson", score: 128 },
      { name: "Lisa Brown", score: 156 },
    ],
  },
  {
    id: 2,
    name: "Weekend Warriors",
    players: [
      { name: "David Chen", score: 142 },
      { name: "Emma Davis", score: 138 },
      { name: "Tom Anderson", score: 151 },
      { name: "Amy Taylor", score: 129 },
    ],
  },
]

export function LeaguesTab() {
  const [leagues, setLeagues] = useState(initialLeagues)
  const [editingLeague, setEditingLeague] = useState<number | null>(null)
  const [newLeagueName, setNewLeagueName] = useState("")
  const [showAddLeague, setShowAddLeague] = useState(false)

  const handleAddLeague = () => {
    if (newLeagueName.trim()) {
      const newLeague = {
        id: Date.now(),
        name: newLeagueName,
        players: [],
      }
      setLeagues([...leagues, newLeague])
      setNewLeagueName("")
      setShowAddLeague(false)
    }
  }

  const handleAddPlayer = (leagueId: number) => {
    const newPlayer = { name: "", score: 0 }
    setLeagues(
      leagues.map((league) =>
        league.id === leagueId ? { ...league, players: [...league.players, newPlayer] } : league,
      ),
    )
  }

  const handleUpdatePlayer = (leagueId: number, playerIndex: number, field: string, value: string | number) => {
    setLeagues(
      leagues.map((league) =>
        league.id === leagueId
          ? {
              ...league,
              players: league.players.map((player, index) =>
                index === playerIndex ? { ...player, [field]: value } : player,
              ),
            }
          : league,
      ),
    )
  }

  const handleRemovePlayer = (leagueId: number, playerIndex: number) => {
    setLeagues(
      leagues.map((league) =>
        league.id === leagueId
          ? { ...league, players: league.players.filter((_, index) => index !== playerIndex) }
          : league,
      ),
    )
  }

  const handleSaveLeague = (leagueId: number) => {
    setEditingLeague(null)
    // Here you would save to your backend
    console.log(
      "Saving league:",
      leagues.find((l) => l.id === leagueId),
    )
  }

  return (
    <div className="space-y-6">
      {/* Add New League */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>League Management</span>
              </CardTitle>
              <CardDescription>Manage bowling leagues and player scores</CardDescription>
            </div>
            <Button onClick={() => setShowAddLeague(true)} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add League</span>
            </Button>
          </div>
        </CardHeader>
        {showAddLeague && (
          <CardContent className="border-t">
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex-1">
                <Label htmlFor="leagueName" className="text-sm font-medium">
                  League Name
                </Label>
                <Input
                  id="leagueName"
                  value={newLeagueName}
                  onChange={(e) => setNewLeagueName(e.target.value)}
                  placeholder="Enter league name"
                  className="mt-1"
                />
              </div>
              <div className="flex space-x-2 pt-6">
                <Button onClick={handleAddLeague} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={() => setShowAddLeague(false)} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Leagues List */}
      {leagues.map((league) => (
        <Card key={league.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{league.name}</CardTitle>
              <div className="flex space-x-2">
                {editingLeague === league.id ? (
                  <>
                    <Button
                      onClick={() => handleSaveLeague(league.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={() => setEditingLeague(null)} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEditingLeague(league.id)} size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Players List */}
              <div className="space-y-3">
                {league.players.map((player, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      {editingLeague === league.id ? (
                        <Input
                          value={player.name}
                          onChange={(e) => handleUpdatePlayer(league.id, index, "name", e.target.value)}
                          placeholder="Player name"
                        />
                      ) : (
                        <span className="font-medium">{player.name}</span>
                      )}
                    </div>
                    <div className="w-24">
                      {editingLeague === league.id ? (
                        <Input
                          type="number"
                          value={player.score}
                          onChange={(e) =>
                            handleUpdatePlayer(league.id, index, "score", Number.parseInt(e.target.value) || 0)
                          }
                          placeholder="Score"
                        />
                      ) : (
                        <span className="text-primary font-bold">{player.score}</span>
                      )}
                    </div>
                    {editingLeague === league.id && (
                      <Button
                        onClick={() => handleRemovePlayer(league.id, index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Player Button */}
              {editingLeague === league.id && (
                <Button onClick={() => handleAddPlayer(league.id)} variant="outline" className="w-full border-dashed">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Player
                </Button>
              )}

              {/* League Stats */}
              {league.players.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{league.players.length}</div>
                      <div className="text-sm text-gray-600">Players</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {Math.max(...league.players.map((p) => p.score))}
                      </div>
                      <div className="text-sm text-gray-600">High Score</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {Math.round(league.players.reduce((sum, p) => sum + p.score, 0) / league.players.length)}
                      </div>
                      <div className="text-sm text-gray-600">Average</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
