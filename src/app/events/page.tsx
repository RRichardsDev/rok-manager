"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EventForm } from "@/components/events/event-form";
import { getEvents, deleteEvent, updateEvent } from "@/lib/actions/events";
import { EVENT_TYPES, EVENT_STATUS } from "@/lib/types";
import { Plus, Calendar, Users, Trash2, Play, CheckCircle, ChevronRight } from "lucide-react";
import { format } from "date-fns";

type EventWithParticipations = Awaited<ReturnType<typeof getEvents>>[number];

export default function EventsPage() {
  const [events, setEvents] = useState<EventWithParticipations[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    const data = await getEvents();
    setEvents(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    await deleteEvent(id);
    loadEvents();
  }

  async function handleStatusChange(id: string, status: string) {
    await updateEvent(id, { status });
    loadEvents();
  }

  const filteredEvents = filter === "ALL"
    ? events
    : events.filter(e => e.status === filter);

  const statusColors = {
    UPCOMING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    ACTIVE: "bg-green-500/10 text-green-400 border-green-500/30",
    COMPLETED: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100">Events</h1>
          <p className="text-slate-400 text-sm md:text-base mt-1">Manage alliance events and participation</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus size={18} className="mr-2" />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={filter === "ALL" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setFilter("ALL")}
        >
          All
        </Button>
        {Object.entries(EVENT_STATUS).map(([key, label]) => (
          <Button
            key={key}
            variant={filter === key ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Events List */}
      {loading ? (
        <div className="py-12 text-center text-slate-500">Loading...</div>
      ) : filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            No events found
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:gap-4">
          {filteredEvents.map((event) => {
            const typeInfo = EVENT_TYPES[event.type as keyof typeof EVENT_TYPES];
            const participantCount = event.participations.length;
            const maxPlayers = event.maxPlayers || typeInfo?.maxPlayers;

            return (
              <Card key={event.id} className="hover:border-slate-600 transition-colors">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <Link href={`/events/${event.id}`} className="flex-1 p-4 md:p-6 flex items-center gap-4 md:gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-base md:text-lg font-semibold text-slate-100 truncate">{event.name}</h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full border shrink-0 ${statusColors[event.status as keyof typeof statusColors]}`}>
                            {EVENT_STATUS[event.status as keyof typeof EVENT_STATUS]}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {format(new Date(event.startDate), "MMM d, yyyy")}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-300 text-xs">
                            {typeInfo?.name || event.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {participantCount}{maxPlayers ? ` / ${maxPlayers}` : ""}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="text-slate-500 hidden md:block" />
                    </Link>

                    <div className="flex items-center gap-2 px-4 pb-4 md:pb-0 md:pr-6 md:border-l border-slate-700/50 md:pl-6">
                      {event.status === "UPCOMING" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(event.id, "ACTIVE")}
                          title="Start Event"
                        >
                          <Play size={16} className="text-green-400" />
                        </Button>
                      )}
                      {event.status === "ACTIVE" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(event.id, "COMPLETED")}
                          title="Complete Event"
                        >
                          <CheckCircle size={16} className="text-amber-400" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create Event">
        <EventForm
          onSuccess={() => {
            setShowForm(false);
            loadEvents();
          }}
        />
      </Modal>
    </div>
  );
}
