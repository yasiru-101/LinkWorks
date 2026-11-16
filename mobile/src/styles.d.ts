/**
 * LinkWorks CSS Modules Ambient Type Declarations
 * 
 * Owned by: Bhashitha (Design system & Web styles)
 * 
 * Enables TypeScript import resolution for CSS and CSS Modules (*.css).
 */

declare module '*.css' {
  const classes: Record<string, string>;
  export default classes;
}
