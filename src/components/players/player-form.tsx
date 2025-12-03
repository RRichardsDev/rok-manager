"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPlayer, updatePlayer } from "@/lib/actions/players";

interface PlayerFormProps {
  player?: {
    id: string;
    playerId: string;
    name: string;
    power: bigint;
    killPoints: bigint;
    inAlliance: boolean;
  };
  onSuccess?: () => void;
  addToAlliance?: boolean;
}

export function PlayerForm({ player, onSuccess, addToAlliance = false }: PlayerFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      playerId: formData.get("playerId") as string,
      name: formData.get("name") as string,
      power: parseInt(formData.get("power") as string) || 0,
      killPoints: parseInt(formData.get("killPoints") as string) || 0,
      inAlliance: addToAlliance,
    };

    try {
      if (player) {
        await updatePlayer(player.id, data);
      } else {
        await createPlayer(data);
      }
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="playerId"
        name="playerId"
        label="Player ID"
        placeholder="In-game player ID"
        defaultValue={player?.playerId}
        required
      />
      <Input
        id="name"
        name="name"
        label="Governor Name"
        placeholder="Player name"
        defaultValue={player?.name}
        required
      />
      <Input
        id="power"
        name="power"
        type="number"
        label="Power"
        placeholder="0"
        defaultValue={player ? Number(player.power) : undefined}
      />
      <Input
        id="killPoints"
        name="killPoints"
        type="number"
        label="Kill Points"
        placeholder="0"
        defaultValue={player ? Number(player.killPoints) : undefined}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : player ? "Update Player" : "Create Player"}
      </Button>
    </form>
  );
}

