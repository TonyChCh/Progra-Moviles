export const MY_SKILLS = [
  {"name": "HTML/CSS", "level": "basic"}, 
  {"name": "Python", "level": "basic"}, 
  {"name": "Java", "level": "basic"}, 
  {"name": "Base de datos", "level": "basic"},
  {"name": "React Native", "level": "basic"},
  {"name": "Node.js", "level": "basic"}
];

export const PROJECTS_LIST = [
  { id: '1', title: 'Tienda Online', desc: 'Interfaz E-commerce en HTML/CSS' },
  { id: '2', title: 'Sistema Biblioteca', desc: 'Gestión de datos de libros' },
  { id: '3', title: 'Blog Personal', desc: 'Diseño responsivo' },
  { id: '4', title: 'App Clima', desc: 'Pronóstico del clima en tiempo real' },
  { id: '5', title: 'Gestor Tareas', desc: 'Organizador de tareas con React' },
  { id: '6', title: 'Dashboard Analytics', desc: 'Visualización de datos con gráficos' }
];

export const PROJECT_DETAILS: Record<string, { name: string, tech: string }> = {
  '1': { name: 'Tienda Online', tech: 'HTML5, CSS3, JavaScript' },
  '2': { name: 'Sistema Biblioteca', tech: 'Java, MySQL' },
  '3': { name: 'Blog Personal', tech: 'React Native, Expo' },
  '4': { name: 'App Clima', tech: 'Python, Flask, OpenWeather API' },
  '5': { name: 'Gestor Tareas', tech: 'React, Node.js, MongoDB' },
  '6': { name: 'Dashboard Analytics', tech: 'D3.js, Chart.js, HTML/CSS' }
}; 