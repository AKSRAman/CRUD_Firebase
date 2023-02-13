import { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase_config';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "@firebase/firestore";
import NotesList from './components/NotesList';
import Search from './components/Search';
import Header from './components/Header';

function App() {

  const [user, setUser] = useState([])
  const collectionRef = collection(db, "first_user")
  const [createdUser, setCreatedUser] = useState({})

  const getUser = async () => {
    const data = await getDocs(collectionRef)
    console.log(data.docs)
    setUser(data.docs.map((doc, i) => ({ ...doc.data(), id: doc.id })))
  }

  const createUser = async () => {
    const addUser = await addDoc(collectionRef, createdUser)
    console.log(addUser, "result")
  }

  const handleChange = (e) => {
    setCreatedUser({ ...createdUser, [e.target.name]: e.target.value })
  }

  const updateUser = async (user) => {
    const userdoc = doc(db, "first_user", user.id)
    let newdata = { ...user, age: Number(user.age) + 1 }
    await updateDoc(userdoc, newdata)
  }

  const deleteUser = async (id) => {
    const userdoc = doc(db, "first_user", id)
    await deleteDoc(userdoc, userdoc)
  }

  useEffect(() => {
    getUser()
  }, [])



	const [notes, setNotes] = useState([
		{
			id: 1,
			text: 'This is my first note!',
			date: '15/04/2021',
		},
		{
			id: 2,
			text: 'This is my second note!',
			date: '21/04/2021',
		},
		{
			id: 3,
			text: 'This is my third note!',
			date: '28/04/2021',
		},
		{
			id: 3,
			text: 'This is my new note!',
			date: '30/04/2021',
		},
	]);

	const [searchText, setSearchText] = useState('');
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const savedNotes = JSON.parse(
			localStorage.getItem('react-notes-app-data')
		);

		if (savedNotes) {
			setNotes(savedNotes);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(
			'react-notes-app-data',
			JSON.stringify(notes)
		);
	}, [notes]);

	const addNote = (text) => {
		const date = new Date();
		const newNote = {
			id: 1,
			text: text,
			date: date.toLocaleDateString(),
		};
		const newNotes = [...notes, newNote];
		setNotes(newNotes);
	};

	const deleteNote = (id) => {
		const newNotes = notes.filter((note) => note.id !== id);
		setNotes(newNotes);
	};

  return (
    <div className="App">
      <div>


        <h1>CRUD BY FIREBASE</h1>
        <h2>CREATE</h2>
        <input placeholder='Name' name='name' onChange={handleChange} />
        <input placeholder='Email' name='email' onChange={handleChange} />
        <input placeholder='Age' name='age' onChange={handleChange} />
        <button onClick={createUser}>Create User</button>
        <h2>UPDATE</h2>
        {
          user.map((elem, i) => {
            return <div key={i}>
              <h3>Name : {elem.name}</h3>
              <h3>Email : {elem.email}</h3>
              <h3>Age : {elem.age}</h3>
              <button onClick={() => updateUser(elem)}>
                Increase Age
              </button>
              <button onClick={() => deleteUser(elem.id)}>
                Delete
              </button>
            </div>
          })
        }
      </div>
      <div>
      <div className={`${darkMode && 'dark-mode'}`}>
			<div className='container'>
				<Header handleToggleDarkMode={setDarkMode} />
				<Search handleSearchNote={setSearchText} />
				<NotesList
					notes={notes.filter((note) =>
						note.text.toLowerCase().includes(searchText)
					)}
					handleAddNote={addNote}
					handleDeleteNote={deleteNote}
				/>
			</div>
		</div>
      </div>
    </div>
  );
}

export default App;