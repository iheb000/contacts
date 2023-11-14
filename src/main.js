//verification du date
function verifdate(dateInput) {
  const selectedDate = new Date(dateInput.value);
  const currentDate = new Date();
  if (selectedDate > currentDate) {
    alert("La date de naissance doit être dans le passé.");
    dateInput.value = "";
  }
}
$(document).ready(function () {
  //conncetion au serveur du backend et creation du table
  let users = [];

  $.ajax({
    url: "http://localhost:8081/users/",
    type: "GET",
    dataType: "json",
    success: function (data) {
      users = data;
      generateUsersTable(users);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error fetching user data:", errorThrown);
    },
  });

  //
  //
  // aujout d un nouveau contact au base de donnees

  $("#Ajouter-client").click(async function (event) {
    event.preventDefault();

    if (
      $("#nom")[0].checkValidity() &&
      $("#nom")[0].checkValidity() &&
      $("#prenom")[0].checkValidity() &&
      $("#tel")[0].checkValidity() &&
      $("#mail")[0].checkValidity() &&
      $("#d_n")[0].checkValidity() &&
      $("#nb_e")[0].checkValidity()
    ) {
      const user = {
        Nom: $("#nom").val(),
        Prénom: $("#prenom").val(),
        Téléphone: $("#tel").val(),
        Email: $("#mail").val(),
        Date_de_naissance: $("#d_n").val(),
        Nombre_d_enfants: $("#nb_e").val(),
      };

      try {
        const response = await fetch("http://localhost:8081/users/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        if (response.ok) {
          document.getElementById("form").reset();
          alert("You added a new client!");
        } else {
          alert("Failed to add a new client. Please check the server.");
        }
      } catch (error) {
        alert("An error occurred while adding the client: " + error.message);
      }
    }
  });
});

//
//
//cretaion du table a partir du liste des contacts
function generateUsersTable(users) {
  const tableBody = document.querySelector("tbody");

  tableBody.innerHTML = "";

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const row = document.createElement("tr");
    row.dataset.id = user.id;
    const doc = document.createElement("td");
    const img = document.createElement("img");
    img.src = "../assets/document.png";
    img.id = user.id;
    img.ondragstart = drag;
    img.className = "draggable";
    img.draggable = true;
    doc.appendChild(img);
    row.appendChild(doc);

    const firstNameCell = document.createElement("td");
    firstNameCell.textContent = user.Prénom;
    row.appendChild(firstNameCell);

    const lastNameCell = document.createElement("td");
    lastNameCell.textContent = user.Nom;
    row.appendChild(lastNameCell);

    const phoneCell = document.createElement("td");
    phoneCell.textContent = user.Téléphone;
    row.appendChild(phoneCell);

    const emailCell = document.createElement("td");
    emailCell.textContent = user.Email;
    row.appendChild(emailCell);

    const birthDateCell = document.createElement("td");
    birthDateCell.textContent = user.Date_de_naissance;
    row.appendChild(birthDateCell);

    const childrenCell = document.createElement("td");
    childrenCell.textContent = user.Nombre_d_enfants;
    row.appendChild(childrenCell);

    const del = document.createElement("td");
    const jpg = document.createElement("img");
    jpg.src = "../assets/delete.jpg";
    jpg.width = 20;
    jpg.id = user.id;
    // jpg.onclick = handleImageClick();
    del.appendChild(jpg);
    row.appendChild(del);

    tableBody.appendChild(row);
  }
}
//supprimer un contact par click sur delete
document.addEventListener("click", function (event) {
  if (event.target.src.endsWith("delete.jpg")) {
    const userId = event.target.id;
    deleteUser(userId);
  }
});

//
//
//supprimer un contact par  drag&drop du image du doc
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  draggedUserId = ev.target.id;

  ev.dataTransfer.setData("Text", ev.target.id);
}
//suprimer le contact de la base
function deleteUser(userId) {
  const audioElement = document.getElementById("deleteSound");
  audioElement.play();
  if (confirm("Are you sure you want to delete this user?")) {
    fetch(`http://localhost:8081/users/${userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Remove the user entry from the table
          const userRow = document.querySelector(`tr[data-id="${userId}"]`);
          if (userRow) {
            userRow.remove();
          }
          alert("User deleted successfully!");
        } else {
          alert("Failed to delete user.");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }
}
