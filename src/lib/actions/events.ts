"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getEvents(status?: string) {
  return prisma.event.findMany({
    where: status ? { status } : undefined,
    orderBy: { startDate: "desc" },
    include: {
      participations: {
        include: { player: true },
      },
    },
  });
}

export async function getEvent(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      participations: {
        include: { player: true },
        orderBy: { position: "asc" },
      },
    },
  });
}

export async function createEvent(data: {
  name: string;
  type: string;
  maxPlayers?: number;
  startDate: Date;
  endDate?: Date;
  description?: string;
}) {
  const event = await prisma.event.create({
    data: {
      name: data.name,
      type: data.type,
      maxPlayers: data.maxPlayers,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
    },
  });
  revalidatePath("/events");
  return event;
}

export async function updateEvent(
  id: string,
  data: {
    name?: string;
    type?: string;
    maxPlayers?: number;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    description?: string;
  }
) {
  const event = await prisma.event.update({
    where: { id },
    data,
  });
  revalidatePath("/events");
  revalidatePath(`/events/${id}`);
  return event;
}

export async function deleteEvent(id: string) {
  await prisma.event.delete({ where: { id } });
  revalidatePath("/events");
}

export async function addParticipant(eventId: string, playerId: string) {
  const maxPos = await prisma.eventParticipation.aggregate({
    where: { eventId },
    _max: { position: true },
  });
  const participation = await prisma.eventParticipation.create({
    data: {
      eventId,
      playerId,
      participated: false,
      position: (maxPos._max.position ?? -1) + 1,
    },
  });
  revalidatePath(`/events/${eventId}`);
  return participation;
}

export async function removeParticipant(eventId: string, playerId: string) {
  await prisma.eventParticipation.deleteMany({
    where: { eventId, playerId },
  });
  revalidatePath(`/events/${eventId}`);
}

export async function updateParticipation(
  id: string,
  data: {
    participated?: boolean;
    score?: number;
    notes?: string;
  }
) {
  const participation = await prisma.eventParticipation.update({
    where: { id },
    data,
  });
  revalidatePath("/events");
  return participation;
}

export async function bulkAddParticipants(eventId: string, playerIds: string[]) {
  // Get current max position
  const maxPos = await prisma.eventParticipation.aggregate({
    where: { eventId },
    _max: { position: true },
  });
  let nextPosition = (maxPos._max.position ?? -1) + 1;

  for (const playerId of playerIds) {
    await prisma.eventParticipation.upsert({
      where: { playerId_eventId: { playerId, eventId } },
      update: {},
      create: { eventId, playerId, participated: false, position: nextPosition++ },
    });
  }
  revalidatePath(`/events/${eventId}`);
}

export async function reorderParticipants(eventId: string, orderedIds: string[]) {
  for (let i = 0; i < orderedIds.length; i++) {
    await prisma.eventParticipation.update({
      where: { id: orderedIds[i] },
      data: { position: i },
    });
  }
  revalidatePath(`/events/${eventId}`);
}

