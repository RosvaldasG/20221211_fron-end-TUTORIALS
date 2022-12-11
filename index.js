window.addEventListener("load", () => {
  logOut();
});

// ---------------------------------
// paleidus WEB or LOG OUT išspausdina NOT private tutorials
const start = () => {
  fetch("http://localhost:3000/getTutorialsNotPrivate", {
    headers: {
      Accept: "application/json",
      // Authorization: token,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      tutorHeader(
        "Jums prieinama informacija, norite daugiau? Prisijunkite !!!"
      );
      printTutor(data);
    })
    .catch((err) => {
      console.log("err", err);
    });
  console.log("start");
};

// Funkcijos ------------------------------------------------
// Spausdinimas info kad prisijungt ar kiek varotojų

const tutorHeader = (text) => {
  const list = document.getElementById("tutorHeader");
  list.innerHTML = null;
  list.className = "th";
  list.append(text);
};

// Išspausdina TUTORIALS

const printTutor = (data) => {
  const list = document.getElementById("tasksList");
  list.className = "list";
  list.innerHTML = null;

  data.tutorials.forEach((element) => {
    const title = document.createElement("div");
    const content = document.createElement("div");
    const article = document.createElement("div");
    title.classList = "title";
    content.classList = "content";
    article.classList = "article";
    title.textContent = element.title;
    content.textContent = element.content;
    article.append(title, content);
    list.append(article);
  });
};

//-----------------
// Įrašo sukurtą Tutorial

const submitTutorial = document.getElementById("submit");
submitTutorial.addEventListener("click", () => {
  const submitTitle = document.getElementById("title").value;
  const submitContent = document.getElementById("content").value;

  const submitPrivate = () => {
    if (document.getElementById("private").checked) {
      return true;
    } else {
      return false;
    }
  };

  const submitData = {
    title: submitTitle,
    content: submitContent,
    private: submitPrivate(),
  };

  const token = localStorage.getItem("user_jwt");

  fetch("http://localhost:3000/createTutorials", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submitData),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      myTutor();
      console.log(data);
    })
    .catch((err) => {
      console.log("err", err);
      alert("Klaida");
    });
});

// Registacija ---------------------------------------------------------------

const registrationButton = document.getElementById("registration");
registrationButton.addEventListener("click", () => {
  logOut();
  const registrationEmail = document.getElementById("regEmail").value;
  const registrationPassword = document.getElementById("regPassword").value;

  const userRegistrationData = {
    email: registrationEmail,
    password: registrationPassword,
  };
  console.log(userRegistrationData);

  fetch("http://localhost:3000/createUser", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userRegistrationData),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error();
      }

      return res.json();
    })
    .then((data) => {
      alert("registracija sėkminga!!!");
      console.log(data);
    })
    .catch((err) => {
      alert("Toks vartotojas jau yra");
      console.log("err", err);
    });
});
//--------------------------------------------
// My tutorials

const myTutor = () => {
  const token = localStorage.getItem("user_jwt");

  console.log(token);

  fetch("http://localhost:3000/getMyTutorials", {
    headers: {
      Accept: "application/json",
      Authorization: token,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      printTutor(data);
      tutorHeader("Jūsų TUTORIALS");
    })
    .catch((err) => {
      alert("Jūs neprisijungęs");
      start();
      console.log("err", err);
    });
};
// -----------------------------------

// Login -----------------------------------------------------

const loginButton = document.getElementById("login");
loginButton.addEventListener("click", () => {
  const loginEmail = document.getElementById("loginEmail").value;
  const loginPassword = document.getElementById("loginPassword").value;

  const userLoginData = {
    email: loginEmail,
    password: loginPassword,
  };
  // console.log(userLoginData);

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userLoginData),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      localStorage.setItem("user_jwt", data.jwt_token);
      // btnLoged();
      logedTutor();
      logedNumUsers();

      console.log(data);
    })
    .catch((err) => {
      console.log("err", err);
      alert("Klaida");
    });
});

//  atlikus LOGIN išspausdina visus tutorials
const logedTutor = () => {
  const token = localStorage.getItem("user_jwt");

  fetch("http://localhost:3000/getAllTutorials", {
    headers: {
      Accept: "application/json",
      Authorization: token,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      printTutor(data);
      logedNumUsers();
    })
    .catch((err) => {
      alert("Jūs neprisijungęs");
      start();
      console.log("err", err);
    });
};

// atlikus LOGIN išspausdina USER skaičių

const logedNumUsers = () => {
  const token = localStorage.getItem("user_jwt");

  fetch("http://localhost:3000/getUsers", {
    headers: {
      Accept: "application/json",
      Authorization: token,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      tutorHeader("Viso užsiregistravo " + data.totalUsers + " vartotojai");
    })
    .catch((err) => {
      console.log("err", err);
    });
};

const logOut = () => {
  localStorage.removeItem("user_jwt");
  start();
};
