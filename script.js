function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const title = document.getElementById("title").value;
  const ingredients = document.getElementById("ingredients").value;
  const instructions = document.getElementById("instructions").value;

  let y = 20;

  // Title (centered)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(20);
  doc.text(title || "Untitled Recipe", 105, y, { align: "center" });

  y += 15;

  // Line separator
  doc.setDrawColor(200);
  doc.line(10, y, 200, y);

  y += 10;

  // Ingredients
  doc.setFontSize(14);
  doc.text("Ingredients", 10, y);

  y += 8;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);

  const ingLines = doc.splitTextToSize(ingredients, 180);
  doc.text(ingLines, 10, y);

  y += ingLines.length * 6 + 10;

  // Instructions
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Instructions", 10, y);

  y += 8;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);

  const instLines = doc.splitTextToSize(instructions, 180);
  doc.text(instLines, 10, y);

  doc.save((title || "recipe") + ".pdf");
}
