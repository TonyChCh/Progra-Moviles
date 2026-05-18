import { PROJECT_DETAILS } from '../constants/data';

export function useProject(id: string) {
  // Esta función busca el proyecto, y si no existe, devuelve uno por defecto
  const project = PROJECT_DETAILS[id] || { name: 'Proyecto No Encontrado', tech: 'N/A' };
  
  return project;
}