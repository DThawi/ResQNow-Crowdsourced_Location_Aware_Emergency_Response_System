import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const BRAND_RED = [214, 40, 40];
const SLATE_DARK = [43, 45, 66];
const SLATE_MUTED = [107, 114, 128];
const INDIGO_BLUE = [29, 78, 216];

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
 * Build and trigger download of a system-wide Analytics PDF report.
 */
export function exportAnalyticsReportPdf({
  dateRange,
  customStartDate,
  customEndDate,
  stats,
  incidentsByCategory = [],
  severityDistribution = [],
  avgResponseTime = [],
  reportData = [],
}) {
  const isNarrow =
    typeof window !== "undefined" &&
    window.matchMedia?.("(max-width: 640px)")?.matches;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = margin;

  // Header Banner
  doc.setFillColor(...BRAND_RED);
  doc.rect(0, 0, pageWidth, 22, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("ResQNow — Authority Analytics Report", margin, 14);

  // Metadata block
  y = 30;
  doc.setTextColor(...SLATE_DARK);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Report period", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...SLATE_MUTED);

  let periodText = dateRange || "Last 30 Days";
  if (dateRange === "Custom Period" && customStartDate && customEndDate) {
    periodText = `${customStartDate} to ${customEndDate}`;
  }
  doc.text(periodText, margin + 38, y);

  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...SLATE_DARK);
  doc.text("Generated", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...SLATE_MUTED);
  doc.text(formatGeneratedAt(), margin + 38, y);

  y += 10;
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // 1. Summary Metrics Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...SLATE_DARK);
  doc.text("Core Statistics Summary", margin, y);
  y += 5;

  const summaryRows = [
    ["Total Registered Incidents", String(stats?.totalIncidents ?? 0)],
    ["Active Danger Zones", String(stats?.activeDangerZones ?? 0)],
    ["Deployed Responders", String(stats?.totalResponders ?? 0)],
    ["Registered Platform Users", String(stats?.totalUsers ?? 12450)],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Analytics Metric", "Value"]],
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
      0: { cellWidth: 70 },
      1: { cellWidth: "auto" },
    },
  });

  y = doc.lastAutoTable.finalY + 10;

  // 2. Incident Category Distribution Table
  if (incidentsByCategory.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...SLATE_DARK);
    doc.text("Incidents by Category", margin, y);
    y += 5;

    const totalCategoryCount = incidentsByCategory.reduce((sum, item) => sum + (Number(item.value) || 0), 0);

    autoTable(doc, {
      startY: y,
      head: [["Category Type", "Incident Count", "Share Percentage"]],
      body: incidentsByCategory.map((item) => [
        item.label,
        String(item.value),
        totalCategoryCount ? `${((item.value / totalCategoryCount) * 100).toFixed(1)}%` : "0%",
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

  // Check if we need to wrap to the next page
  if (y > pageHeight - 60) {
    doc.addPage();
    y = margin;
  }

  // 3. Severity Distribution Table
  if (severityDistribution.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...SLATE_DARK);
    doc.text("Danger Zone Severity Distribution", margin, y);
    y += 5;

    const totalSeverityCount = severityDistribution.reduce((sum, item) => sum + (Number(item.value) || 0), 0);

    autoTable(doc, {
      startY: y,
      head: [["Severity Level", "Zone Count", "Share Percentage"]],
      body: severityDistribution.map((item) => [
        item.label,
        String(item.value),
        totalSeverityCount ? `${((item.value / totalSeverityCount) * 100).toFixed(1)}%` : "0%",
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

  // 4. Average Response Time Table
  if (avgResponseTime.length > 0) {
    if (y > pageHeight - 65) {
      doc.addPage();
      y = margin;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...SLATE_DARK);
    doc.text("Average Responder Dispatch Time (Weekly Trends)", margin, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [["Day", "Average Dispatch Time (minutes)"]],
      body: avgResponseTime.map((item) => [
        item.label,
        `${Number(item.minutes).toFixed(1)} min`,
      ]),
      margin: { left: margin, right: margin },
      theme: "striped",
      headStyles: {
        fillColor: INDIGO_BLUE,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: "auto" },
      },
    });

    y = doc.lastAutoTable.finalY + 10;
  }

  // 5. Complete Report Preview Table
  if (reportData.length > 0) {
    if (y > pageHeight - 60) {
      doc.addPage();
      y = margin;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...SLATE_DARK);
    doc.text("Category Breakdown & Success Rate Details", margin, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [["Incident Type", "Total Reports", "Resolved", "Pending", "Success Rate"]],
      body: reportData.map((row) => [
        row.type || "—",
        String(row.total ?? 0),
        String(row.resolved ?? 0),
        String(row.pending ?? 0),
        row.rate || "0%",
      ]),
      margin: { left: margin, right: margin },
      styles: {
        fontSize: isNarrow ? 7 : 8,
        cellPadding: 2.5,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: BRAND_RED,
        textColor: [255, 255, 255],
        fontStyle: "bold",
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
          "ResQNow Authority Dashboard — Confidential",
          margin,
          doc.internal.pageSize.getHeight() - 8
        );
      },
    });
  }

  const datePart = safeFilenamePart(dateRange || "report");
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `ResQNow-Analytics-Report-${datePart}-${stamp}.pdf`;

  doc.save(filename);
}
