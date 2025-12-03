"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  getEvent,
  removeParticipant,
  updateParticipation,
  bulkAddParticipants,
  reorderParticipants
} from "@/lib/actions/events";
import { getPlayers } from "@/lib/actions/players";
import { EVENT_TYPES, EVENT_STATUS } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  Plus,
  Trash2,
  Check,
  X,
  Edit,
  Save,
  GripVertical
} from "lucide-react";
import { format } from "date-fns";
import { Player } from "@prisma/client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type EventDetail = Awaited<ReturnType<typeof getEvent>>;
type Participation = NonNullable<EventDetail>["participations"][number];

// Mobile Card View
function SortableCard({
  participation,
  index,
  onToggleParticipation,
  onEditScore,
  onRemove,
  editingScore,
  scoreValue,
  setScoreValue,
  onSaveScore,
}: {
  participation: Participation;
  index: number;
  onToggleParticipation: (id: string, participated: boolean) => void;
  onEditScore: (id: string, score: number | null) => void;
  onRemove: (playerId: string) => void;
  editingScore: string | null;
  scoreValue: string;
  setScoreValue: (value: string) => void;
  onSaveScore: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: participation.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50"
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="p-1.5 rounded hover:bg-slate-700 cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 shrink-0 touch-none"
        >
          <GripVertical size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">#{index + 1}</span>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs font-bold text-slate-900 shrink-0">
              {participation.player.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-slate-100 text-sm truncate">{participation.player.name}</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleParticipation(participation.id, participation.participated)}
                className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                  participation.participated
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {participation.participated ? <Check size={12} /> : <X size={12} />}
                {participation.participated ? "Yes" : "No"}
              </button>
              {editingScore === participation.id ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={scoreValue}
                    onChange={(e) => setScoreValue(e.target.value)}
                    className="w-16 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-center text-slate-100 text-xs"
                    placeholder="0"
                    autoFocus
                  />
                  <button
                    onClick={() => onSaveScore(participation.id)}
                    className="p-1 rounded hover:bg-slate-700 text-slate-300"
                  >
                    <Save size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onEditScore(participation.id, participation.score)}
                  className="px-2 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 flex items-center gap-1"
                >
                  <span className={participation.score ? "text-amber-400 font-semibold" : "text-slate-500"}>
                    {participation.score ?? "—"}
                  </span>
                  <Edit size={10} className="text-slate-500" />
                </button>
              )}
            </div>
            <button
              onClick={() => onRemove(participation.playerId)}
              className="p-1.5 rounded hover:bg-slate-700 text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Desktop Table Row
function SortableRow({
  participation,
  index,
  onToggleParticipation,
  onEditScore,
  onRemove,
  editingScore,
  scoreValue,
  setScoreValue,
  onSaveScore,
}: {
  participation: Participation;
  index: number;
  onToggleParticipation: (id: string, participated: boolean) => void;
  onEditScore: (id: string, score: number | null) => void;
  onRemove: (playerId: string) => void;
  editingScore: string | null;
  scoreValue: string;
  setScoreValue: (value: string) => void;
  onSaveScore: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: participation.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-slate-800/30 group">
      <td className="py-3 px-2 w-12">
        <button
          {...attributes}
          {...listeners}
          className="p-1 rounded hover:bg-slate-700 cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300"
        >
          <GripVertical size={16} />
        </button>
      </td>
      <td className="py-3 px-2 w-12 text-center">
        <span className="text-sm font-mono text-slate-500">{index + 1}</span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-bold text-slate-900">
            {participation.player.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-100">{participation.player.name}</p>
            <p className="text-xs text-slate-500">{participation.player.playerId}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-center">
        <button
          onClick={() => onToggleParticipation(participation.id, participation.participated)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            participation.participated
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {participation.participated ? <Check size={16} /> : <X size={16} />}
        </button>
      </td>
      <td className="py-3 px-4 text-center">
        {editingScore === participation.id ? (
          <div className="flex items-center justify-center gap-2">
            <input
              type="number"
              value={scoreValue}
              onChange={(e) => setScoreValue(e.target.value)}
              className="w-20 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-center text-slate-100"
              placeholder="0"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSaveScore(participation.id)}
            >
              <Save size={14} />
            </Button>
          </div>
        ) : (
          <button
            onClick={() => onEditScore(participation.id, participation.score)}
            className="flex items-center justify-center gap-1 mx-auto px-3 py-1 rounded hover:bg-slate-800 transition-colors"
          >
            <span className={participation.score ? "text-amber-400 font-semibold" : "text-slate-500"}>
              {participation.score ?? "—"}
            </span>
            <Edit size={12} className="text-slate-500" />
          </button>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(participation.playerId)}
        >
          <Trash2 size={16} className="text-red-400" />
        </Button>
      </td>
    </tr>
  );
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<EventDetail>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [showAddPlayers, setShowAddPlayers] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [editingScore, setEditingScore] = useState<string | null>(null);
  const [scoreValue, setScoreValue] = useState("");
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadEvent();
    loadPlayers();
  }, [id]);

  async function loadEvent() {
    const data = await getEvent(id);
    setEvent(data);
    setLoading(false);
  }

  async function loadPlayers() {
    const data = await getPlayers(true);
    setAllPlayers(data);
  }

  async function handleAddParticipants() {
    if (selectedPlayers.length === 0) return;
    await bulkAddParticipants(id, selectedPlayers);
    setSelectedPlayers([]);
    setShowAddPlayers(false);
    loadEvent();
  }

  async function handleRemoveParticipant(playerId: string) {
    await removeParticipant(id, playerId);
    loadEvent();
  }

  async function handleToggleParticipation(participationId: string, participated: boolean) {
    await updateParticipation(participationId, { participated: !participated });
    loadEvent();
  }

  async function handleSaveScore(participationId: string) {
    await updateParticipation(participationId, {
      score: scoreValue ? parseInt(scoreValue) : undefined
    });
    setEditingScore(null);
    setScoreValue("");
    loadEvent();
  }

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id || !event) return;

    const oldIndex = event.participations.findIndex((p) => p.id === active.id);
    const newIndex = event.participations.findIndex((p) => p.id === over.id);

    const newOrder = arrayMove(event.participations, oldIndex, newIndex);

    // Optimistic update
    setEvent({ ...event, participations: newOrder });

    // Persist to DB
    await reorderParticipants(id, newOrder.map((p) => p.id));
  }

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  if (!event) {
    return <div className="py-12 text-center text-slate-500">Event not found</div>;
  }

  const typeInfo = EVENT_TYPES[event.type as keyof typeof EVENT_TYPES];
  const maxPlayers = event.maxPlayers || typeInfo?.maxPlayers;
  const participantIds = event.participations.map((p) => p.playerId);
  const availablePlayers = allPlayers.filter((p) => !participantIds.includes(p.id));
  const canAddMore = !maxPlayers || event.participations.length < maxPlayers;

  const statusColors = {
    UPCOMING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    ACTIVE: "bg-green-500/10 text-green-400 border-green-500/30",
    COMPLETED: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  };

  const sharedProps = {
    onToggleParticipation: handleToggleParticipation,
    onEditScore: (id: string, score: number | null) => {
      setEditingScore(id);
      setScoreValue(score?.toString() || "");
    },
    onRemove: handleRemoveParticipant,
    editingScore,
    scoreValue,
    setScoreValue,
    onSaveScore: handleSaveScore,
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-start gap-3 md:gap-4">
        <Link href="/events">
          <Button variant="ghost" size="sm" className="shrink-0">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-xl md:text-3xl font-bold text-slate-100">{event.name}</h1>
            <span className={`px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm font-medium rounded-full border ${statusColors[event.status as keyof typeof statusColors]}`}>
              {EVENT_STATUS[event.status as keyof typeof EVENT_STATUS]}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {format(new Date(event.startDate), "MMM d, yyyy")}
            </span>
            <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-300 text-xs">
              {typeInfo?.name || event.type}
            </span>
          </div>
        </div>
      </div>

      {event.description && (
        <Card>
          <CardContent className="py-3 md:py-4 px-4 md:px-6">
            <p className="text-slate-300 text-sm">{event.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Participants */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base md:text-lg font-semibold text-slate-100">Participants</h2>
              <span className="text-xs md:text-sm text-slate-400">
                {event.participations.length}{maxPlayers ? ` / ${maxPlayers}` : ""}
              </span>
            </div>
            {canAddMore && (
              <Button size="sm" onClick={() => setShowAddPlayers(true)} className="w-full sm:w-auto">
                <Plus size={16} className="mr-2" />
                Add Players
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {event.participations.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No participants yet. Add alliance members to this event.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={event.participations.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                {/* Mobile Card View */}
                <div className="md:hidden p-3 space-y-2">
                  {event.participations.map((participation, index) => (
                    <SortableCard
                      key={participation.id}
                      participation={participation}
                      index={index}
                      {...sharedProps}
                    />
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="w-12"></th>
                        <th className="text-center py-3 px-2 text-xs font-semibold text-slate-400 uppercase w-12">
                          #
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">
                          Player
                        </th>
                        <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">
                          Participated
                        </th>
                        <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">
                          Score
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {event.participations.map((participation, index) => (
                        <SortableRow
                          key={participation.id}
                          participation={participation}
                          index={index}
                          {...sharedProps}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Add Players Modal */}
      <Modal isOpen={showAddPlayers} onClose={() => setShowAddPlayers(false)} title="Add Participants">
        <div className="space-y-4">
          {availablePlayers.length === 0 ? (
            <p className="text-slate-400 text-center py-4 text-sm">
              All alliance members are already in this event
            </p>
          ) : (
            <>
              <p className="text-sm text-slate-400">
                Select players to add ({selectedPlayers.length} selected)
              </p>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {availablePlayers.map((player) => {
                  const isSelected = selectedPlayers.includes(player.id);
                  return (
                    <button
                      key={player.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedPlayers(selectedPlayers.filter((pid) => pid !== player.id));
                        } else {
                          if (!maxPlayers || event.participations.length + selectedPlayers.length < maxPlayers) {
                            setSelectedPlayers([...selectedPlayers, player.id]);
                          }
                        }
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-amber-500/20 border border-amber-500/30"
                          : "bg-slate-800/50 hover:bg-slate-800 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-bold text-slate-900 shrink-0">
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left min-w-0">
                          <p className="font-medium text-slate-100 text-sm truncate">{player.name}</p>
                          <p className="text-xs text-slate-500">{player.playerId}</p>
                        </div>
                      </div>
                      {isSelected && <Check size={18} className="text-amber-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
              <Button
                onClick={handleAddParticipants}
                disabled={selectedPlayers.length === 0}
                className="w-full"
              >
                Add {selectedPlayers.length} Player{selectedPlayers.length !== 1 ? "s" : ""}
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
