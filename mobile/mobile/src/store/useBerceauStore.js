import { create } from 'zustand';

const useBerceauStore = create((set) => ({
    berceaux: [],  // Tableau d'objets contenant { id, name }
    setBerceaux: (berceaux) => set({ berceaux }),
}));

export default useBerceauStore;
