"use client";

import { useState } from "react";
import Link from "next/link";
import { Player } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PlayerForm } from "./player-form";
import { deletePlayer, addToAlliance, removeFromAlliance } from "@/lib/actions/players";
import {
  Trash2,
  Edit,
  UserPlus,
  UserMinus,
  Sword,
  Zap,
  Eye,
  MoreVertical
} from "lucide-react";

interface PlayerTableProps {
  players: Player[];
  showAllianceActions?: boolean;
  isAllianceView?: boolean;
}

function formatNumber(num: bigint): string {
  const n = Number(num);
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export function PlayerTable({ players, showAllianceActions = true, isAllianceView = false }: PlayerTableProps) {
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this player?")) return;
    setLoading(id);
    await deletePlayer(id);
    setLoading(null);
    setOpenMenu(null);
  }

  async function handleAllianceToggle(id: string, inAlliance: boolean) {
    setLoading(id);
    if (inAlliance) {
      await removeFromAlliance(id);
    } else {
      await addToAlliance(id);
    }
    setLoading(null);
    setOpenMenu(null);
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p>No players found</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 p-4">
        {players.map((player) => (
          <div key={player.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-start justify-between gap-3">
              <Link href={`/players/${player.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-bold text-slate-900 shrink-0">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-100 truncate">{player.name}</p>
                  <p className="text-xs text-slate-500 font-mono">{player.playerId}</p>
                </div>
              </Link>
              <div className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === player.id ? null : player.id)}
                  className="p-2 rounded-lg hover:bg-slate-700 text-slate-400"
                >
                  <MoreVertical size={18} />
                </button>
                {openMenu === player.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenMenu(null)}
                    />
                    <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 py-1 min-w-[140px]">
                      <Link
                        href={`/players/${player.id}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-700 text-slate-300"
                        onClick={() => setOpenMenu(null)}
                      >
                        <Eye size={14} /> View
                      </Link>
                      {showAllianceActions && (
                        <button
                          onClick={() => handleAllianceToggle(player.id, player.inAlliance)}
                          disabled={loading === player.id}
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-700 text-slate-300 w-full"
                        >
                          {player.inAlliance ? (
                            <><UserMinus size={14} className="text-red-400" /> Remove</>
                          ) : (
                            <><UserPlus size={14} className="text-green-400" /> Add</>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditPlayer(player);
                          setOpenMenu(null);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-700 text-slate-300 w-full"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(player.id)}
                        disabled={loading === player.id}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-700 text-red-400 w-full"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-700/50">
              <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-amber-400" />
                <span className="text-sm font-semibold text-amber-400">{formatNumber(player.power)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sword size={14} className="text-red-400" />
                <span className="text-sm font-semibold text-red-400">{formatNumber(player.killPoints)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Governor
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Player ID
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center justify-end gap-1">
                  <Zap size={14} /> Power
                </span>
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center justify-end gap-1">
                  <Sword size={14} /> Kill Points
                </span>
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {players.map((player) => (
              <tr key={player.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-bold text-slate-900">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-100">{player.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-400 font-mono text-sm">{player.playerId}</td>
                <td className="py-3 px-4 text-right">
                  <span className="text-amber-400 font-semibold">{formatNumber(player.power)}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-red-400 font-semibold">{formatNumber(player.killPoints)}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/players/${player.id}`}>
                      <Button variant="ghost" size="sm" title="View player">
                        <Eye size={16} className="text-blue-400" />
                      </Button>
                    </Link>
                    {showAllianceActions && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAllianceToggle(player.id, player.inAlliance)}
                        disabled={loading === player.id}
                        title={player.inAlliance ? "Remove from alliance" : "Add to alliance"}
                      >
                        {player.inAlliance ? (
                          <UserMinus size={16} className="text-red-400" />
                        ) : (
                          <UserPlus size={16} className="text-green-400" />
                        )}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditPlayer(player)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(player.id)}
                      disabled={loading === player.id}
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!editPlayer}
        onClose={() => setEditPlayer(null)}
        title="Edit Player"
      >
        {editPlayer && (
          <PlayerForm player={editPlayer} onSuccess={() => setEditPlayer(null)} />
        )}
      </Modal>
    </>
  );
}
