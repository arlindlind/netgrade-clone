import React, { useEffect, useState } from 'react';
import { IonContent, IonList, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Button from '@/components/Button/Button';
import Header from '@/components/Header/Header';
import FormField from '@/components/Form/FormField';
import { Subject } from '@/db/entities';
import { useSchools, useSubjects, useAddExam } from '@/hooks';
import { Routes } from '@/routes';

const AddExamPage: React.FC = () => {
  const history = useHistory();
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const { data: schools = [] } = useSchools();
  const { data: subjects = [] } = useSubjects();
  const { mutate: addExam } = useAddExam();

  useEffect(() => {
    setSelectedSubject('');
  }, [selectedSchool]);

  const handleSubmit = () => {
    if (!selectedSchool) {
      alert('Bitte wählen Sie eine Schule aus.');
      return;
    }
    if (!selectedSubject) {
      alert('Bitte wählen Sie ein Fach aus.');
      return;
    }
    if (!title.trim()) {
      alert('Bitte geben Sie einen Titel ein.');
      return;
    }
    if (!date) {
      alert('Bitte wählen Sie ein Datum aus.');
      return;
    }

    const newExam = {
      schoolId: selectedSchool,
      subjectId: selectedSubject,
      title: title.trim(),
      date: new Date(date),
      description: description.trim(),
    };

    addExam(newExam);

    setSelectedSchool('');
    setSelectedSubject('');
    setTitle('');
    setDate('');
    setDescription('');
    history.push(Routes.HOME);
  };

  return (
    <IonPage>
      <Header
        title={'Prüfung Hinzufügen'}
        backButton={true}
        defaultHref={Routes.HOME}
      />
      <IonContent>
        <IonList>
          <FormField
            label={'Schule'}
            value={selectedSchool}
            onChange={(value) => setSelectedSchool(String(value))}
            type={'select'}
            options={schools.map((school) => ({
              value: school.id,
              label: school.name,
            }))}
            placeholder={'Wähle eine Schule'}
          />
          <FormField
            label={'Fach'}
            value={selectedSubject}
            onChange={(value) => setSelectedSubject(String(value))}
            type={'select'}
            options={subjects
              .filter(
                (subject: Subject) =>
                  !selectedSchool || subject.schoolId === selectedSchool,
              )
              .map((subject: Subject) => ({
                value: subject.id,
                label: subject.name,
              }))}
            placeholder={'Wähle ein Fach'}
            disabled={!selectedSchool}
          />
          <FormField
            label={'Titel'}
            value={title}
            onChange={(value) => setTitle(String(value))}
            placeholder={'Prüfungstitel'}
          />
          <FormField
            label={'Datum'}
            type={'date'}
            value={date}
            onChange={(value) => setDate(String(value))}
          />
          <FormField
            label={'Beschreibung'}
            value={description}
            onChange={(value) => setDescription(String(value))}
            placeholder={'Optionale Beschreibung'}
          />
        </IonList>
        <Button handleEvent={handleSubmit} text={'Hinzufügen'} />
      </IonContent>
    </IonPage>
  );
};

export default AddExamPage;
