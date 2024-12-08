import {
  // getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, child, get } from "firebase/database";
import { useState } from "react";
// import { Heart } from "./Heart";
import css from "./App.module.css";
import { IoHeartOutline } from "react-icons/io5";
import { IoHeartSharp } from "react-icons/io5";
import { useEffect } from "react";

// const auth = getAuth();

// Регистрация пользователя

function App() {
  const [favorites, setFavorites] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        // console.log("User registered:", userCredential.user);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setEmail("");
    setPassword("");
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        setUserId();
        setUser(userCredential.user);
        const user = userCredential.user;
        console.log(user);

        // ...
      })
      .catch((error) => {
        console.error(error.code);
        console.error(error.message);
      });
    setEmail("");
    setPassword("");
  };

  const getTeachers = async () => {
    if (!user || !user.uid) {
      console.error("User is not logged in");
      return;
    }
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, "teachers")); // Запросим раздел teachers
      if (snapshot.exists()) {
        setTeachers(Object.values(snapshot.val()));
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleFavorite = (teacher) => {
    let updatedFavorites;

    if (favorites.includes(teacher)) {
      updatedFavorites = favorites.filter((fav) => fav !== teacher);
    } else {
      updatedFavorites = [...favorites, teacher];
    }

    setFavorites(updatedFavorites);

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <>
      <h1>Firebase Demo</h1>
      <div>
        <h2>SignUp</h2>
        <form action="" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Signup</button>
        </form>
      </div>
      <div>
        <h2>SignIn</h2>
        <form action="" onSubmit={handleSignIn}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Signin</button>
        </form>
      </div>
      <div>
        <h2>Teachers</h2>
        <button onClick={getTeachers}>Get Teachets</button>
        <ul>
          {teachers.map((teacher, i) => (
            <li key={i}>
              {teacher.name} {teacher.surname}
              <button
                type="button"
                className={css.heartBtn}
                onClick={() => toggleFavorite(teacher)}
              >
                {favorites.includes(teacher) ? (
                  <IoHeartSharp className={css.heartFavor} />
                ) : (
                  <IoHeartOutline className={css.heart} />
                )}
              </button>
              {/* <button
                type="button"
                className={css.heartBtn}
                onClick={addFavorite}
              >
                <IoHeartOutline className={css.heart} />
                <IoHeartSharp className={css.heartFavor} />
              </button> */}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
