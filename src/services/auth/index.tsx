import { NextComponentType, NextApiResponse } from "next";
import { useRouter } from "next/router";
import redirect from "nextjs-redirect";
import { useFirebase } from "../../context/firebase";

function withAuth<T>(Component: NextComponentType<T>) {
  const Auth = (props: T) => {
    const router = useRouter();
    const fb = useFirebase();

    // If user is not logged in, return login component
    if (!fb.isAuthenticated()) {
      const Redirect = redirect("/login");
      return <Redirect />;
    }

    // If user is logged in, return original component
    return <Component {...props} />;
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
}

export default withAuth;
