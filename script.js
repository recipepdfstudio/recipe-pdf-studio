let recipes = JSON.parse(localStorage.getItem("recipes") || "[]");
let editId = null;
let lastDeleted = null;

function saveData() {
  localStorage.setItem("recipes", JSON.stringify(recipes));
  renderRecipes();
}

function saveRecipe() {
  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;
  const ingredients = document.getElementById("ingredients").value.trim();
  const steps = document.getElementById("steps").value.trim();

  if (!title || !ingredients || !steps) {
    alert("Please fill all fields");
    return;
  }

  const data = {
    id: editId || Date.now(),
    title,
    category,
    ingredients,
    steps
  };

  if (editId) {
    recipes = recipes.map(r => r.id === editId ? data : r);
    editId = null;
  } else {
    recipes.push(data);
  }

  clearForm();
  saveData();
}

function renderRecipes() {
  const list = document.getElementById("list");
  const search = document.getElementById("search").value.toLowerCase();

  list.innerHTML = "";

  recipes
    .filter(r => r.title.toLowerCase().includes(search))
    .forEach(r => {
      const div = document.createElement("div");
      div.className = "recipe";

      div.innerHTML = `
        <div class="title">${r.title}</div>
        <div>${r.category}</div>

        <div class="btns">
          <button class="edit" onclick="editRecipe(${r.id})">Edit</button>
          <button class="delete" onclick="deleteRecipe(${r.id})">Delete</button>
        </div>
      `;

      list.appendChild(div);
    });
}

function editRecipe(id) {
  const r = recipes.find(r => r.id === id);
  if (!r) return;

  document.getElementById("title").value = r.title;
  document.getElementById("category").value = r.category;
  document.getElementById("ingredients").value = r.ingredients;
  document.getElementById("steps").value = r.steps;

  editId = id;
}

function deleteRecipe(id) {
  lastDeleted = recipes.find(r => r.id === id);
  recipes = recipes.filter(r => r.id !== id);

  document.getElementById("undoBtn").style.display = "block";

  saveData();
}

function undoDelete() {
  if (!lastDeleted) return;

  recipes.push(lastDeleted);
  lastDeleted = null;

  document.getElementById("undoBtn").style.display = "none";

  saveData();
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("ingredients").value = "";
  document.getElementById("steps").value = "";
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

    doc.text(`${i + 1}. ${r.title} (${r.category})`, 10, y);
    y += 6;

    const ing = doc.splitTextToSize("Ingredients: " + r.ingredients, 180);
    doc.text(ing, 10, y);
    y += ing.length * 5 + 4;

    const st = doc.splitTextToSize("Steps: " + r.steps, 180);
    doc.text(st, 10, y);
    y += st.length * 5 + 8;

    if (y > 270 && i !== recipes.length - 1) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save("recipes.pdf");
}

renderRecipes();
