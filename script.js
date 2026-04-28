let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

function saveData() {
  localStorage.setItem("recipes", JSON.stringify(recipes));
  render();
}

function addRecipe() {
  const title = document.getElementById("title").value;
  const ingredients = document.getElementById("ingredients").value;
  const steps = document.getElementById("steps").value;

  if (!title || !ingredients || !steps) {
    alert("Fill all fields");
    return;
  }

  recipes.push({ title, ingredients, steps });
  saveData();

  clearForm();
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("ingredients").value = "";
  document.getElementById("steps").value = "";
}

function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  recipes.forEach((r, i) => {
    const div = document.createElement("div");
    div.className = "recipe";

    div.innerHTML = `
      <strong>${r.title}</strong><br>
      <button onclick="deleteRecipe(${i})">Delete</button>
    `;

    list.appendChild(div);
  });
}

function deleteRecipe(index) {
  recipes.splice(index, 1);
  saveData();
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;

  doc.text("My Recipes", 10, y);
  y += 10;

  recipes.forEach((r, i) => {
    doc.text(`${i + 1}. ${r.title}`, 10, y);
    y += 8;

    const ing = doc.splitTextToSize(r.ingredients, 180);
    doc.text(ing, 10, y);
    y += ing.length * 5 + 5;

    const steps = doc.splitTextToSize(r.steps, 180);
    doc.text(steps, 10, y);
    y += steps.length * 5 + 10;

    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save("recipes.pdf");
}

render();
