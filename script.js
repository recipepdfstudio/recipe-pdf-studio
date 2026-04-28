function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const title = document.getElementById("title").value;
  const ingredients = document.getElementById("ingredients").value;
  const instructions = document.getElementById("instructions").value;

  let y = 20;

  // Title
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title || "Untitled Recipe", 10, y);

  y += 10;

  // Ingredients
  doc.setFontSize(12);
  doc.setFont("Helvetica", "bold");
  doc.text("Ingredients:", 10, y);

  y += 8;
  doc.setFont("Helvetica", "normal");
  const ingLines = doc.splitTextToSize(ingredients, 180);
  doc.text(ingLines, 10, y);

  y += ingLines.length * 6 + 5;

  // Instructions
  doc.setFont("Helvetica", "bold");
  doc.text("Instructions:", 10, y);

  y += 8;
  doc.setFont("Helvetica", "normal");
  const instLines = doc.splitTextToSize(instructions, 180);
  doc.text(instLines, 10, y);

  doc.save((title || "recipe") + ".pdf");
}
