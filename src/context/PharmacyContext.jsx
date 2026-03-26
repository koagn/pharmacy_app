import React, { createContext, useContext, useState } from 'react';

const PharmacyContext = createContext();

export const pharmacies = [
  { id: 1, name: 'Pharmacie Francaise', area: 'Centre ville / Avenue Kennedy', phone: '22 22 14 76', isOnDuty: false, manager: 'Dr. Marie', hours: '8h-20h' },
  { id: 2, name: 'Pharmacie du Soleil', area: 'Avenue Ahmadou Ahidjo', phone: '22 22 14 23', isOnDuty: false, manager: 'Dr. Jean', hours: '8h-22h' },
  { id: 3, name: 'Pharmacie St Martin', area: 'Centre Ville', phone: '22 23 18 69', isOnDuty: false, manager: 'Dr. Paul', hours: '9h-19h' },
  { id: 4, name: 'Phcie du Centre / Labo T Bella', area: 'Immeuble T Bella', phone: '22 22 11 80', isOnDuty: true, manager: 'Dr. Claire', hours: '24/7' },
  { id: 5, name: 'Pharmacie de la Moisson', area: 'Poste Centrale', phone: '22 23 16 19', isOnDuty: false, manager: 'Dr. Pierre', hours: '8h-20h' },
  { id: 6, name: 'Pharmacie Camerounaise', area: 'Cathedrale', phone: '242 00 11 33', isOnDuty: false, manager: 'Dr. Sarah', hours: '9h-21h' },
  { id: 7, name: 'Pharmacie Urbane', area: 'Montée Ane Rouge', phone: '22 23 49 11', isOnDuty: false, manager: 'Dr. Marc', hours: '8h-19h' },
  { id: 8, name: 'Pharmacie de la Vie', area: 'Mokolo (face Fokou)', phone: '22 22 67 87', isOnDuty: true, manager: 'Dr. Anne', hours: '24/7' },
  { id: 9, name: 'Grde Phcie Lyonnaise', area: 'Bata Mokolo', phone: '22 22 47 27', isOnDuty: false, manager: 'Dr. Luc', hours: '8h-20h' },
  { id: 10, name: 'Pharmacie Moliva', area: 'Madagascar (Mobil)', phone: '22 23 00 82', isOnDuty: false, manager: 'Dr. Emma', hours: '9h-20h' },
  { id: 11, name: "Pharmacie les Pétales", area: 'Warda', phone: '22 23 15 97', isOnDuty: false, manager: 'Dr. Thomas', hours: '8h-20h' },
  { id: 12, name: 'Pharmacie Mindili', area: 'Carrefour Obili', phone: '22 31 51 83', isOnDuty: true, manager: 'Dr. Julie', hours: '24/7' },
  { id: 13, name: 'Pharmacie Obili Chapelle', area: 'Obili', phone: 'Not listed', isOnDuty: false, manager: 'Dr. David', hours: '9h-18h' },
  { id: 14, name: 'Pharmacie Bastos', area: 'Bastos', phone: 'Not listed', isOnDuty: true, manager: 'Dr. Sophie', hours: '24/7' },
  { id: 15, name: 'Pharmacie Bethesda Sarl', area: 'Not specified', phone: 'Not listed', isOnDuty: false, manager: 'Dr. Nicolas', hours: '8h-20h' },
  { id: 16, name: 'Pharmacie de la Chapelle', area: 'Not specified', phone: 'Not listed', isOnDuty: false, manager: 'Dr. Isabelle', hours: '9h-19h' },
  { id: 17, name: 'Pharmacie Providence', area: 'Messa', phone: '22 23 11 54', isOnDuty: false, manager: 'Dr. François', hours: '8h-20h' },
  { id: 18, name: "Pharmacie ST Luc", area: 'Mvog-Ada', phone: '22 22 97 55', isOnDuty: false, manager: 'Dr. Catherine', hours: '8h-20h' },
  { id: 19, name: 'Pharmacie du Stade', area: 'Omnisport', phone: '22 20 67 10', isOnDuty: false, manager: 'Dr. Philippe', hours: '9h-21h' },
  { id: 20, name: 'Pharmacie de Melen 8', area: 'Nvelle route Omnis (Av. Foé)', phone: '22 31 68 63', isOnDuty: true, manager: 'Dr. Laurence', hours: '24/7' },
  { id: 21, name: 'Pharmacie Bon Berger', area: 'Nouvelle Route Omnisports', phone: '242 60 67 77', isOnDuty: false, manager: 'Dr. Michel', hours: '8h-20h' },
  { id: 22, name: 'Pharmacie des Capucines', area: 'Not specified', phone: '22 30 53 20', isOnDuty: false, manager: 'Dr. Sylvie', hours: '9h-19h' },
  { id: 23, name: "Pharmacie d'Emana", area: 'Emana', phone: '22 21 42 94', isOnDuty: false, manager: 'Dr. Patrick', hours: '8h-20h' },
  { id: 24, name: 'Phcie Bleue Ngousso Sarl', area: 'Face Hpital Gnral', phone: '22 21 42 10', isOnDuty: true, manager: 'Dr. Christine', hours: '24/7' },
  { id: 25, name: "Pharmacie d'Efoulan", area: 'Efoulan', phone: 'Not listed', isOnDuty: false, manager: 'Dr. André', hours: '8h-20h' },
  { id: 26, name: "Pharmacie de l'Étoile", area: 'Montée Maison Blanche', phone: '222 31 49 62', isOnDuty: false, manager: 'Dr. Monique', hours: '9h-20h' },
  { id: 27, name: 'Efoulan Pharmacy', area: 'Efoulan (near Palais Charles Atangana)', phone: '242 06 74 2', isOnDuty: false, manager: 'Dr. Henri', hours: '8h-19h' },
  { id: 28, name: 'Pharmacie des Manguiers', area: 'Rue Manguiers', phone: '242 06 04 09', isOnDuty: false, manager: 'Dr. Alice', hours: '9h-20h' },
  { id: 29, name: 'Pharmacie Sainte Uriel', area: 'Dernier Poteau - Ekie', phone: '243 89 71 86', isOnDuty: true, manager: 'Dr. Bernard', hours: '24/7' },
  { id: 30, name: 'Pharmacie La Teranga', area: 'Mendong (near Supermarché Dovv)', phone: '698 83 22 97', isOnDuty: false, manager: 'Dr. Chantal', hours: '8h-21h' },
  { id: 31, name: 'Pharmacie Get Better', area: 'Etoug Ebe (Carrefour du Centre des Handicapes)', phone: '655 33 16 36', isOnDuty: false, manager: 'Dr. Robert', hours: '9h-20h' },
  { id: 32, name: 'Pharmacie de la Foi', area: "Petit Marché d'Odza", phone: '234 89 72 04', isOnDuty: false, manager: 'Dr. Marguerite', hours: '8h-20h' },
  { id: 33, name: 'Pharmacie Mandela', area: 'Face CHU', phone: '242 79 29 85', isOnDuty: true, manager: 'Dr. Jacques', hours: '24/7' },
  { id: 34, name: "Pharmacie K'four Moto Georges", area: 'Moto Georges', phone: '242 19 28 27', isOnDuty: false, manager: 'Dr. Hélène', hours: '8h-20h' },
  { id: 35, name: 'Pharmacie Theriaque', area: 'Nkondengui (next to Sous-Prefecture)', phone: '222 30 63 25', isOnDuty: false, manager: 'Dr. Georges', hours: '9h-19h' },
  { id: 36, name: 'Pharmacie Sainte Elisabeth de Nkomo', area: 'Carrefour Nkomo', phone: '243 15 30 58', isOnDuty: false, manager: 'Dr. Françoise', hours: '8h-20h' },
  { id: 37, name: 'Pharmacie Universelle', area: 'Biyem-Assi Biscuiterie', phone: '650 71 43 92', isOnDuty: false, manager: 'Dr. René', hours: '8h-21h' },
  { id: 38, name: 'Pharmacie La Référence', area: 'Not specified', phone: 'Not listed', isOnDuty: false, manager: 'Dr. Yvette', hours: '9h-19h' }
];

export const PharmacyProvider = ({ children }) => {
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [pharmacyList, setPharmacyList] = useState(pharmacies);

  const [pharmacyInventories, setPharmacyInventories] = useState({
    1: ['Paracetamol', 'Amoxicillin', 'Ibuprofen'],
    2: ['Cough Syrup', 'Amoxicillin', 'Vitamin C'],
    3: ['Ibuprofen', 'Aspirin', 'Omeprazole'],
    4: ['Metformin', 'Insulin', 'Paracetamol'],
    5: ['Omeprazole', 'Cetirizine', 'Paracetamol'],
    6: ['Vitamin C', 'Ibuprofen', 'Cough Syrup'],
    7: ['Aspirin', 'Amoxicillin', 'Vitamin C'],
    8: ['Cetirizine', 'Paracetamol', 'Metformin'],
    // add more pharmacy-specific lists as needed
  });

  return (
    <PharmacyContext.Provider value={{ 
      pharmacies: pharmacyList, 
      setPharmacies: setPharmacyList,
      selectedPharmacy, 
      setSelectedPharmacy,
      pharmacyInventories,
      setPharmacyInventories
    }}>
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};