export const EVENT_TYPES = {
  ARK_OF_OSIRIS: { name: "Ark of Osiris", maxPlayers: 30 },
  KVK: { name: "Kingdom vs Kingdom", maxPlayers: null },
  MGE: { name: "Mightiest Governor Event", maxPlayers: null },
  CEROLI_CRISIS: { name: "Ceroli Crisis", maxPlayers: null },
  IANS_BALLADS: { name: "Ian's Ballads", maxPlayers: null },
  SUNSET_CANYON: { name: "Sunset Canyon", maxPlayers: 5 },
  LOST_KINGDOM: { name: "Lost Kingdom", maxPlayers: null },
  GOLDEN_KINGDOM: { name: "Golden Kingdom", maxPlayers: null },
} as const;

export type EventType = keyof typeof EVENT_TYPES;

export const EVENT_STATUS = {
  UPCOMING: "Upcoming",
  ACTIVE: "Active",
  COMPLETED: "Completed",
} as const;

export type EventStatus = keyof typeof EVENT_STATUS;

export interface PlayerWithParticipations {
  id: string;
  playerId: string;
  name: string;
  power: bigint;
  killPoints: bigint;
  inAlliance: boolean;
  createdAt: Date;
  updatedAt: Date;
  participations: {
    id: string;
    participated: boolean;
    score: number | null;
    event: {
      id: string;
      name: string;
      type: string;
    };
  }[];
}

