import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, Shield, Calendar, Trophy, Swords, TrendingUp } from "lucide-react";
import Link from "next/link";

async function getStats() {
  try {
    const [totalPlayers, alliancePlayers, totalEvents, activeEvents] = await Promise.all([
      prisma.player.count(),
      prisma.player.count({ where: { inAlliance: true } }),
      prisma.event.count(),
      prisma.event.count({ where: { status: "ACTIVE" } }),
    ]);

    const recentEvents = await prisma.event.findMany({
      take: 5,
      orderBy: { startDate: "desc" },
      include: {
        participations: true,
      },
    });

    return { totalPlayers, alliancePlayers, totalEvents, activeEvents, recentEvents };
  } catch {
    // Database not initialized yet
    return { totalPlayers: 0, alliancePlayers: 0, totalEvents: 0, activeEvents: 0, recentEvents: [] };
  }
}

export default async function Dashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-slate-400 text-sm md:text-base mt-1">Alliance overview and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-400">Player Pool</p>
                <p className="text-xl md:text-3xl font-bold text-slate-100 mt-1">{stats.totalPlayers}</p>
              </div>
              <div className="p-2 md:p-3 rounded-xl bg-blue-500/10">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-400">Alliance</p>
                <p className="text-xl md:text-3xl font-bold text-slate-100 mt-1">{stats.alliancePlayers}</p>
              </div>
              <div className="p-2 md:p-3 rounded-xl bg-amber-500/10">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-400">Total Events</p>
                <p className="text-xl md:text-3xl font-bold text-slate-100 mt-1">{stats.totalEvents}</p>
              </div>
              <div className="p-2 md:p-3 rounded-xl bg-purple-500/10">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-400">Active</p>
                <p className="text-xl md:text-3xl font-bold text-slate-100 mt-1">{stats.activeEvents}</p>
              </div>
              <div className="p-2 md:p-3 rounded-xl bg-green-500/10">
                <Trophy className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-slate-100">Quick Actions</h2>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 space-y-3">
            <Link
              href="/players"
              className="flex items-center gap-3 p-3 md:p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-slate-100 text-sm md:text-base">Manage Player Pool</p>
                <p className="text-xs md:text-sm text-slate-500">Add or edit players</p>
              </div>
            </Link>
            <Link
              href="/alliance"
              className="flex items-center gap-3 p-3 md:p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                <Shield className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-slate-100 text-sm md:text-base">Alliance Roster</p>
                <p className="text-xs md:text-sm text-slate-500">Manage alliance members</p>
              </div>
            </Link>
            <Link
              href="/events"
              className="flex items-center gap-3 p-3 md:p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                <Swords className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-slate-100 text-sm md:text-base">Create Event</p>
                <p className="text-xs md:text-sm text-slate-500">Schedule Ark, KvK, MGE & more</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-semibold text-slate-100">Recent Events</h2>
              <Link href="/events" className="text-xs md:text-sm text-amber-400 hover:text-amber-300">
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            {stats.recentEvents.length === 0 ? (
              <p className="text-slate-500 text-center py-8 text-sm">No events yet</p>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {stats.recentEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="flex items-center justify-between p-2 md:p-3 rounded-lg hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        event.status === "ACTIVE" ? "bg-green-400" :
                        event.status === "UPCOMING" ? "bg-amber-400" : "bg-slate-500"
                      }`} />
                      <div className="min-w-0">
                        <p className="font-medium text-slate-200 text-sm truncate">{event.name}</p>
                        <p className="text-xs text-slate-500">{event.type.replace(/_/g, " ")}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="text-xs md:text-sm text-slate-400">{event.participations.length} players</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
