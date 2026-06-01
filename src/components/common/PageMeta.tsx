import { HelmetProvider, Helmet } from "react-helmet-async";

const PageMeta = ({ title, description }: { title: string; description: string }) => {
  const fullTitle = `${title} | Sistema de Tickets`;

  return (
    <Helmet>
      {/* Usar el título completo evita que React Helmet lo deje en blanco mientras carga */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};
export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
