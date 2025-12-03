"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { EquipmentSet } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { setGearSlot, updateEquipmentSet, addEquipmentSet, deleteEquipmentSet, updateGearEnhancement, Enhancements, GearEnhancement } from "@/lib/actions/equipment";
import { GEAR_SLOTS, GEAR_ITEMS, RARITY_STYLES, RARITY_COLORS, RARITY_BORDER, getGearForSlot, GearSlot, calculateSetStats, TROOP_TYPES, STAT_TYPES, TROOP_ICONS, GearStats } from "@/lib/gear-data";
import { Edit, Check, X, Plus, Trash2, Sparkles, Star } from "lucide-react";

interface EquipmentGridProps {
  playerId: string;
  equipmentSets: EquipmentSet[];
  onUpdate: () => void;
}

const DEFAULT_SET_NAMES = [
  "Set 1", "Set 2", "Set 3", "Set 4", "Set 5", "Set 6", "Set 7",
];

// Stats display component
function StatsDisplay({ stats }: { stats: GearStats }) {
  const hasStats = TROOP_TYPES.some(troop => stats[troop] && Object.keys(stats[troop]!).length > 0);

  if (!hasStats) {
    return (
      <div className="text-xs text-slate-500 italic">No stats</div>
    );
  }

  return (
    <div className="space-y-2">
      {TROOP_TYPES.map(troopType => {
        const troopStats = stats[troopType];
        if (!troopStats || Object.keys(troopStats).length === 0) return null;

        return (
          <div key={troopType} className="text-xs">
            <div className="flex items-center gap-1 text-slate-400 mb-0.5">
              <span>{TROOP_ICONS[troopType]}</span>
              <span className="capitalize">{troopType}</span>
            </div>
            <div className="flex flex-col gap-0.5 pl-4">
              {STAT_TYPES.map(statType => {
                const value = troopStats[statType];
                if (!value) return null;
                return (
                  <div key={statType} className="text-slate-300">
                    <span className="text-slate-500 capitalize">{statType}:</span>
                    <span className="text-green-400 ml-1">+{value}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Gear slot button component - rotated 45deg with upright icon
function GearSlotButton({
  slot,
  gearId,
  enhancement,
  onClick,
  onContextMenu,
}: {
  slot: GearSlot;
  gearId: string | null;
  enhancement?: GearEnhancement;
  onClick: () => void;
  onContextMenu: (e: { clientX: number; clientY: number; preventDefault: () => void }) => void;
}) {
  const slotInfo = GEAR_SLOTS[slot];
  const gear = gearId ? GEAR_ITEMS[gearId] : null;
  const hasAttunement = (enhancement?.attunement ?? 0) > 0;
  const hasCrit = enhancement?.crit ?? false;

  // Long press handling for mobile
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };

    longPressTimer.current = setTimeout(() => {
      if (touchStart.current && gear) {
        e.preventDefault();
        onContextMenu({
          clientX: touchStart.current.x,
          clientY: touchStart.current.y,
          preventDefault: () => {},
        });
      }
    }, 500); // 500ms long press
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    touchStart.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Cancel long press if finger moves too much
    if (touchStart.current) {
      const touch = e.touches[0];
      const dx = Math.abs(touch.clientX - touchStart.current.x);
      const dy = Math.abs(touch.clientY - touchStart.current.y);
      if (dx > 10 || dy > 10) {
        handleTouchEnd();
      }
    }
  };

  const gearStyle = gear ? {
    background: RARITY_STYLES[gear.rarity].gradient,
    borderColor: RARITY_STYLES[gear.rarity].border,
  } : {};

  return (
    <div className="relative">
      {/* Gold glow for attuned items */}
      {hasAttunement && gear && (
        <div className="absolute inset-0 rounded-md bg-amber-400/40 blur-md animate-pulse" style={{ transform: 'rotate(45deg)' }} />
      )}
      <button
        onClick={onClick}
        onContextMenu={onContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchCancel={handleTouchEnd}
        style={{
          transform: 'rotate(45deg)',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          ...gearStyle,
        }}
        className={`
          relative w-11 h-11 md:w-12 md:h-12 rounded-md border-2
          flex items-center justify-center
          transition-all hover:scale-110 active:scale-95
          select-none touch-manipulation
          ${gear
            ? "shadow-lg"
            : "bg-slate-800/80 border-slate-600 border-dashed hover:border-slate-500"
          }
          ${hasAttunement ? "ring-2 ring-inset ring-yellow-400" : ""}
        `}
        title={gear ? `${gear.name}${hasCrit ? " (Crit)" : ""}${hasAttunement ? ` (Attuned +${enhancement?.attunement})` : ""}` : `Empty ${slotInfo.name}`}
      >
        <span className="text-xl md:text-2xl" style={{ transform: 'rotate(-45deg)' }}>
          {gear ? gear.icon : <span className="text-slate-500 text-lg">{slotInfo.icon}</span>}
        </span>
        {/* Crit indicator */}
        {hasCrit && gear && (
          <span className="absolute top-[1px] right-[1px] text-xs" style={{ transform: 'rotate(-45deg)' }}>⚡</span>
        )}
        {/* Attunement Roman numerals - positioned at bottom point of diamond */}
        {hasAttunement && gear && (
          <span className="absolute bottom-[2px] right-[2px] text-[9px] font-bold text-yellow-300 drop-shadow-md text-center w-[14px]" style={{ transform: 'rotate(-45deg)' }}>
            {["", "I", "II", "III", "IV", "V"][enhancement?.attunement ?? 0]}
          </span>
        )}
      </button>
    </div>
  );
}

// Context menu for gear enhancements
function GearContextMenu({
  position,
  enhancement,
  onClose,
  onToggleCrit,
  onSetAttunement,
}: {
  position: { x: number; y: number };
  enhancement: GearEnhancement;
  onClose: () => void;
  onToggleCrit: () => void;
  onSetAttunement: (level: number) => void;
}) {
  // Adjust position to stay within viewport
  const menuWidth = 160;
  const menuHeight = 250;
  const x = Math.min(position.x, window.innerWidth - menuWidth - 10);
  const y = Math.min(position.y, window.innerHeight - menuHeight - 10);

  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <div
        className="fixed z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 min-w-[160px]"
        style={{ left: Math.max(10, x), top: Math.max(10, y) }}
      >
        <button
          onClick={() => { onToggleCrit(); onClose(); }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-700 text-left"
        >
          <Sparkles size={14} className={enhancement.crit ? "text-amber-400" : "text-slate-500"} />
          <span className="text-slate-200">Crit</span>
          {enhancement.crit && <Check size={14} className="ml-auto text-green-400" />}
        </button>
        <div className="border-t border-slate-700 my-1" />
        <div className="px-3 py-1 text-xs text-slate-500">Attunement</div>
        {[0, 1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => { onSetAttunement(level); onClose(); }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-slate-700 text-left"
          >
            <span className="text-amber-400 w-16">
              {level === 0 ? "None" : "★".repeat(level)}
            </span>
            {enhancement.attunement === level && <Check size={14} className="ml-auto text-green-400" />}
          </button>
        ))}
      </div>
    </>
  );
}

// Diamond layout for gear slots - mimics RoK layout with tight spacing
function GearDiamond({
  set,
  enhancements,
  onSlotClick,
  onSlotContextMenu,
}: {
  set: EquipmentSet;
  enhancements: Enhancements;
  onSlotClick: (slot: GearSlot) => void;
  onSlotContextMenu: (slot: GearSlot, e: { clientX: number; clientY: number; preventDefault: () => void }) => void;
}) {
  const slots: { slot: GearSlot; gearId: string | null }[] = [
    { slot: "helmet", gearId: set.helmet },
    { slot: "chest", gearId: set.chest },
    { slot: "weapon", gearId: set.weapon },
    { slot: "gloves", gearId: set.gloves },
    { slot: "legs", gearId: set.legs },
    { slot: "boots", gearId: set.boots },
    { slot: "accessory1", gearId: set.accessory1 },
    { slot: "accessory2", gearId: set.accessory2 },
  ];

  const renderSlot = (slot: GearSlot, gearId: string | null) => (
    <GearSlotButton
      slot={slot}
      gearId={gearId}
      enhancement={enhancements[slot]}
      onClick={() => onSlotClick(slot)}
      onContextMenu={(e) => onSlotContextMenu(slot, e)}
    />
  );

  return (
    <div className="flex flex-col items-center py-2">
      {/* Row 1: Helmet - separate from the rest */}
      <div className="flex justify-center z-[6]" style={{ marginBottom: '17px' }}>
        {renderSlot("helmet", set.helmet)}
      </div>

      {/* Row 2: Chest/Body */}
      <div className="flex justify-center z-[5] mb-[-8px]">
        {renderSlot("chest", set.chest)}
      </div>

      {/* Row 3: Weapon & Gloves */}
      <div className="flex justify-center z-[4] mb-[-8px]" style={{ gap: '24px' }}>
        {renderSlot("weapon", set.weapon)}
        {renderSlot("gloves", set.gloves)}
      </div>

      {/* Row 4: Legs */}
      <div className="flex justify-center z-[3] mb-[-8px]">
        {renderSlot("legs", set.legs)}
      </div>

      {/* Row 5: Accessory1 & Accessory2 */}
      <div className="flex justify-center z-[2] mb-[-8px]" style={{ gap: '24px' }}>
        {renderSlot("accessory1", set.accessory1)}
        {renderSlot("accessory2", set.accessory2)}
      </div>

      {/* Row 6: Boots */}
      <div className="flex justify-center z-[1]">
        {renderSlot("boots", set.boots)}
      </div>
    </div>
  );
}

export function EquipmentGrid({ playerId, equipmentSets, onUpdate }: EquipmentGridProps) {
  const [editingName, setEditingName] = useState<number | null>(null);
  const [nameValue, setNameValue] = useState("");
  const [selectingGear, setSelectingGear] = useState<{ setNumber: number; slot: GearSlot } | null>(null);
  const [adding, setAdding] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    setNumber: number;
    slot: GearSlot;
    position: { x: number; y: number };
    enhancement: GearEnhancement;
  } | null>(null);

  async function handleSaveName(setNumber: number) {
    await updateEquipmentSet(playerId, setNumber, { name: nameValue || undefined });
    setEditingName(null);
    setNameValue("");
    onUpdate();
  }

  async function handleSelectGear(gearId: string | null) {
    if (!selectingGear) return;
    await setGearSlot(playerId, selectingGear.setNumber, selectingGear.slot, gearId);
    // Reset enhancements if gear is removed
    if (gearId === null) {
      await updateGearEnhancement(playerId, selectingGear.setNumber, selectingGear.slot, {
        crit: false,
        attunement: 0,
      });
    }
    setSelectingGear(null);
    onUpdate();
  }

  async function handleAddSet() {
    setAdding(true);
    try {
      await addEquipmentSet(playerId);
      onUpdate();
    } finally {
      setAdding(false);
    }
  }

  async function handleDeleteSet(setNumber: number) {
    if (!confirm("Delete this equipment set?")) return;
    await deleteEquipmentSet(playerId, setNumber);
    onUpdate();
  }

  function handleContextMenu(setNumber: number, slot: GearSlot, e: { clientX: number; clientY: number; preventDefault: () => void }, enhancements: Enhancements) {
    e.preventDefault();
    const set = equipmentSets.find(s => s.setNumber === setNumber);
    const gearId = set ? (set as any)[slot] : null;
    if (!gearId) return; // Only show context menu for equipped gear

    setContextMenu({
      setNumber,
      slot,
      position: { x: e.clientX, y: e.clientY },
      enhancement: enhancements[slot] || {},
    });
  }

  async function handleToggleCrit() {
    if (!contextMenu) return;
    await updateGearEnhancement(playerId, contextMenu.setNumber, contextMenu.slot, {
      crit: !contextMenu.enhancement.crit,
    });
    onUpdate();
  }

  async function handleSetAttunement(level: number) {
    if (!contextMenu) return;
    await updateGearEnhancement(playerId, contextMenu.setNumber, contextMenu.slot, {
      attunement: level,
    });
    onUpdate();
  }

  // Use actual equipment sets from database
  const sets = equipmentSets.sort((a, b) => a.setNumber - b.setNumber);
  const canAddMore = sets.length < 7;

  const availableGear = selectingGear ? getGearForSlot(selectingGear.slot) : [];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {sets.map((set) => {
          const equippedGear = [set.helmet, set.chest, set.weapon, set.gloves, set.legs, set.boots, set.accessory1, set.accessory2];
          const setStats = calculateSetStats(equippedGear);
          const enhancements: Enhancements = set.enhancements ? JSON.parse(set.enhancements) : {};

          return (
            <Card key={set.setNumber} className="overflow-hidden">
              <CardHeader className="py-2 md:py-3 px-3 md:px-4">
                <div className="flex items-center justify-between">
                  {editingName === set.setNumber ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        placeholder={DEFAULT_SET_NAMES[set.setNumber - 1]}
                        className="h-7 text-sm"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveName(set.setNumber)}
                        className="shrink-0"
                      >
                        <Check size={14} />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-slate-200 text-sm">
                        {set.name || DEFAULT_SET_NAMES[set.setNumber - 1]}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingName(set.setNumber);
                            setNameValue(set.name || "");
                          }}
                        >
                          <Edit size={14} />
                        </Button>
                        {sets.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSet(set.setNumber)}
                          >
                            <Trash2 size={14} className="text-red-400" />
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-3 md:p-4 pt-0">
                <div className="flex gap-3">
                  {/* Stats on the left */}
                  <div className="flex-1 min-w-0 pr-2 border-r border-slate-700/50">
                    <StatsDisplay stats={setStats} />
                  </div>
                  {/* Gear diamond on the right */}
                  <div className="shrink-0">
                    <GearDiamond
                      set={set}
                      enhancements={enhancements}
                      onSlotClick={(slot) => setSelectingGear({ setNumber: set.setNumber, slot })}
                      onSlotContextMenu={(slot, e) => handleContextMenu(set.setNumber, slot, e, enhancements)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add New Set Button */}
        {canAddMore && (
          <Card className="overflow-hidden border-dashed border-slate-600 hover:border-slate-500 transition-colors">
            <button
              onClick={handleAddSet}
              disabled={adding}
              className="w-full h-full min-h-[300px] flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-slate-400 transition-colors"
            >
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                <Plus size={24} />
              </div>
              <span className="text-sm font-medium">
                {adding ? "Adding..." : "Add Equipment Set"}
              </span>
              <span className="text-xs text-slate-600">{sets.length} / 7</span>
            </button>
          </Card>
        )}
      </div>

      {/* Gear Selection Modal */}
      <Modal
        isOpen={!!selectingGear}
        onClose={() => setSelectingGear(null)}
        title={selectingGear ? `Select ${GEAR_SLOTS[selectingGear.slot].name}` : "Select Gear"}
      >
        <div className="space-y-3">
          {/* Clear slot option */}
          <button
            onClick={() => handleSelectGear(null)}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-transparent hover:border-slate-600 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
              <X size={20} className="text-slate-400" />
            </div>
            <span className="text-slate-400">Empty Slot</span>
          </button>

          {/* Available gear */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {availableGear.map((gear) => (
              <button
                key={gear.id}
                onClick={() => handleSelectGear(gear.id)}
                className="w-full flex items-start gap-3 p-3 rounded-lg border transition-colors hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  borderColor: RARITY_STYLES[gear.rarity].border,
                  background: `linear-gradient(to right, ${RARITY_STYLES[gear.rarity].border}15, transparent)`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-md shrink-0"
                  style={{ background: RARITY_STYLES[gear.rarity].gradient }}
                >
                  {gear.icon}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-medium text-slate-100">{gear.name}</p>
                  <p className="text-xs text-slate-400 capitalize mb-1">{gear.rarity}</p>
                  <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs">
                    {TROOP_TYPES.map(troopType => {
                      const troopStats = gear.stats[troopType];
                      if (!troopStats) return null;
                      return (
                        <span key={troopType} className="text-slate-400">
                          {TROOP_ICONS[troopType]}
                          {STAT_TYPES.map(statType => {
                            const value = troopStats[statType];
                            if (!value) return null;
                            return (
                              <span key={statType} className="text-green-400 ml-0.5">
                                +{value}%
                              </span>
                            );
                          })}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {availableGear.length === 0 && (
            <p className="text-center text-slate-500 py-4">No gear available for this slot</p>
          )}
        </div>
      </Modal>

      {/* Context Menu for Gear Enhancements - rendered via portal to escape container styling */}
      {contextMenu && typeof document !== 'undefined' && createPortal(
        <GearContextMenu
          position={contextMenu.position}
          enhancement={contextMenu.enhancement}
          onClose={() => setContextMenu(null)}
          onToggleCrit={handleToggleCrit}
          onSetAttunement={handleSetAttunement}
        />,
        document.body
      )}
    </>
  );
}
