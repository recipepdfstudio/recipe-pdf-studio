let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
let editIndex = null;

function saveData() {
  localStorage.setItem("recipes", JSON.stringify(recipes));
  render();
}

function addRecipe() {
  const title = document.getElementById("title").value.trim();
  const ingredients = document.getElementById("ingredients").value.trim();
  const steps = document.getElementById("steps").value.trim();

  if (!title || !ingredients || !steps) {
    alert("Please fill all fields");
    return;
  }

  const data = { title, ingredients, steps };

  if (editIndex !== null) {
    recipes[editIndex] = data;
    editIndex = null;
  } else {
    recipes.push(data);
  }

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
  const search = document.getElementById("search")?.value?.toLowerCase() || "";

  list.innerHTML = "";

  recipes
    .filter(r => r.title.toLowerCase().includes(search))
    .forEach((r, i) => {
      const div = document.createElement("div");
      div.className = "recipe";

      div.innerHTML = `
        <strong>${r.title}</strong><br><br>

        <button onclick="editRecipe(${i})">Edit</button>
        <button onclick="deleteRecipe(${i})">Delete</button>
      `;

      list.appendChild(div);
    });
}

function editRecipe(i) {
  const r = recipes[i];

  document.getElementById("title").value = r.title;
  document.getElementById("ingredients").value = r.ingredients;
  document.getElementById("steps").value = r.steps;

  editIndex = i;
}

function deleteRecipe(i) {
  recipes.splice(i, 1);
  saveData();
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;

  doc.setFontSize(16);
  doc.text("My Recipe Book", 10, y);
  y += 10;

  recipes.forEach((r, i) => {
    doc.setFontSize(12);

    doc.text(`${i + 1}. ${r.title}`, 10, y);
    y += 8;

    const ing = doc.splitTextToSize("Ingredients: " + r.ingredients, 180);
    doc.text(ing, 10, y);
    y += ing.length * 5 + 5;

    const st = doc.splitTextToSize("Steps: " + r.steps, 180);
    doc.text(st, 10, y);
    y += st.length * 5 + 10;

    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save("recipes.pdf");
}

render();
