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
import { signOut } from "firebase/auth";

// const auth = getAuth();

// Регистрация пользователя

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState("");

  const [favorites, setFavorites] = useState(() => {
    // Инициализация состояния из localStorage
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
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
      const snapshot = await get(child(dbRef, "teachers"));
      if (snapshot.exists()) {
        const teachersData = Object.entries(snapshot.val()).map(
          ([key, value]) => ({
            id: key, // Используем ключ как id
            ...value, // Сохраняем остальные данные
          })
        );
        console.log("Teachers with IDs:", teachersData); // Логируем преобразованные данные
        setTeachers(teachersData);
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Error fetching teachers:", error.message);
    }
  };

  const toggleFavorite = (teacher) => {
    // Используем ID для проверки избранного
    const updatedFavorites = favorites.includes(teacher.id)
      ? favorites.filter((favId) => favId !== teacher.id) // Удаляем из избранного
      : [...favorites, teacher.id]; // Добавляем в избранное
    console.log(teacher.id);

    setFavorites(updatedFavorites);

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Выход из системы для текущего пользователя
      console.log("Пользователь успешно вышел");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
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
        <button type="button" onClick={handleSignOut}>
          EXIT
        </button>
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
                {favorites.includes(teacher.id) ? (
                  <IoHeartSharp className={css.heartFavor} />
                ) : (
                  <IoHeartOutline className={css.heart} />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
