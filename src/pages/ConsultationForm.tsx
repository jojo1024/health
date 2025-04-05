import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';
import Button from '../components/Button';
import Card from '../components/Card';
import { patients, doctors, medications } from '../data/mockData';
import { DoctorSpecialty, SpecialistType } from '../types';

const ConsultationForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPatientId = searchParams.get('patientId') || '';
  const initialDoctorId = searchParams.get('doctorId') || '';

  const [formData, setFormData] = useState({
    patientId: initialPatientId,
    doctorId: initialDoctorId,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    selectedMedications: [] as string[],
    specialistReferrals: [] as {
      id: string;
      specialistType: SpecialistType;
      reason: string;
    }[]
  });

  const [availableDoctors, setAvailableDoctors] = useState(doctors);

  // Filter specialists if a specialist type is selected
  useEffect(() => {
    if (formData.patientId) {
      // If a patient is selected, filter doctors to show only generals or relevant specialists
      setAvailableDoctors(
        doctors.filter(d => d.specialty === DoctorSpecialty.GENERAL ||
          (d.specialty === DoctorSpecialty.SPECIALIST &&
            formData.specialistReferrals.some(ref =>
              ref.specialistType === d.specialistType
            )
          )
        )
      );
    } else {
      setAvailableDoctors(doctors);
    }
  }, [formData.patientId, formData.specialistReferrals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMedicationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value && !formData.selectedMedications.includes(value)) {
      setFormData(prev => ({
        ...prev,
        selectedMedications: [...prev.selectedMedications, value]
      }));
    }
  };

  const handleRemoveMedication = (medicationId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedMedications: prev.selectedMedications.filter(id => id !== medicationId)
    }));
  };

  const handleAddSpecialistReferral = () => {
    setFormData(prev => ({
      ...prev,
      specialistReferrals: [
        ...prev.specialistReferrals,
        {
          id: uuidv4(),
          specialistType: SpecialistType.OTHER,
          reason: ''
        }
      ]
    }));
  };

  const handleSpecialistReferralChange = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specialistReferrals: prev.specialistReferrals.map(ref =>
        ref.id === id ? { ...ref, [field]: value } : ref
      )
    }));
  };

  const handleRemoveSpecialistReferral = (id: string) => {
    setFormData(prev => ({
      ...prev,
      specialistReferrals: prev.specialistReferrals.filter(ref => ref.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would normally save to an API
    console.log('Form submitted:', formData);

    // For demo purposes, let's just navigate back to consultations
    navigate('/consultations');
  };

  // Get patient and doctor names for display
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : '';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : '';
  };

  const getMedicationName = (medicationId: string) => {
    const medication = medications.find(m => m.id === medicationId);
    return medication ? medication.name : 'Médicament inconnu';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            className="mr-4"
            icon={<ArrowLeftIcon className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Nouvelle Consultation
            </h1>
            <p className="text-gray-500 mt-1">
              Enregistrer une nouvelle consultation médicale
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card title="Informations de base">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                  Patient *
                </label>
                <select
                  id="patientId"
                  name="patientId"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner un patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
                  Médecin *
                </label>
                <select
                  id="doctorId"
                  name="doctorId"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={formData.doctorId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner un médecin</option>
                  {availableDoctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName} ({doctor.specialty}
                      {doctor.specialistType ? ` - ${doctor.specialistType}` : ''})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date de consultation *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes *
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                placeholder="Entrez les notes de consultation..."
                value={formData.notes}
                onChange={handleChange}
                required
              />
            </div>
          </Card>

          <Card title="Prescriptions de médicaments">
            <div>
              <label htmlFor="medication" className="block text-sm font-medium text-gray-700">
                Ajouter un médicament
              </label>
              <div className="mt-1 flex">
                <select
                  id="medication"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value=""
                  onChange={handleMedicationChange}
                >
                  <option value="">Sélectionner un médicament</option>
                  {medications.map(medication => (
                    <option
                      key={medication.id}
                      value={medication.id}
                      disabled={formData.selectedMedications.includes(medication.id)}
                    >
                      {medication.name} ({medication.dosage})
                    </option>
                  ))}
                </select>
              </div>

              {formData.selectedMedications.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Médicaments prescrits:</h4>
                  <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                    {formData.selectedMedications.map(medicationId => (
                      <li key={medicationId} className="flex items-center justify-between py-3 px-4">
                        <span className="text-sm">{getMedicationName(medicationId)}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          icon={<MinusIcon className="w-4 h-4" />}
                          onClick={() => handleRemoveMedication(medicationId)}
                        >
                          Retirer
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>

          <Card title="Référence vers un spécialiste">
            {formData.specialistReferrals.length > 0 && (
              <div className="mb-6 space-y-6">
                {formData.specialistReferrals.map((referral, index) => (
                  <div key={referral.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium text-gray-700">
                        Référence #{index + 1}
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        icon={<MinusIcon className="w-4 h-4" />}
                        onClick={() => handleRemoveSpecialistReferral(referral.id)}
                      >
                        Supprimer
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Type de spécialiste *
                        </label>
                        <select
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          value={referral.specialistType}
                          onChange={(e) => handleSpecialistReferralChange(referral.id, 'specialistType', e.target.value)}
                          required
                        >
                          {Object.values(SpecialistType).map(type => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Raison *
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          placeholder="Raison de la référence..."
                          value={referral.reason}
                          onChange={(e) => handleSpecialistReferralChange(referral.id, 'reason', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              icon={<PlusIcon className="w-5 h-5" />}
              onClick={handleAddSpecialistReferral}
            >
              Ajouter une référence vers un spécialiste
            </Button>
          </Card>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/consultations')}
            >
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer la consultation
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ConsultationForm;
