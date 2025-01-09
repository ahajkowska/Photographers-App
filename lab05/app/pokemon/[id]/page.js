'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import PokemonDetails from '../../components/PokemonDetails';
import { AddNoteForm, EditNoteForm, NotesList, NoteModal } from './notes.js'

const pokeAPI = "https://pokeapi.co/api/v2/pokemon"

export default function PokemonDetailsPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);  // Stan notatek
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false); // Stan dla widoczności formularza

  useEffect(() => {
    async function fetchPokemonDetails() {
      try {
        const response = await fetch(`${pokeAPI}/${id}`);
        const data = await response.json();
        setPokemonDetails(data);
      } catch (error) {
        console.error('Błąd podczas pobierania szczegółów:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPokemonDetails();

    // Ładowanie notatek z localStorage
    const storedNotes = JSON.parse(localStorage.getItem(`notes-${id}`)) || [];
    console.log("Notatki wczytane z localStorage:", storedNotes);
    setNotes(storedNotes);
  }, [id]);

  const view = searchParams.get('view');

  const addNote = (newNote) => {
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem('notes-${id}', JSON.stringify(updatedNotes));
    setFormVisible(false);
  };

  const editNote = (updatedNote) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
    localStorage.setItem('notes-${id}', JSON.stringify(updatedNotes));
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('notes-${id}', JSON.stringify(updatedNotes));
  };

  return (
    <div className="pokemon-details-page">
      {loading ? (
        <p>Ładowanie szczegółów...</p>
      ) : (
        <PokemonDetails
          pokemonDetails={pokemonDetails}
          loadingDetails={loading}
          onBack={() => router.push('/pokemon')}
        />
      )}

      <h1>Notatki treningowe dla Pokémona</h1>
      <button className="new-note-button" onClick={() => setFormVisible(true)}>Nowa notatka treningowa</button>
      {/* Formularz dodawania */}
      {isFormVisible && (
        <div className="add-note-form">
        <AddNoteForm 
          pokemonId={id}  
          onAddNote={addNote} 
        />
        </div>
      )}
      {/* Lista notatek */}
      <NotesList
        pokemonId={id}
        notes={notes}
        onEditNote={(note) => {
          setEditingNote(note);
          setShowModal(true);
        }}
        onDeleteNote={deleteNote}
      />

      {showModal && editingNote && (
        <NoteModal onClose={() => setShowModal(false)}>
          <EditNoteForm
            pokemonId={id}
            note={editingNote}
            onSave={(updatedNote) => {
              editNote(updatedNote);
              setShowModal(false);
            }}
            onCancel={() => setShowModal(false)}
          />
        </NoteModal>
      )}
    </div>
    );
}