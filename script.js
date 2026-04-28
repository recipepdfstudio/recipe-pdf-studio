let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

function saveData() {
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

function addRecipe() {
  const title = document.getElementById("title").value;
  const ingredients = document.getElementById("ingredients").value;
  const instructions = document.getElementById("instructions").value;

  if (!title || !ingredients || !instructions) {
    alert("Fill all fields");
    return;
  }

  recipes.push({ title, ingredients, instructions });
  saveData();
  updateList();
  clearInputs();
}

function clearInputs() {
  document.getElementById("title").value = "";
  document.getElementById("ingredients").value = "";
  document.getElementById("instructions").value = "";
}

function updateList() {
  const list = document.getElementById("recipeList");
  list.innerHTML = "";

  recipes.forEach((r, i) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${r.title}</strong>
      <button onclick="editRecipe(${i})">✏️</button>
      <button onclick="deleteRecipe(${i})">🗑</button>
    `;

    list.appendChild(li);
  });
}

function deleteRecipe(i) {
  recipes.splice(i, 1);
  saveData();
  updateList();
}

function editRecipe(i) {
  const r = recipes[i];

  document.getElementById("title").value = r.title;
  document.getElementById("ingredients").value = r.ingredients;
  document.getElementById("instructions").value = r.instructions;

  recipes.splice(i, 1);
  saveData();
  updateList();
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 15;

  doc.setFontSize(18);
  doc.setFont("Helvetica", "bold");
  doc.text("My Recipe Cookbook", 105, y, { align: "center" });

  y += 10;

  recipes.forEach((r, i) => {
    y += 10;

    doc.setFontSize(14);
    doc.text(`${i + 1}. ${r.title}`, 10, y);

    y += 6;

    doc.setFontSize(11);
    doc.setFont("Helvetica", "bold");
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

    if (y > 260 && i !== recipes.length - 1) {
      doc.addPage();
      y = 15;
    }
  });

  doc.save("cookbook.pdf");
}

updateList();
