"use client";

import { useState, useEffect } from "react";
import { Player } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PlayerForm } from "@/components/players/player-form";
import { PlayerTable } from "@/components/players/player-table";
import { Plus, Search, Users } from "lucide-react";
import { getPlayers, addToAlliance } from "@/lib/actions/players";

export default function AlliancePage() {
  const [alliancePlayers, setAlliancePlayers] = useState<Player[]>([]);
  const [poolPlayers, setPoolPlayers] = useState<Player[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPool, setShowPool] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    const [alliance, pool] = await Promise.all([
      getPlayers(true),
      getPlayers(false),
    ]);
    setAlliancePlayers(alliance);
    setPoolPlayers(pool);
    setLoading(false);
  }

  async function handleAddFromPool(playerId: string) {
    await addToAlliance(playerId);
    loadPlayers();
  }

  const filteredPlayers = alliancePlayers.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.playerId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100">Alliance Roster</h1>
          <p className="text-slate-400 text-sm md:text-base mt-1">Current alliance members</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" onClick={() => setShowPool(true)} className="w-full sm:w-auto">
            <Users size={18} className="mr-2" />
            Add from Pool
          </Button>
          <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
            <Plus size={18} className="mr-2" />
            New Member
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="text-sm text-slate-400 text-center sm:text-right">
              {filteredPlayers.length} / 200 members
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading...</div>
          ) : (
            <PlayerTable players={filteredPlayers} isAllianceView />
          )}
        </CardContent>
      </Card>

      {/* Add from pool modal */}
      <Modal isOpen={showPool} onClose={() => setShowPool(false)} title="Add from Player Pool">
        <div className="space-y-4">
          {poolPlayers.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No players in pool</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {poolPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-100 truncate">{player.name}</p>
                    <p className="text-sm text-slate-500">{player.playerId}</p>
                  </div>
                  <Button size="sm" onClick={() => handleAddFromPool(player.id)} className="ml-3 shrink-0">
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* New member form modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add New Alliance Member">
        <PlayerForm
          addToAlliance
          onSuccess={() => {
            setShowForm(false);
            loadPlayers();
          }}
        />
      </Modal>
    </div>
  );
}
