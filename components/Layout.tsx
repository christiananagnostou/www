import Nav from "./Nav";

interface Props {
  children?: React.ReactNode;
  title?: string;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Nav />
      <div className="blur" aria-hidden="true" />

      {children}
    </>
  );
};

export default Layout;
