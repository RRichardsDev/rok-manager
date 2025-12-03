"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createEvent, updateEvent } from "@/lib/actions/events";
import { EVENT_TYPES, EventType } from "@/lib/types";

interface EventFormProps {
  event?: {
    id: string;
    name: string;
    type: string;
    maxPlayers: number | null;
    startDate: Date;
    endDate: Date | null;
    description: string | null;
  };
  onSuccess?: () => void;
}

const eventTypeOptions = Object.entries(EVENT_TYPES).map(([key, value]) => ({
  value: key,
  label: value.name,
}));

export function EventForm({ event, onSuccess }: EventFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<EventType>(
    (event?.type as EventType) || "ARK_OF_OSIRIS"
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const typeKey = formData.get("type") as EventType;
    const eventTypeInfo = EVENT_TYPES[typeKey];

    const maxPlayersInput = formData.get("maxPlayers") as string;
    const data = {
      name: formData.get("name") as string,
      type: typeKey,
      maxPlayers: eventTypeInfo.maxPlayers || (maxPlayersInput ? parseInt(maxPlayersInput) : undefined),
      startDate: new Date(formData.get("startDate") as string),
      endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string) : undefined,
      description: formData.get("description") as string || undefined,
    };

    try {
      if (event) {
        await updateEvent(event.id, data);
      } else {
        await createEvent(data);
      }
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  }

  const currentTypeInfo = EVENT_TYPES[selectedType];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        name="name"
        label="Event Name"
        placeholder="e.g., Ark Season 5"
        defaultValue={event?.name}
        required
      />

      <Select
        id="type"
        name="type"
        label="Event Type"
        options={eventTypeOptions}
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value as EventType)}
      />

      {!currentTypeInfo.maxPlayers && (
        <Input
          id="maxPlayers"
          name="maxPlayers"
          type="number"
          label="Max Players (optional)"
          placeholder="Leave empty for unlimited"
          defaultValue={event?.maxPlayers || undefined}
        />
      )}

      {currentTypeInfo.maxPlayers && (
        <p className="text-sm text-slate-400">
          Max players: <span className="text-amber-400">{currentTypeInfo.maxPlayers}</span>
        </p>
      )}

      <Input
        id="startDate"
        name="startDate"
        type="datetime-local"
        label="Start Date"
        defaultValue={event?.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : undefined}
        required
      />

      <Input
        id="endDate"
        name="endDate"
        type="datetime-local"
        label="End Date (optional)"
        defaultValue={event?.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : undefined}
      />

      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-slate-300">
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Event notes..."
          defaultValue={event?.description || ""}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : event ? "Update Event" : "Create Event"}
      </Button>
    </form>
  );
}

