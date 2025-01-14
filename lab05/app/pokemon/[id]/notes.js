'use client';
import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const pokemonTypes = [
  "Normal", "Fire", "Water", "Grass", "Electric", "Ice",
  "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug",
  "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"
];

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    // Sprawdzamy, czy jesteśmy po stronie klienta
    if (typeof window !== "undefined") {
      try {
        // Odczytujemy wartość z localStorage
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error("Błąd odczytu z localStorage:", error);
      }
    }
  }, [key]);

  const setValue = (value) => {
    try {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        // Zapisujemy wartość do localStorage
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error("Błąd zapisu do localStorage:", error);
    }
  };

  return [storedValue, setValue];
}


// Lista notatek dla konkretnego Pokemona
function NotesList({ pokemonId, onEditNote, onDelete }) {
  const [notes, setNotes] = useLocalStorage(`notes-${pokemonId}`, []);

  const handleDelete = (noteId) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  // Sortowanie notatek po dacie (najpierw najnowsze)
  const sortedNotes = notes.sort((a, b) => new Date(b.trainingDate) - new Date(a.trainingDate));

  if (!notes || !Array.isArray(notes)) {
    console.error("NotesList: Nieprawidłowy format notatek:", notes);
    return <p>Błąd wczytywania notatek.</p>;
  }

  return (
    <div>
      <div className="notes-list">
      {notes.length ? (
        notes.map((note) => (
          <div key={note.id} className="note-item">
            <div className="note-item-content">
            <h3>{note.tacticName}</h3>
            <p>Strategia: {note.strategy}</p>
            <p>Skuteczność: {note.effectiveness}</p>
            <p>Warunki: {note.conditions}</p>
            <p>Data treningu: {note.trainingDate}</p>
            <p>Przeciwnicy: {Array.isArray(note.opponents) ? note.opponents.join(", ") : "Brak"}</p>
          </div>
          <div className="note-actions">
            <button className="edit-button" onClick={() => onEditNote(note)}>Edytuj</button>
            <button className="delete-button" onClick={() => handleDelete(note.id)}>Usuń</button>
            </div>
          </div>
      
        ))
      ) : (
        <p>Brak notatek.</p>
      )}</div>
    </div>
  );
}

// Formularz dodawania notatki
function AddNoteForm({ pokemonId, onAddNote }) {
  const validationSchema = Yup.object({
    tacticName: Yup.string().min(5, 'Minimum 5 znaków').max(50, 'Maksimum 50 znaków').required('Wymagane'),
    strategy: Yup.string().min(10, 'Minimum 10 znaków').required('Wymagane'),
    effectiveness: Yup.number().min(1).max(5).required('Wymagane'),
    conditions: Yup.string().min(10, 'Minimum 10 znaków').required('Wymagane'),
    trainingDate: Yup.date().required('Wymagane'),
    opponents: Yup.array().of(Yup.string()).required('Wymagane'),
  });

  const handleSubmit = (values, { resetForm }) => {
    const note = {
      ...values,
      id: Date.now(),
      pokemonId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const notes = JSON.parse(localStorage.getItem(`notes-${pokemonId}`)) || [];
    localStorage.setItem(`notes-${pokemonId}`, JSON.stringify([...notes, note]));
    onAddNote(note);
    resetForm();
  };

  return (
    <Formik
      initialValues={{
        tacticName: '',
        strategy: '',
        effectiveness: 1,
        conditions: '',
        trainingDate: '',
        opponents: [],
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Field name="tacticName" placeholder="Nazwa taktyki" />
          <ErrorMessage name="tacticName" />
          <Field name="strategy" placeholder="Opis strategii" />
          <ErrorMessage name="strategy" />
          <Field as="select" name="effectiveness">
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{`Skuteczność ${n}`}</option>
            ))}
          </Field>
          <ErrorMessage name="effectiveness" />
          <Field name="conditions" placeholder="Warunki użycia" />
          <ErrorMessage name="conditions" />
          <Field name="trainingDate" type="date" />
          <ErrorMessage name="trainingDate" />
          <div>
            <label>Przeciwnicy (Typy Pokemonów):</label>
            {pokemonTypes.map((type) => (
              <div key={type}>
                <input
                  type="checkbox"
                  value={type}
                  checked={values.opponents.includes(type)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFieldValue("opponents", [...values.opponents, type]);
                    } else {
                      setFieldValue(
                        "opponents",
                        values.opponents.filter((opponent) => opponent !== type)
                      );
                    }
                  }}
                />
                {type}
              </div>
            ))}
          </div>
          <ErrorMessage name="opponents" />
          <button type="submit">Dodaj notatkę</button>
        </Form>
      )}
    </Formik>
  );
}

// Formularz edycji notatki
function EditNoteForm({ pokemonId, note, onSave, onCancel }) {
  const validationSchema = Yup.object({
    tacticName: Yup.string().min(5).max(50).required('Wymagane'),
    strategy: Yup.string().min(10).required('Wymagane'),
    effectiveness: Yup.number().min(1).max(5).required('Wymagane'),
    conditions: Yup.string().min(10).required('Wymagane'),
    trainingDate: Yup.date().required('Wymagane'),
  });

  const handleSubmit = (values) => {
    const updatedNote = { ...note, ...values, updatedAt: new Date() };
    const notes = JSON.parse(localStorage.getItem(`notes-${pokemonId}`)) || [];
    const updatedNotes = notes.map((n) => (n.id === note.id ? updatedNote : n));
    localStorage.setItem(`notes-${pokemonId}`, JSON.stringify(updatedNotes));
    onSave(updatedNote);
  };

  return (
    <Formik
      initialValues={{
        tacticName: note.tacticName,
        strategy: note.strategy,
        effectiveness: note.effectiveness,
        conditions: note.conditions,
        trainingDate: note.trainingDate,
        opponents: note.opponents
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Field name="tacticName" placeholder="Nazwa taktyki" />
          <ErrorMessage name="tacticName" />
          <Field name="strategy" placeholder="Opis strategii" />
          <ErrorMessage name="strategy" />
          <Field as="select" name="effectiveness">
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{`Skuteczność ${n}`}</option>
            ))}
          </Field>
          <Field name="conditions" placeholder="Warunki użycia" />
          <ErrorMessage name="conditions" />
          <Field name="trainingDate" type="date" />
          <ErrorMessage name="trainingDate" />
          <div>
            <label>Przeciwnicy (Typy Pokemonów):</label>
            {pokemonTypes.map((type) => (
              <div key={type}>
                <input
                  type="checkbox"
                  value={type}
                  checked={values.opponents.includes(type)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFieldValue("opponents", [...values.opponents, type]);
                    } else {
                      setFieldValue(
                        "opponents",
                        values.opponents.filter((opponent) => opponent !== type)
                      );
                    }
                  }}
                />
                {type}
              </div>
            ))}
          </div>
          <ErrorMessage name="opponents" />
          <button type="submit">Zapisz zmiany</button>
          <button type="button" onClick={onCancel}>Anuluj</button>
        </Form>
      )}
    </Formik>
  );
}

// Modal do zarządzania formularzami
function NoteModal({ onClose, children }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="delete-button" onClick={onClose}>Zamknij</button>
        {children}
      </div>
    </div>
  );
}

export { NoteModal, AddNoteForm, NotesList, EditNoteForm };
