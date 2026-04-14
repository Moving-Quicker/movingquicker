import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalVisitors,
    visitorsA,
    visitorsB,
    totalLeads,
    leadsA,
    leadsB,
    events,
    recentLeads,
    dailyVisitors,
    dailyLeads,
    eventsByType,
  ] = await Promise.all([
    prisma.visitor.count(),
    prisma.visitor.count({ where: { variant: "A" } }),
    prisma.visitor.count({ where: { variant: "B" } }),
    prisma.lead.count(),
    prisma.lead.count({
      where: { visitor: { variant: "A" } },
    }),
    prisma.lead.count({
      where: { visitor: { variant: "B" } },
    }),
    prisma.event.count(),
    prisma.lead.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { visitor: { select: { variant: true } } },
    }),
    prisma.$queryRaw<{ date: string; variant: string; count: bigint }[]>`
      SELECT
        TO_CHAR(v.created_at, 'YYYY-MM-DD') as date,
        v.variant,
        COUNT(DISTINCT v.id)::bigint as count
      FROM visitors v
      WHERE v.created_at >= ${thirtyDaysAgo}
      GROUP BY date, v.variant
      ORDER BY date ASC
    `,
    prisma.$queryRaw<{ date: string; variant: string; count: bigint }[]>`
      SELECT
        TO_CHAR(l.created_at, 'YYYY-MM-DD') as date,
        v.variant,
        COUNT(*)::bigint as count
      FROM leads l
      JOIN visitors v ON v.id = l.visitor_id
      WHERE l.created_at >= ${thirtyDaysAgo}
      GROUP BY date, v.variant
      ORDER BY date ASC
    `,
    prisma.$queryRaw<{ type: string; count: bigint }[]>`
      SELECT type, COUNT(*)::bigint as count
      FROM events
      WHERE created_at >= ${sevenDaysAgo}
      GROUP BY type
      ORDER BY count DESC
    `,
  ]);

  const conversionA = visitorsA > 0 ? ((leadsA / visitorsA) * 100).toFixed(2) : "0";
  const conversionB = visitorsB > 0 ? ((leadsB / visitorsB) * 100).toFixed(2) : "0";

  return NextResponse.json({
    overview: {
      totalVisitors,
      visitorsA,
      visitorsB,
      totalLeads,
      leadsA,
      leadsB,
      totalEvents: events,
      conversionA: parseFloat(conversionA),
      conversionB: parseFloat(conversionB),
    },
    recentLeads: recentLeads.map((l) => ({
      id: l.id,
      name: l.name,
      whatsapp: l.whatsapp,
      businessType: l.businessType,
      message: l.message,
      source: l.source,
      variant: l.visitor.variant,
      createdAt: l.createdAt,
    })),
    dailyVisitors: dailyVisitors.map((d) => ({
      date: d.date,
      variant: d.variant,
      count: Number(d.count),
    })),
    dailyLeads: dailyLeads.map((d) => ({
      date: d.date,
      variant: d.variant,
      count: Number(d.count),
    })),
    eventsByType: eventsByType.map((e) => ({
      type: e.type,
      count: Number(e.count),
    })),
  });
}
