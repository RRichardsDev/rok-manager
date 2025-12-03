"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { GearSlot } from "@/lib/gear-data";

export async function getPlayerWithEquipment(id: string) {
  return prisma.player.findUnique({
    where: { id },
    include: {
      equipmentSets: {
        orderBy: { setNumber: "asc" },
      },
    },
  });
}

export async function updateEquipmentSet(
  playerId: string,
  setNumber: number,
  data: {
    name?: string;
    helmet?: string | null;
    chest?: string | null;
    weapon?: string | null;
    gloves?: string | null;
    legs?: string | null;
    boots?: string | null;
    accessory1?: string | null;
    accessory2?: string | null;
    armamentImageUrl?: string;
  }
) {
  const equipmentSet = await prisma.equipmentSet.upsert({
    where: {
      playerId_setNumber: { playerId, setNumber },
    },
    update: data,
    create: {
      playerId,
      setNumber,
      ...data,
    },
  });
  revalidatePath(`/players/${playerId}`);
  return equipmentSet;
}

export async function setGearSlot(
  playerId: string,
  setNumber: number,
  slot: GearSlot,
  gearId: string | null
) {
  return updateEquipmentSet(playerId, setNumber, { [slot]: gearId });
}

export type GearEnhancement = {
  crit?: boolean;
  attunement?: number; // 0-5
};

export type Enhancements = {
  [slot: string]: GearEnhancement;
};

export async function updateGearEnhancement(
  playerId: string,
  setNumber: number,
  slot: GearSlot,
  enhancement: GearEnhancement
) {
  const set = await prisma.equipmentSet.findUnique({
    where: { playerId_setNumber: { playerId, setNumber } },
  });

  if (!set) return null;

  const currentEnhancements: Enhancements = set.enhancements
    ? JSON.parse(set.enhancements)
    : {};

  currentEnhancements[slot] = {
    ...currentEnhancements[slot],
    ...enhancement,
  };

  const updated = await prisma.equipmentSet.update({
    where: { playerId_setNumber: { playerId, setNumber } },
    data: { enhancements: JSON.stringify(currentEnhancements) },
  });

  revalidatePath(`/players/${playerId}`);
  return updated;
}

export async function initializeEquipmentSets(playerId: string) {
  // Only create the first set if none exist
  const existing = await prisma.equipmentSet.findMany({
    where: { playerId },
  });

  if (existing.length === 0) {
    await prisma.equipmentSet.create({
      data: { playerId, setNumber: 1 },
    });
  }

  return prisma.equipmentSet.findMany({
    where: { playerId },
    orderBy: { setNumber: "asc" },
  });
}

export async function addEquipmentSet(playerId: string) {
  const existing = await prisma.equipmentSet.findMany({
    where: { playerId },
    orderBy: { setNumber: "asc" },
  });

  if (existing.length >= 7) {
    throw new Error("Maximum 7 equipment sets allowed");
  }

  // Find the next available set number
  const usedNumbers = new Set(existing.map((e) => e.setNumber));
  let nextNumber = 1;
  while (usedNumbers.has(nextNumber) && nextNumber <= 7) {
    nextNumber++;
  }

  const newSet = await prisma.equipmentSet.create({
    data: { playerId, setNumber: nextNumber },
  });

  revalidatePath(`/players/${playerId}`);
  return newSet;
}

export async function deleteEquipmentSet(playerId: string, setNumber: number) {
  await prisma.equipmentSet.delete({
    where: { playerId_setNumber: { playerId, setNumber } },
  });
  revalidatePath(`/players/${playerId}`);
}
