import type { Metadata } from 'next'; import './globals.css';
export const metadata: Metadata={title:'Vee Portfolio — Alexander Egorov',description:'Product design, systems, and interaction. Explore the work of Alexander Egorov.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
