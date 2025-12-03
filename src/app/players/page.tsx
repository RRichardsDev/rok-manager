"use client";

import { useState, useEffect } from "react";
import { Player } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PlayerForm } from "@/components/players/player-form";
import { PlayerTable } from "@/components/players/player-table";
import { Plus, Search } from "lucide-react";
import { getPlayers } from "@/lib/actions/players";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    const data = await getPlayers();
    setPlayers(data);
    setLoading(false);
  }

  const filteredPlayers = players.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.playerId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100">Player Pool</h1>
          <p className="text-slate-400 text-sm md:text-base mt-1">All players available for recruitment</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus size={18} className="mr-2" />
          Add Player
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search players..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="text-sm text-slate-400 text-center sm:text-right">
              {filteredPlayers.length} players
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading...</div>
          ) : (
            <PlayerTable players={filteredPlayers} />
          )}
        </CardContent>
      </Card>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add New Player">
        <PlayerForm
          onSuccess={() => {
            setShowForm(false);
            loadPlayers();
          }}
        />
      </Modal>
    </div>
  );
}
