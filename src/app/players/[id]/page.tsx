"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PlayerForm } from "@/components/players/player-form";
import { EquipmentGrid } from "@/components/players/equipment-grid";
import { getPlayerWithEquipment, initializeEquipmentSets } from "@/lib/actions/equipment";
import { ArrowLeft, Edit, Zap, Sword, Shield } from "lucide-react";

type PlayerWithEquipment = Awaited<ReturnType<typeof getPlayerWithEquipment>>;

function formatNumber(num: bigint): string {
  const n = Number(num);
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export default function PlayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [player, setPlayer] = useState<PlayerWithEquipment>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayer();
  }, [id]);

  async function loadPlayer() {
    const data = await getPlayerWithEquipment(id);
    if (data) {
      // Initialize equipment sets if needed
      await initializeEquipmentSets(id);
      const updated = await getPlayerWithEquipment(id);
      setPlayer(updated);
    } else {
      setPlayer(data);
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  if (!player) {
    return <div className="py-12 text-center text-slate-500">Player not found</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="space-y-3">
        {/* Back button - own row on mobile */}
        <Link href="/players" className="inline-block md:hidden">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={18} className="mr-1" />
            Back
          </Button>
        </Link>

        <div className="flex items-start gap-3 md:gap-4">
          {/* Back button - inline on desktop */}
          <Link href="/players" className="hidden md:block">
            <Button variant="ghost" size="sm" className="shrink-0">
              <ArrowLeft size={18} />
            </Button>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-lg md:text-2xl font-bold text-slate-900 shrink-0">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-3xl font-bold text-slate-100 truncate">{player.name}</h1>
                <p className="text-slate-400 font-mono text-sm">{player.playerId}</p>
              </div>
              <Button onClick={() => setShowEdit(true)} className="shrink-0">
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-400">Power</p>
                <p className="text-lg md:text-2xl font-bold text-amber-400">{formatNumber(player.power)}</p>
              </div>
              <div className="p-2 md:p-3 rounded-xl bg-amber-500/10">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-400">Kill Points</p>
                <p className="text-lg md:text-2xl font-bold text-red-400">{formatNumber(player.killPoints)}</p>
              </div>
              <div className="p-2 md:p-3 rounded-xl bg-red-500/10">
                <Sword className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-400">Alliance Status</p>
                <p className="text-lg md:text-2xl font-bold text-slate-100">
                  {player.inAlliance ? "Member" : "Not in Alliance"}
                </p>
              </div>
              <div className={`p-2 md:p-3 rounded-xl ${player.inAlliance ? "bg-green-500/10" : "bg-slate-500/10"}`}>
                <Shield className={`w-5 h-5 md:w-6 md:h-6 ${player.inAlliance ? "text-green-400" : "text-slate-400"}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Sets */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-slate-100">Equipment Sets</h2>
          <p className="text-xs md:text-sm text-slate-400">Upload gear and armament screenshots for each set</p>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <EquipmentGrid
            playerId={player.id}
            equipmentSets={player.equipmentSets}
            onUpdate={loadPlayer}
          />
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Player">
        <PlayerForm
          player={player}
          onSuccess={() => {
            setShowEdit(false);
            loadPlayer();
          }}
        />
      </Modal>
    </div>
  );
}
