let recipes = [];

function addRecipe() {
  const title = document.getElementById("title").value;
  const ingredients = document.getElementById("ingredients").value;
  const instructions = document.getElementById("instructions").value;

  if (!title || !ingredients || !instructions) {
    alert("Please fill in all fields");
    return;
  }

  recipes.push({ title, ingredients, instructions });

  updateList();

  // clear inputs
  document.getElementById("title").value = "";
  document.getElementById("ingredients").value = "";
  document.getElementById("instructions").value = "";
}

function updateList() {
  const list = document.getElementById("recipeList");
  list.innerHTML = "";

  recipes.forEach((r, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${r.title}`;
    list.appendChild(li);
  });
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 15;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.text("My Recipe Cookbook", 105, y, { align: "center" });

  y += 10;

  recipes.forEach((r, i) => {
    y += 10;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`${i + 1}. ${r.title}`, 10, y);

    y += 6;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Ingredients:", 10, y);

    y += 5;

    doc.setFont("Helvetica", "normal");
    let ing = doc.splitTextToSize(r.ingredients, 180);
    doc.text(ing, 10, y);

    y += ing.length * 5 + 5;

    doc.setFont("Helvetica", "bold");
    doc.text("Instructions:", 10, y);

    y += 5;

    doc.setFont("Helvetica", "normal");
    let ins = doc.splitTextToSize(r.instructions, 180);
    doc.text(ins, 10, y);

    y += ins.length * 5 + 10;

    if (y > 270 && i !== recipes.length - 1) {
      doc.addPage();
      y = 15;
    }
  });

  doc.save("cookbook.pdf");
}
