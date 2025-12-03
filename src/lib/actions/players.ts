"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getPlayers(inAlliance?: boolean) {
  return prisma.player.findMany({
    where: inAlliance !== undefined ? { inAlliance } : undefined,
    orderBy: { power: "desc" },
  });
}

export async function getPlayer(id: string) {
  return prisma.player.findUnique({
    where: { id },
    include: {
      participations: {
        include: { event: true },
        orderBy: { event: { startDate: "desc" } },
      },
    },
  });
}

export async function createPlayer(data: {
  playerId: string;
  name: string;
  power: number;
  killPoints: number;
  inAlliance?: boolean;
}) {
  const player = await prisma.player.create({
    data: {
      playerId: data.playerId,
      name: data.name,
      power: BigInt(data.power),
      killPoints: BigInt(data.killPoints),
      inAlliance: data.inAlliance ?? false,
    },
  });
  revalidatePath("/players");
  revalidatePath("/alliance");
  return player;
}

export async function updatePlayer(
  id: string,
  data: {
    playerId?: string;
    name?: string;
    power?: number;
    killPoints?: number;
    inAlliance?: boolean;
  }
) {
  const player = await prisma.player.update({
    where: { id },
    data: {
      ...(data.playerId && { playerId: data.playerId }),
      ...(data.name && { name: data.name }),
      ...(data.power !== undefined && { power: BigInt(data.power) }),
      ...(data.killPoints !== undefined && { killPoints: BigInt(data.killPoints) }),
      ...(data.inAlliance !== undefined && { inAlliance: data.inAlliance }),
    },
  });
  revalidatePath("/players");
  revalidatePath("/alliance");
  return player;
}

export async function deletePlayer(id: string) {
  await prisma.player.delete({ where: { id } });
  revalidatePath("/players");
  revalidatePath("/alliance");
}

export async function addToAlliance(id: string) {
  return updatePlayer(id, { inAlliance: true });
}

export async function removeFromAlliance(id: string) {
  return updatePlayer(id, { inAlliance: false });
}

