import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const BRAND_RED = [214, 40, 40];
const SLATE_DARK = [43, 45, 66];
const SLATE_MUTED = [107, 114, 128];

function formatGeneratedAt() {
  return new Date().toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function safeFilenamePart(value) {
  return String(value)
    .replace(/[^\w-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

/**
 * Build and trigger download of a Danger Zone PDF report (works in desktop & mobile browsers).
 */
export function exportZoneReportPdf({
  dateRange,
  searchTerm = "",
  stats,
  severitySummary,
  zones = [],
}) {
  const isNarrow =
    typeof window !== "undefined" &&
    window.matchMedia?.("(max-width: 640px)")?.matches;

  const doc = new jsPDF({
    orientation: isNarrow ? "portrait" : "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = margin;

  doc.setFillColor(...BRAND_RED);
  doc.rect(0, 0, pageWidth, 22, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("ResQNow — Danger Zone Report", margin, 14);

  y = 30;
  doc.setTextColor(...SLATE_DARK);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Report period", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...SLATE_MUTED);
  doc.text(dateRange || "All Time", margin + 38, y);

  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...SLATE_DARK);
  doc.text("Generated", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...SLATE_MUTED);
  doc.text(formatGeneratedAt(), margin + 38, y);

  if (searchTerm?.trim()) {
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...SLATE_DARK);
    doc.text("Search filter", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...SLATE_MUTED);
    doc.text(searchTerm.trim(), margin + 38, y);
  }

  y += 12;
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...SLATE_DARK);
  doc.text("Summary", margin, y);
  y += 6;

  const summaryRows = [
    ["Active zones", String(stats.activeZonesCount ?? 0)],
    ["People affected", String(stats.peopleAffectedLabel ?? stats.peopleAffectedCount ?? 0)],
    ["Total created", String(stats.totalCreatedCount ?? 0)],
    ["Average duration", String(stats.avgDurationLabel ?? "—")],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: summaryRows,
    margin: { left: margin, right: margin },
    theme: "grid",
    headStyles: {
      fillColor: BRAND_RED,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: SLATE_DARK },
    columnStyles: {
      0: { cellWidth: 55 },
      1: { cellWidth: "auto" },
    },
  });

  y = doc.lastAutoTable.finalY + 10;

  const severityItems = severitySummary?.items || [];
  if (severityItems.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...SLATE_DARK);
    doc.text("Severity distribution", margin, y);
    y += 2;

    autoTable(doc, {
      startY: y + 4,
      head: [["Severity", "Count", "Share"]],
      body: severityItems.map((item) => [
        item.label,
        String(item.value),
        severitySummary.total
          ? `${item.pct.toFixed(1)}%`
          : "0%",
      ]),
      margin: { left: margin, right: margin },
      theme: "striped",
      headStyles: {
        fillColor: SLATE_DARK,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9 },
    });

    y = doc.lastAutoTable.finalY + 10;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...SLATE_DARK);

  const zoneCount = zones.length;
  const tableTitle =
    searchTerm?.trim()
      ? `Danger zones (${zoneCount} matching search)`
      : `Danger zones (${zoneCount})`;

  if (y > doc.internal.pageSize.getHeight() - 40) {
    doc.addPage();
    y = margin;
  }

  doc.text(tableTitle, margin, y);
  y += 4;

  const tableBody =
    zones.length > 0
      ? zones.map((zone) => [
          zone.name || "—",
          zone.type || "—",
          zone.severity || "—",
          zone.affected ?? "—",
          zone.status || "—",
          zone.created || "—",
        ])
      : [["No zones found for the selected filters.", "", "", "", "", ""]];

  autoTable(doc, {
    startY: y + 2,
    head: [["Zone name", "Type", "Severity", "Affected", "Status", "Created"]],
    body: tableBody,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: isNarrow ? 7 : 8,
      cellPadding: 2,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: BRAND_RED,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: isNarrow ? 7 : 8,
    },
    columnStyles: {
      0: { cellWidth: isNarrow ? 32 : 42 },
      1: { cellWidth: isNarrow ? 22 : 28 },
      2: { cellWidth: isNarrow ? 20 : 24 },
      3: { cellWidth: isNarrow ? 18 : 22 },
      4: { cellWidth: isNarrow ? 18 : 22 },
      5: { cellWidth: isNarrow ? 22 : 28 },
    },
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(...SLATE_MUTED);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        pageWidth - margin,
        doc.internal.pageSize.getHeight() - 8,
        { align: "right" }
      );
      doc.text(
        "ResQNow Admin — Confidential",
        margin,
        doc.internal.pageSize.getHeight() - 8
      );
    },
  });

  const datePart = safeFilenamePart(dateRange || "report");
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `ResQNow-Zone-Report-${datePart}-${stamp}.pdf`;

  doc.save(filename);
}